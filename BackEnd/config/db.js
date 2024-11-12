const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URI, {
        });
        console.log("MongoDB connecté");
    } catch (err) {
        console.error("Erreur de connexion à MongoDB:", err);
        process.exit(1); // Arrête le processus si la connexion échoue
    }
};

module.exports = connectDB;
