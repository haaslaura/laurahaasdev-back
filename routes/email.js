/**
 * Route POST /send
 */
const express = require("express");
const router = express.Router();
const validator = require("validator");

const transporter = require("../config/transporter");
const logEmail = require("../utils/logEmail");
const logError = require("../utils/logError");


router.post("/", async (req, res) => {
    const { name, email, phone, message } = req.body;

    // Sanitize
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedName = validator.escape(name);
    const sanitizedPhone = validator.escape(phone);
    const sanitizedMessage = validator.escape(message);

    if (!validator.isEmail(sanitizedEmail)) {
        return res.status(400).json({ success: false, message: "Adresse email invalide." });
    }

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Nouveau message depuis laura-haas.dev`,
            text: `Nom: ${sanitizedName}\nEmail: ${sanitizedEmail}\nTéléphone: ${sanitizedPhone}\nMessage: ${sanitizedMessage}`,
        });

        logEmail({ name, email, phone, message });

        res.status(200).json({ success: true, message: "Email envoyé avec succès !" });

    } catch (error) {
        console.error(error);
        logError(error);
        res.status(500).json({ success: false, message: "Échec de l'envoi de l'email." });
    }
});

module.exports = router;