const sharp = require("sharp"); // Librairie pour redimensionner et optimiser les images
const fs = require("fs");       // Module pour gérer les opérations sur les fichiers
const path = require("path");    // Module pour manipuler les chemins de fichiers

const processImage = (req, res, next) => {
	if (req.file) { // Vérifie si un fichier a bien été envoyé
		// Remplace l'extension du fichier par .webp
		const webpFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
		// Détermine le chemin pour sauvegarder le fichier converti
		const webpImagePath = path.join("images", webpFilename);

		const newWidth = 400;    // Largeur cible de l'image
		const newHeight = 600;   // Hauteur cible de l'image

		// Redimensionne et convertit l'image en WebP
		sharp(req.file.path)
			.resize(newWidth, newHeight)
			.webp({ quality: 80 }) // Définit la qualité de l'image convertie
			.toFile(webpImagePath, (err, info) => { // Enregistre l'image convertie
				if (err) { // Gère les erreurs de conversion
					console.error("Erreur lors du traitement de l'image");
					return res.status(500).json({
						error: "Erreur lors du traitement de l'image",
					});
				}

				// Supprime l'image d'origine après la conversion
				fs.unlink(req.file.path, (err) => {
					if (err) {
						console.error("Erreur lors de la suppression de l'image");
					} else {
						console.log("Ancienne image supprimée avec succès !");
					}
				});

				req.file.filename = webpFilename; // Met à jour le nom du fichier dans la requête
				next(); // Passe au middleware suivant
			});
	} else {
		next(); // Si aucun fichier, passe simplement au middleware suivant
	}
};

module.exports = processImage; // Exporte la fonction pour l'utiliser dans d'autres fichiers
