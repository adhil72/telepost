"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegram_1 = require("telegram");
const sessions_1 = require("telegram/sessions");
const log_1 = __importDefault(require("../Utils/log"));
const env_1 = __importDefault(require("../Utils/env"));
const checks_1 = require("../Utils/checks");
const USERS_CHANNEL = -1001662032262;
const POSTS_CHANNEL = -1001932017467;
const client = new telegram_1.TelegramClient(new sessions_1.StringSession(env_1.default.STRING_SESSION()), env_1.default.API_ID(), env_1.default.API_HASH(), {
    connectionRetries: 5,
});
const getUser = async (id) => {
    const result = (await client.invoke(new telegram_1.Api.users.GetUsers({
        id: [id],
    })));
    if (result[0] != null) {
        return { username: result[0].username, firstName: result[0].firstName };
    }
    else {
        return { username: "", firstName: "" };
    }
};
const login = async (user) => {
    let message = await searchUsers(user);
    if (message.length == 0) {
        await client.sendMessage(USERS_CHANNEL, { message: JSON.stringify(user) });
        return { code: 200, message: "success" };
    }
    else {
        return { code: 503, message: "user already logged in" };
    }
};
const searchUsers = async (user) => {
    let result = await client.getMessages(USERS_CHANNEL, { search: JSON.stringify(user) });
    if (result.length == 0) {
        result = await client.getMessages(USERS_CHANNEL, { search: user.username });
    }
    return result;
};
const requestHandler = async (message, props) => {
    if (message["req"] == "login") {
        let user = await getUser(props.userId);
        if (user.username == null) {
            await client.sendMessage(props.userId, { message: JSON.stringify({ code: 503, message: "invalid username" }) });
            return;
        }
        if (user.firstName == null) {
            await client.sendMessage(props.userId, { message: JSON.stringify({ code: 503, message: "invalid firstName" }) });
            return;
        }
        let result = await login({ id: props.userId + "", username: user.username, firstname: user.firstName });
        await client.sendMessage(props.userId, { message: JSON.stringify(result) });
    }
    else if (message.req == 'posts') {
        let messages = await client.getMessages(POSTS_CHANNEL, {});
        messages.forEach(async (m) => {
            if (m instanceof telegram_1.Api.Message) {
                let media = m.media;
                if (media != null) {
                    await client.sendFile(props.userId, { file: media, caption: m.message });
                }
                else {
                    await client.sendMessage(props.userId, { message: m.message });
                }
            }
        });
    }
    else if (message.req == 'text') {
        //{"caption":"string"}
        if (message.body.caption == null) {
            await client.sendMessage(props.userId, { message: JSON.stringify({ code: 503, message: "invalid firstName" }) });
            return;
        }
        if (message.body.caption == '') {
            await client.sendMessage(props.userId, { message: JSON.stringify({ code: 503, message: "invalid firstName" }) });
            return;
        }
        message.body.userId = props.userId;
        await client.sendMessage(POSTS_CHANNEL, { message: JSON.stringify(message.body) });
        await client.sendMessage(props.userId, { message: JSON.stringify({ code: 200, message: "success" }) });
    }
};
exports.default = async () => {
    log_1.default.m("connecting to telegram server");
    await client.start({
        phoneNumber: async () => { return "919847900342"; },
        password: async () => { return "adhil123"; },
        phoneCode: async () => await log_1.default.g("Please enter the code you received: "),
        onError: (err) => log_1.default.e(err.message),
    });
    log_1.default.m("connected to telegram server");
    log_1.default.m("listening for requests");
    client.addEventHandler(async (update) => {
        if (update instanceof telegram_1.Api.UpdateShortMessage) {
            //short text message
            let req = update;
            let props = { userId: req.userId.toString(), message: req.message };
            let message = await (0, checks_1.parceJson)(props.message);
            if (message != null)
                await requestHandler(message, props);
            else
                await client.sendMessage(props.userId, { message: JSON.stringify({ code: "503", message: "invalid request" }) });
        }
        else if (update instanceof telegram_1.Api.UpdateNewMessage) {
            //video or image
            if (update.message.peerId.userId == null)
                return;
            if (update.message.media != null) {
                //a media request
                let updt = update.message;
                //request validaton
                let request = (await (0, checks_1.parceJson)(updt.message));
                if (request.body == null) {
                    await client.sendMessage(updt.peerId.userId, { message: JSON.stringify({ code: "503", message: "invalid request" }) });
                    return;
                }
                if (request.body.caption == null) {
                    await client.sendMessage(updt.peerId.userId, { message: JSON.stringify({ code: "503", message: "invalid request" }) });
                    return;
                }
                request.body.userId = updt.peerId.userId;
                await client.sendFile(POSTS_CHANNEL, { file: updt.media, caption: JSON.stringify(request.body) });
                await client.sendMessage(request.body.userId, { message: JSON.stringify({ code: "200", message: "success" }) });
            }
        }
    });
};
