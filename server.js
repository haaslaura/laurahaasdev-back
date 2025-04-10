require("dotenv").config();

const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");

const emailRoutes = require("./routes/email")

const app = express();
const PORT = 4000;

app.use(express.json());

// Prevent requests from other sites
// app.use(cors()); // local env
app.use(cors({
    origin: "https://laura-haas.dev",
    methods: ["POST"],
}));

// Anti spam
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 min
    max: 3, // max 3 requests per minute
    message: {
        success: false,
        message: "Trop de tentatives. Réessayer dans une minute."
    },
});

app.use("/send", limiter);

// Routes
app.use("/send", emailRoutes);

// Start the server
// app.listen(PORT, () => console.log(`Serveur en écoute sur http://localhost:${PORT}`));
app.listen(PORT, () => console.log(`Serveur en écoute sur https://api.mailer.laura-haas.dev:${PORT}`));