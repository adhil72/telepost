"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const log_1 = __importDefault(require("../Utils/log"));
const env_1 = __importDefault(require("../Utils/env"));
const DATABASE_CHANNEL = -1001904275709;
const MESSAGES_CHANNEL = -1001969063685;
const client = new telegram_1.TelegramClient(new sessions_1.StringSession(env_1.default.STRING_SESSION()), env_1.default.API_ID(), env_1.default.API_HASH(), {
    connectionRetries: 5,
});
exports.default = {
    config: async () => {
        log_1.default.m("connecting to telegram server");
        await client.start({
            phoneNumber: async () => { return "918075497228"; },
            password: async () => { return "adhil123"; },
            phoneCode: async () => await log_1.default.g("Please enter the code you received: "),
            onError: (err) => log_1.default.e(err.message),
        });
        log_1.default.m("connected to telegram server");
    },
    userLogin: async (user) => {
        log_1.default.m("create user request: O");
        const messages = await client.getMessages(DATABASE_CHANNEL, {});
        const searchResults = messages.filter((message) => {
            return message.message && message.message.includes(JSON.stringify(user));
        });
        if (searchResults.length == 0) {
            await client.sendMessage(DATABASE_CHANNEL, { message: JSON.stringify(user) });
            log_1.default.m("create user request: done");
            return 200;
        }
        else {
            log_1.default.m("create user request: done");
            return 503;
        }
    },
    addPost: async (entity) => {
        const messages = await client.getMessages(DATABASE_CHANNEL, {});
        const searchResults = messages.filter((message) => {
            return message.message && message.message.includes(JSON.stringify(entity.user));
        });
        if (searchResults) {
            await client.sendMessage(MESSAGES_CHANNEL, { message: JSON.stringify(entity) });
            return 200;
        }
        else {
            return 404;
        }
    }
};
