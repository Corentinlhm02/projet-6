const BookModel = require("../models/book.model");
const fs = require('fs');
const path = require('path');

exports.createBook = (req, res, next) => {
  try {
    const bookObject = JSON.parse(req.body.book); 
    delete bookObject._id;
    delete bookObject._userId;

    const newFileName = req.file.filename.split(".")[0]+ ".webp";
    const book = new BookModel({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${newFileName}`
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
      // return res.status(400).json({ message: 'Livre non trouvé' });
    } else {
      console.log({ userId, grade: req.body.rating });
      // Sinon, ajouter la nouvelle note
      book.ratings.push({ userId, grade: req.body.rating });
    }

    // Recalculer la moyenne des notes
    const totalRatings = book.ratings.length;
    const sumRatings = book.ratings.reduce((sum, r) => sum + r.grade, 0);
    book.averageRating = sumRatings / totalRatings;

    // Sauvegarder le livre avec la nouvelle note et la moyenne
   await book.save()
        .then(() => {
          console.log(book);
          console.log(req.params.id);
          res.status(201).json(book);
        })
        .catch((error) => res.status(500).json({ error }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// modifier un livre
exports.editBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    // Récupération du livre existant pour accéder aux données actuelles
    const book = await BookModel.findOne({ _id: bookId });
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérification que l'utilisateur est bien le propriétaire du livre
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Non autorisé à modifier ce livre" });
    }

    // Préparer l'objet bookObject : vérifier si req.file et req.body.book sont définis
    const bookObject = req.file
      ? {
          ...JSON.parse(req.body.book || "{}"), // Définit un objet vide par défaut si req.body.book est indéfini
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split(".")[0]}.webp`,
        }
      : { ...req.body }; // Utiliser req.body directement si aucune image n'est envoyée

    // Si un nouveau fichier image est envoyé, supprimer l'ancienne image
    if (req.file) {
      const filename = book.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, (err) => {
        if (err) {
          console.error("Erreur lors de la suppression de l'ancienne image :", err);
        }
      });
    }

    // Mise à jour du livre avec les nouvelles données, en conservant l'URL de l'image si aucune nouvelle image n'est envoyée
    await BookModel.updateOne({ _id: bookId }, { ...bookObject, _id: bookId });
    res.status(200).json({ message: "Livre modifié avec succès !" });
  } catch (error) {
    console.error("Erreur lors de la modification du livre :", error);
    res.status(400).json({ error: error.message });
  }
};



// supprimer un livre

exports.deleteBook = async (req, res) => {
  try {
    // Trouver le livre pour récupérer l'image associée
    const book = await BookModel.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Récupérer le nom de l'image depuis l'URL
    const filename = book.imageUrl.split('/images/')[1];
    const imagePath = path.join(__dirname, '..', 'images', filename);

    // Supprimer le livre de la base de données
    await BookModel.findByIdAndDelete(req.params.id);

    // Supprimer l'image associée
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Erreur lors de la suppression de l'image:", err);
      } else {
        console.log("Image supprimée avec succès.");
      }
    });

    res.status(200).json({ message: 'Livre et image supprimés avec succès' });
  } catch (error) {
    console.error("Erreur lors de la suppression du livre :", error);
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
