/**
 * Success log
 */
const fs = require("fs");

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

module.exports = logEmail;