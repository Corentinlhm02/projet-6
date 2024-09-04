const express = require('express');
const connectDB = require("./config/db.js");
const dotenv = require("dotenv").config();
const bookRoutes = require("./routes/books")

// connexion à la base de donnée
connectDB();


const app = express();

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});

app.use("/api/books", bookRoutes);
module.exports = app;
