require("dotenv").config();

const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");

const emailRoutes = require("./routes/email")

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
// Prevent requests from other sites
// app.use(cors({
//     origin: "https://laura-haas.dev",
//     methods: ["POST"],
// }));

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
app.listen(PORT, () => console.log(`Serveur en écoute sur http://localhost:${PORT}`));