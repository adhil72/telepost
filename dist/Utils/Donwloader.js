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
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloader = void 0;
const http = __importStar(require("http"));
const https = __importStar(require("https"));
const fs = __importStar(require("fs"));
const uploads_1 = require("telegram/client/uploads");
exports.downloader = {
    download: (fileUrl) => {
        return new Promise((r) => {
            const protocol = fileUrl.startsWith('https') ? https : http;
            protocol.get(fileUrl, (response) => {
                if (response.statusCode !== 200) {
                    console.error(`Failed to download file, status code: ${response.statusCode}`);
                    r(null);
                    return;
                }
                var path_name = fileUrl.split('/')[fileUrl.split('/').length - 1];
                const fileStream = fs.createWriteStream(path_name);
                response.pipe(fileStream);
                fileStream.on('finish', () => {
                    fileStream.close();
                    r(new uploads_1.CustomFile(path_name, fs.statSync(path_name).size, path_name));
                    console.log('File downloaded successfully');
                });
            }).on('error', (error) => {
                console.error(`Error downloading file: ${error.message}`);
            });
        });
    }
};
