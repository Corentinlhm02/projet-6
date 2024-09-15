const BookModel = require("../models/book.model");

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



// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error });
  }
};
