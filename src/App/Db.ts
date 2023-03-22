import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import log from "../Utils/log"
import env from "../Utils/env"
import { user, post } from "../Utils/types"
import { userFound } from "../Utils/Erros";
import { downloader } from "../Utils/Donwloader";
import * as bigInt from 'big-integer';
import { unlinkSync } from "fs";
import { unlink } from "fs/promises";

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
            if (user.username == null) {
                return 504
            } else {
                await client.sendMessage(DATABASE_CHANNEL, { message: JSON.stringify(user) })
            }
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

            if (entity.messageType = 'f') {
                var fileUrl = `https://api.telegram.org/file/bot${env.BOT_TOKEN()}/${entity.content.split('<::>')[1]}`

                //uploading file
                let downloaded = await downloader.download(fileUrl)
                if (downloaded != null) {
                    const result = await client.uploadFile({
                        file: downloaded, workers: 5
                    })

                    var content = entity.content.split('<::>')
                    content[1] = result.id + ""
                    entity.content = content.join('<::>')
                    await client.sendFile(MESSAGES_CHANNEL, { file: result.name, caption: JSON.stringify(entity) })
                    await unlink(fileUrl.split('/')[fileUrl.split('/').length-1])
                    return 200
                } else {
                    return 503
                }



            } else {
                await client.sendMessage(MESSAGES_CHANNEL, { message: JSON.stringify(entity) })
            }

            return 200
        } else {
            return 404
        }
    },
    getPosts: async () => {
        let messages = await client.getMessages(MESSAGES_CHANNEL, {})

        messages = messages.filter((message) => {
            return message.message 
        });
        

        return messages

    }

}

function numberToBytes(number: number) {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, number);

    const uint8Array = new Uint8Array(buffer);

    const bigInteger = bigInt.fromArray([...uint8Array], 256);

    return bigInteger;
}