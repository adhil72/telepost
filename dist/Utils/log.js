"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    m: (message) => {
        console.log("\x1b[32m", `message: ${message}`);
    },
    e: (message) => {
        console.log("\x1b[31m", `message: ${message}`);
    },
    g: (question) => {
        return new Promise((r) => {
            const readline = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });
            readline.question(question, (answer) => {
                r(answer);
                readline.close();
            });
        });
    }
};
