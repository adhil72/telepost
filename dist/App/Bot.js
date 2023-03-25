"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const env_1 = __importDefault(require("../Utils/env"));
const Db_1 = __importDefault(require("./Db"));
const types_1 = require("../Utils/types");
const checks_1 = require("../Utils/checks");
const log_1 = __importDefault(require("../Utils/log"));
const stream_1 = require("stream");
const bot = new grammy_1.Bot(env_1.default.BOT_TOKEN());
exports.default = {
    run: async () => {
        await Db_1.default.config();
        bot.command('login', async (ctx) => {
            let user = ctx.chat;
            let res = await Db_1.default.userLogin(user);
            ctx.reply(res + "");
        });
        bot.command("posts", async (ctx) => {
            let time = new Date();
            log_1.default.m("BOT: posts request");
            var posts = await Db_1.default.getPosts();
            posts.forEach(async (p) => {
                let message = (await (0, checks_1.parceJson)(p.message));
                if (message.messageType == 'f') {
                    let file = await Db_1.default.downloadFile(message);
                    ctx.replyWithPhoto(new grammy_1.InputFile(stream_1.Readable.from(file)), { caption: p.message });
                }
                else {
                    ctx.reply(p.message);
                }
            });
            log_1.default.m(`BOT: posts request done in ${new Date().getTime() - time.getTime()}`);
        });
        bot.on('message:text', async (ctx) => {
            let time = new Date();
            log_1.default.m("BOT: text message request");
            let message = await (0, checks_1.parceJson)(ctx.message.text);
            if (message) {
                if ((0, checks_1.isType)(types_1.postObject, message)) {
                    let msg = message;
                    if (msg.messageType == 't') {
                        let res = await Db_1.default.addPost(msg);
                        ctx.reply(res + "");
                    }
                    else {
                        ctx.reply("503");
                    }
                }
                else {
                    ctx.reply("503");
                }
            }
            else {
                ctx.reply("503");
            }
            log_1.default.m(`BOT: text message request done in ${new Date().getTime() - time.getTime()}`);
        });
        bot.on(['message:photo', 'message:video'], async (ctx) => {
            let time = new Date();
            log_1.default.m("BOT: media message request");
            if (ctx.message.caption == null) {
                ctx.reply("503 no caption");
                return;
            }
            let message = await (0, checks_1.parceJson)(ctx.message.caption);
            if (message) {
                message.user = ctx.chat;
                if ((0, checks_1.isType)(types_1.postObject, message)) {
                    let msg = message;
                    if (msg.messageType == 'f') {
                        let file = await ctx.getFile();
                        if (!file.file_path) {
                            ctx.reply("503 no file path");
                            return;
                        }
                        msg.content += "<::>" + file.file_path;
                        let res = await Db_1.default.addPost(msg);
                        ctx.reply(res + "");
                    }
                    else {
                        ctx.reply("503 ");
                    }
                }
                else {
                    ctx.reply("503 incoreect message type");
                }
            }
            else {
                ctx.reply("503 not parcable");
            }
            log_1.default.m(`BOT: media message request done in ${time.getTime() - new Date().getTime()}`);
        });
        bot.catch((e) => {
            bot.api.sendMessage('me', e.message);
        });
        bot.start();
    }
};
