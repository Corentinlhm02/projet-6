const UserModel = require("../models/user.model")
const BookModel = require("../models/book.model")

module.exports.getPosts = async (req, res) => {
    const posts = await BookModel.find();
    res.status(200).json(posts);
  };
  
  module.exports.setPosts = async (req, res) => {
    if (!req.body.message) {
      res.status(400).json({ title: "Merci d'ajouter un titre" });
    }
  
    const post = await BookModel.create({
      title: req.body.title,
      author: req.body.author,
    });
    res.status(200).json(post);
  };

const Book = require('../models/book.model');

exports.addReview = (req, res) => {
    const { userId, reviewText } = req.body;
    const bookId = req.params.bookId;

    Book.findById(bookId)
        .then(book => {
            if (!book) {
                return res.status(404).json({ error: 'Livre non trouvé !' });
            }
            // Ajout de l'avis dans le tableau des reviews
            book.reviews.push({ userId, reviewText });
            return book.save();
        })
        .then(() => res.status(201).json({ message: 'Avis ajouté avec succès !' }))
        .catch(error => res.status(500).json({ error: error.message }));
};
