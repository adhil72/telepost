"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const log_1 = __importDefault(require("../Utils/log"));
const env_1 = __importDefault(require("../Utils/env"));
const Donwloader_1 = require("../Utils/Donwloader");
const bigInt = __importStar(require("big-integer"));
const promises_1 = require("fs/promises");
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
            if (user.username == null) {
                return 504;
            }
            else {
                await client.sendMessage(DATABASE_CHANNEL, { message: JSON.stringify(user) });
            }
            log_1.default.m("create user request: done");
            return 200;
        }
        else {
            log_1.default.m("create user request: done");
            return 200;
        }
    },
    addPost: async (entity) => {
        const messages = await client.getMessages(DATABASE_CHANNEL, {});
        const searchResults = messages.filter((message) => {
            return message.message && message.message.includes(JSON.stringify(entity.user));
        });
        if (searchResults) {
            if (entity.messageType = 'f') {
                var fileUrl = `https://api.telegram.org/file/bot${env_1.default.BOT_TOKEN()}/${entity.content.split('<::>')[1]}`;
                //uploading file
                let downloaded = await Donwloader_1.downloader.download(fileUrl);
                if (downloaded != null) {
                    const result = await client.uploadFile({
                        file: downloaded, workers: 5
                    });
                    console.log(result.id, result.name, result.originalArgs, result.toJSON());
                    var content = entity.content.split('<::>');
                    content[1] = result.id + "";
                    entity.content = content.join('<::>');
                    await client.sendFile(MESSAGES_CHANNEL, { file: result.name, caption: JSON.stringify(entity) });
                    await (0, promises_1.unlink)(fileUrl.split('/')[fileUrl.split('/').length - 1]);
                    return 200;
                }
                else {
                    return 503;
                }
            }
            else {
                await client.sendMessage(MESSAGES_CHANNEL, { message: JSON.stringify(entity) });
            }
            return 200;
        }
        else {
            return 404;
        }
    },
    getPosts: async () => {
        let messages = await client.getMessages(MESSAGES_CHANNEL, {});
        messages = messages.filter((message) => {
            return message.message;
        });
        return messages;
    },
    downloadFile: (message) => {
        let file_path = __dirname + '/tmp/' + new Date().getTime() + ".png";
        return client.downloadMedia(message, { outputFile: file_path, progressCallback: (t, d) => {
                log_1.default.e((parseInt((d.toJSNumber() / t.toJSNumber()).toString()) * 100));
            } });
        console.log(file_path);
    }
};
function numberToBytes(number) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, number);
    const uint8Array = new Uint8Array(buffer);
    const bigInteger = bigInt.fromArray([...uint8Array], 256);
    return bigInteger;
}
