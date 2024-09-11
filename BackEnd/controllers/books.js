const BookModel = require("../models/book.model");

exports.createBook = (req, res, next) => {
  console.log("--------------------------------------------------------------------- :", req); 
  delete req.body._id;

  const book = new BookModel({
    ...req.body
  });

  // Sauvegarder le livre dans la base de données
  book.save()
    .then(() => res.status(201).json({ message: 'Livre ajouté avec succès !' }))
    .catch(error => {
      console.error("Erreur lors de la sauvegarde du livre :", error);
      res.status(400).json({ error });
    });
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

// // Fonction pour ajouter un livre
// module.exports.setPosts = async (req, res) => {
//   // Validation du titre et de l'auteur
//   if (!req.body.title || !req.body.author) {
//     return res.status(400).json({ message: "Merci de fournir un titre et un auteur" });
//   }

//   try {
//     // Création d'un nouveau livre
//     const book = await BookModel.create({
//       title: req.body.title,
//       author: req.body.author,
//       description: req.body.description
//     });

//     res.status(201).json(book);
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// };

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    await BookModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Livre supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ error });
  }
};
