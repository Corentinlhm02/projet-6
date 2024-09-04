const UserModel = require("../model/user.model")
const BookModel = require("../model/book.model")

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