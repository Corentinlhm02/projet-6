const express = require('express');
const connectDB = require("./config/db.js");
const dotenv = require("dotenv").config();
const cors = require('cors');
const bookRoutes = require("./routes/books");
const authRoutes = require('./routes/auth');
const Book = require("./models/book.model.js")
app.use(express.json());

// Connexion à la base de données
connectDB();

const app = express();

app.post('/api/books', (req, res, next) => {
  delete req.body._id;
  const book = new Book({
    ...req.body
  });
  Book.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/books', (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
});

app.get('/api/books/:id', (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
});


// Utilisation de CORS pour permettre les requêtes depuis le front-end
app.use(cors({ origin: 'http://localhost:3000' }));

// Middleware pour parser les corps de requêtes en JSON
app.use(express.json());

// Middleware pour logger les requêtes
app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes); 

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Export de l'application
module.exports = app;
