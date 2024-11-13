const sharp = require("sharp");
const fs = require("fs");
const path = require("path");


const processImage = (req, res, next) => {
	if (req.file) {
		const originalImagePath = req.file.path; // Sauvegarde du chemin de l'ancienne image
		

		const webpFilename = req.file.filename.replace(/\.[^.]+$/, ".webp");
		const webpImagePath = path.join("images", webpFilename);

		const newWidth = 400;
		const newHeight = 600;
		

	// 	// Traitement de l'image avec sharp
		sharp(req.file.path)
			.resize(newWidth, newHeight)
			.webp({ quality: 80 })
			.toFile(webpImagePath, (err, info) => {
				if (err) {
					console.error("Erreur lors du traitement de l'image", err);
					return res.status(500).json({
						error: "Erreur lors du traitement de l'image",
					});
				}

				// Supprimer l'ancienne image en utilisant le chemin sauvegardé
				fs.unlink(originalImagePath, (err) => {
					if (err) {
						console.error("Erreur lors de la suppression de l'ancienne image:", err);
					} else {
						console.log("Ancienne image supprimée avec succès.");
					}
				});
				// Mettre à jour le fichier avec le nom WebP
				req.file.filename = webpFilename;
				req.file.path = webpImagePath; // Mettre à jour le chemin du fichier

				console.log("Traitement réussi, suppression de l'ancienne image...");
				
				// Appeler le prochain middleware ou la route
			});
			sharp.cache(false);		
			next();						
	} else {
		// Si aucun fichier n'est envoyé, on passe au prochain middleware
		next();
	}
};

module.exports = processImage;
