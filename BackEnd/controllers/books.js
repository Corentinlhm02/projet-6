const BookModel = require("../models/book.model");
const fs = require('fs');

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book); 
    delete bookObject._id;
    delete bookObject._userId;

    const book = new BookModel({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
      .then(() => res.status(201).json({ message: 'Livre enregistré avec succès !' }))
      .catch(error => {
        console.error("Erreur lors de la sauvegarde du livre :", error);
        res.status(400).json({ error });
      });
  } catch (error) {
    console.error("Erreur lors du parsing de req.body.thing :", error);
    res.status(400).json({ error: "Invalid request data" });
  }
};




// Fonction pour obtenir tous les livres
module.exports.getPosts = async (req, res) => {
  try {
    const books = await BookModel.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports.getBookById = async (req, res, next) => {
  BookModel.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

exports.rateBook = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.auth.userId;

    // Récupérer le livre par son ID
    const book = await BookModel.findOne({ _id: req.params.id });

    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    // Vérifier si l'utilisateur a déjà noté ce livre
    const existingRating = book.ratings.find((r) => r.userId === userId);

    if (existingRating) {
      // Si l'utilisateur a déjà noté, mettre à jour la note
      existingRating.grade = rating;
    } else {
      // Sinon, ajouter la nouvelle note
      book.ratings.push({ userId, grade: rating });
    }

    // Recalculer la moyenne des notes
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = sumRatings / totalRatings;

    // Sauvegarder le livre avec la nouvelle note et la moyenne
    await book.save();

    res.status(200).json({ message: 'Note ajoutée avec succès', book });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// modifier un livre
exports.editBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const bookObject = req.file ? 
      {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      } 
      : { ...req.body };

    // On supprime userId du body pour empêcher la modification de celui-ci
    delete bookObject._userId;

    // Récupération du livre à modifier
    const book = await BookModel.findOne({ _id: bookId });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérification que l'utilisateur est bien le propriétaire du livre
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autorisé à modifier ce livre" });
    }

    // Si un nouveau fichier image est envoyé, supprimer l'ancienne image
    if (req.file) {
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) console.error('Erreur lors de la suppression de l\'ancienne image :', err);
      });
    }

    // Mise à jour du livre avec les nouvelles données
    await BookModel.updateOne({ _id: bookId }, { ...bookObject, _id: bookId });
    res.status(200).json({ message: 'Livre modifié avec succès !' });
  } catch (error) {
    console.error('Erreur lors de la modification du livre :', error);
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getBestRatedBooks = async (req, res) => {
  try {
    // Chercher les livres et les trier par averageRating décroissant, puis limiter le résultat à 3 livres
    const bestRatedBooks = await BookModel.find().sort({ averageRating: -1 }).limit(3);
    
    res.status(200).json(bestRatedBooks);
  } catch (error) {
    console.error('Erreur lors de la récupération des meilleurs livres :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des meilleurs livres.' });
  }
};
