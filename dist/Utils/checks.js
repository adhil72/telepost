"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isType = exports.parceJson = void 0;
const log_1 = __importDefault(require("./log"));
const parceJson = (text) => {
    return new Promise((r) => {
        try {
            let parceble = JSON.parse(text);
            r(parceble);
        }
        catch (error) {
            log_1.default.e(error);
            r(null);
        }
    });
};
exports.parceJson = parceJson;
const isType = (obj1, obj2) => {
    let verified = true;
    Object.keys(obj1).map((v) => {
        let key = v;
        if (obj2[key] == null) {
            verified = false;
        }
    });
    return verified;
};
exports.isType = isType;
