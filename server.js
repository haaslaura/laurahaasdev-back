require("dotenv").config();

const cors = require("cors");
const express = require("express");

const fs = require("fs");
const path = require("path");

const validator = require("validator");

const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const app = express();
const PORT = 5000;


// Configure an email limit
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // max 3 requêtes par minute
    message: {
        success: false,
        message: "Trop de tentatives. Réessayer dans une minute."
    },
});


// Classic middleware
app.use(express.json());
app.use("/send", limiter);

// Prevent requests from other sites
// app.use(cors({
//     origin: "https://laura-haas.dev",
//     methods: ["POST"],
// }));
app.use(cors());

// Configuring the Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Log email
function logEmail({ name, email, phone, message }) {
    const logEntry = `
  [${new Date().toISOString()}]
  Nom : ${name}
  Email : ${email}
  Téléphone : ${phone}
  Message : ${message}
  ---------------------------
  `;
    
    fs.appendFile("emails.log", logEntry, (err) => {
        if (err) console.error("Erreur lors de l'écriture dans le fichier log :", err);
    });
};

// Log error
function logError(error) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] sending message - ${error.stack || error.message}\n`;
    fs.appendFileSync(path.join(__dirname, "errors.log"), logMessage);
};


// Route to send an email
app.post("/send", async (req, res) => {
        
    const { name, email, phone, message } = req.body;
    
    // Prevent code or injection attempts in the fields
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedName = validator.escape(name);
    const sanitizedPhone = validator.escape(phone);
    const sanitizedMessage = validator.escape(message);
    
    if (!validator.isEmail(sanitizedEmail)) {
        return res.status(400).json({ success: false, message: "Adresse email invalide." });
    }
    
    try {

        throw new Error("Test d'erreur")

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `Nouveau message depuis laura-haas.dev`,
            text: `Nom: ${sanitizedName}\nEmail: ${sanitizedEmail}\nTéléphone: ${sanitizedPhone}\nMessage: ${sanitizedMessage}`,
        });
        
        // local log
        logEmail({ name, email, phone, message });
        
        res.status(200).json({ success: true, message: "Email envoyé avec succès !" });
        
    } catch (error) {
        console.error(error);
        logError(error);
        res.status(500).json({ success: false, message: "Échec de l'envoi de l'email." });
    }
});


// Start the server
app.listen(PORT, () => console.log(`Serveur en écoute sur http://localhost:${PORT}`));