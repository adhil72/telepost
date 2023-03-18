"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Db_1 = __importDefault(require("./App/Db"));
Db_1.default.config().then(() => {
    Db_1.default.addPost({ user: { name: "adhil", phone: "918075497228" }, messageType: 'i', content: "https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q<::>good" });
});
