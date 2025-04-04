/**
 * Error log
 */
const fs = require("fs");
const path = require("path");

function logError(error) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] sending message - ${error.stack || error.message}\n`;
    fs.appendFileSync(path.join(__dirname, "errors.log"), logMessage);
};

module.exports = logError;