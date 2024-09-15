const express = require('express');
const connectDB = require("./config/db.js");
const dotenv = require("dotenv").config();
const cors = require('cors');
const path = require('path');
const bookRoutes = require("./routes/books");
const authRoutes = require('./routes/auth');
const Book = require("./models/book.model.js");

// Initialisation de l'application Express (cette ligne doit être avant l'utilisation d'app)
const app = express();

// Connexion à la base de données
connectDB();

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
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware pour gérer les erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Export de l'application
module.exports = app;
