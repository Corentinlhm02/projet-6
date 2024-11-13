const multer = require("multer");
const path = require("path");

// Liste des extensions autorisées
const whitelist = [".png", ".jpeg", ".jpg", ".webp"];

const storage = multer.diskStorage({
  // Dossier de stockage des fichiers
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // Définir le nom de fichier (en ajoutant un timestamp pour éviter les conflits)
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Remplace les espaces par des underscores
    callback(null, Date.now() + name); // Ajoute un timestamp pour rendre le nom unique
  },
});

// Fonction de filtrage des fichiers
const filter = (req, file, callback) => {
  const ext = path.extname(file.originalname).toLowerCase(); // Récupère l'extension du fichier et la met en minuscule

  // Si l'extension n'est pas dans la whitelist, on renvoie une erreur
  if (!whitelist.includes(ext)) {
    return callback(new Error("Ce type de fichier n'est pas autorisé"));
  }

  callback(null, true); // Si l'extension est autorisée, on passe le fichier
};


module.exports = multer({
  storage: storage,
  fileFilter: filter, // Utilise le filtre d'extension
}).single("image"); // Le champ du formulaire est 'image'
