const express = require('express');
const booksController = require("../controllers/books");
const router = express.Router();
  
router.get("/", booksController.getPosts);


module.exports = router;
