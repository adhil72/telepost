"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = {
    API_ID: () => {
        var value = process.env.API_ID;
        if (!value) {
            throw new Error("Missing : API_ID");
        }
        return parseInt(value);
    },
    API_HASH: () => {
        var value = process.env.API_HASH;
        if (!value) {
            throw new Error("Missing : API_HASH");
        }
        return value;
    },
    STRING_SESSION: () => {
        var value = process.env.STRING_SESSION;
        if (value == null) {
            return "";
            throw new Error("Missing : STRING_SESSION");
        }
        return value;
    },
    BOT_TOKEN: () => {
        var value = process.env.BOT_TOKEN;
        if (!value) {
            throw new Error("Missing : BOT_TOKEN");
        }
        return value;
    }
};
