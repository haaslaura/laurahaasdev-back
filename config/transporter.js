/**
 * Nodemailer configuration
 */
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.EMAIL_PASS
    }
});

module.exports = transporter;