import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import log from "../Utils/log"
import env from "../Utils/env"
import { user, post } from "../Utils/types"
import { userFound } from "../Utils/Erros";

const DATABASE_CHANNEL = -1001904275709
const MESSAGES_CHANNEL = -1001969063685


const client = new TelegramClient(new StringSession(env.STRING_SESSION()), env.API_ID(), env.API_HASH(), {
    connectionRetries: 5,
});
export default {
    config: async () => {
        log.m("connecting to telegram server")

        await client.start({
            phoneNumber: async () => { return "918075497228" },
            password: async () => { return "adhil123" },
            phoneCode: async () =>
                await log.g("Please enter the code you received: "),
            onError: (err) => log.e(err.message),
        });
        log.m("connected to telegram server");
    },
    userLogin: async (user: user) => {
        log.m("create user request: O")
        const messages = await client.getMessages(DATABASE_CHANNEL, {})
        const searchResults = messages.filter((message) => {
            return message.message && message.message.includes(JSON.stringify(user));
        });
        if (searchResults.length == 0) {
            await client.sendMessage(DATABASE_CHANNEL, { message: JSON.stringify(user) })
            log.m("create user request: done")
            return 200
        } else {
            log.m("create user request: done")
            return 503
        }
    },
    addPost: async (entity: post) => {
        const messages = await client.getMessages(DATABASE_CHANNEL, {})
        const searchResults = messages.filter((message) => {
            return message.message && message.message.includes(JSON.stringify(entity.user));
        });
        if (searchResults) {
            await client.sendMessage(MESSAGES_CHANNEL, { message: JSON.stringify(entity) })
            return 200
        } else {
            return 404
        }
    }

}