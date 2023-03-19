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
const bot = new grammy_1.Bot(env_1.default.BOT_TOKEN());
exports.default = {
    run: async () => {
        await Db_1.default.config();
        bot.command('login', async (ctx) => {
            let user = ctx.chat;
            let res = await Db_1.default.userLogin(user);
            ctx.reply(res + "");
        });
        bot.on('message:text', async (ctx) => {
            let time = new Date();
            log_1.default.m("BOT: text message request");
            let message = await (0, checks_1.parceJson)(ctx.message.text.replace('\n', ''));
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
            log_1.default.m(`BOT: text message request done in ${time.getTime() - new Date().getTime()}`);
        });
        bot.on(['message:photo', 'message:video'], async (ctx) => {
            let time = new Date();
            log_1.default.m("BOT: media message request");
            if (ctx.message.caption == null) {
                ctx.reply("503");
                return;
            }
            let message = await (0, checks_1.parceJson)(ctx.message.caption.replace('\n', ''));
            if (message) {
                if ((0, checks_1.isType)(types_1.postObject, message)) {
                    let msg = message;
                    if (msg.messageType == 'f') {
                        let file = await ctx.getFile();
                        if (!file.file_path) {
                            ctx.reply("503");
                            return;
                        }
                        msg.content += "<::>" + file.file_path;
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
            log_1.default.m(`BOT: media message request done in ${time.getTime() - new Date().getTime()}`);
        });
        bot.start();
    }
};
