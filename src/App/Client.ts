import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import log from "../Utils/log"
import env from "../Utils/env"
import { parceJson } from "../Utils/checks";
import { request, user } from "../Utils/types";


const USERS_CHANNEL = -1001662032262
const POSTS_CHANNEL = -1001932017467


const client = new TelegramClient(new StringSession(env.STRING_SESSION()), env.API_ID(), env.API_HASH(), {
    connectionRetries: 5,
});

const getUser = async (id: string): Promise<{ username: string, firstName: string }> => {
    const result = (await client.invoke(
        new Api.users.GetUsers({
            id: [id],
        })
    )) as any
    if (result[0] != null) {
        return { username: result[0].username, firstName: result[0].firstName }
    } else {
        return { username: "", firstName: "" }
    }
}
const login = async (user: user) => {
    let message = await searchUsers(user)
    if (message.length == 0) {
        await client.sendMessage(USERS_CHANNEL, { message: JSON.stringify(user) })
        return { code: 200, message: "success" }
    } else {
        return { code: 503, message: "user already logged in" }
    }
}

const searchUsers = async (user: user) => {
    let result = await client.getMessages(USERS_CHANNEL, { search: JSON.stringify(user) })
    if (result.length == 0) {
        result = await client.getMessages(USERS_CHANNEL, { search: user.username })
    }
    return result
}

const requestHandler = async (message: request, props: { userId: string, message: string }) => {
    log.m(`request : ${JSON.stringify(message)}`)
    if (message.req == "login") {
        let user = await getUser(props.userId)

        if (user.username == null) {
            await client.sendMessage(props.userId, { message: JSON.stringify({ code: 503, message: "invalid username" }) })
            return
        }
        if (user.firstName == null) {
            await client.sendMessage(props.userId, { message: JSON.stringify({ code: 503, message: "invalid firstName" }) })
            return
        }

        let result = await login({ id: props.userId + "", username: user.username, firstname: user.firstName })
        await client.sendMessage(props.userId, { message: JSON.stringify(result) })

    } else if (message.req == 'posts') {
        let messages = await client.getMessages(POSTS_CHANNEL, {})
        messages.forEach(async m => {
            if (m instanceof Api.Message) {
                let media = m.media
                if (media != null) {
                    await client.sendFile(props.userId, { file: media, caption: m.message })
                } else {
                    await client.sendMessage(props.userId, { message: m.message })
                }
            }
        })
    } else if (message.req == 'text') {
        //{"caption":"string"}
        if (message.body.caption == null) {
            await client.sendMessage(props.userId, { message: JSON.stringify({ code: 503, message: "invalid firstName" }) })
            return
        }
        if (message.body.caption == '') {
            await client.sendMessage(props.userId, { message: JSON.stringify({ code: 503, message: "invalid firstName" }) })
            return
        }

        message.body.userId = props.userId

        await client.sendMessage(POSTS_CHANNEL, { message: JSON.stringify(message.body) })
        await client.sendMessage(props.userId, { message: JSON.stringify({ code: 200, message: "success" }) })
    } else if (message.req == 'uploads') {
        let messages = await client.getMessages(POSTS_CHANNEL, { search: `"userId":"${props.userId}"` })
        messages.forEach(async m => {
            if (m instanceof Api.Message) {
                let media = m.media
                if (media != null) {
                    await client.sendFile(props.userId, { file: media, caption: m.message })
                } else {
                    await client.sendMessage(props.userId, { message: m.message })
                }
            }
        })
        
    }
}

export default async () => {
    log.m("connecting to telegram server")

    await client.start({
        phoneNumber: async () => { return "919847900342" },
        password: async () => { return "adhil123" },
        phoneCode: async () =>
            await log.g("Please enter the code you received: "),
        onError: (err) => log.e(err.message),
    });
    console.log(client.session.save());

    log.m("connected to telegram server");
    log.m("listening for requests")

    client.addEventHandler(async (update) => {


        if (update instanceof Api.UpdateShortMessage) {
            //short text message
            let req = update as Api.UpdateShortMessage
            let props = { userId: req.userId.toString(), message: req.message }
            let message = await parceJson(props.message)
            if (message != null)
                await requestHandler((message as request), props)
            else
                await client.sendMessage(props.userId, { message: JSON.stringify({ code: "503", message: "invalid request" }) })

        } else if (update instanceof Api.UpdateNewMessage) {
            //video or image
            if ((update.message as any).peerId.userId == null)
                return
            if ((update.message as any).media != null) {
                //a media request
                let updt = (update.message as any) as { peerId: { userId: string }, message: string, media: Api.MessageMediaPhoto }
                //request validaton
                let request = (await parceJson(updt.message)) as request

                if (request.body == null) {
                    await client.sendMessage(updt.peerId.userId, { message: JSON.stringify({ code: "503", message: "invalid request" }) })
                    return
                }

                if (request.body.caption == null) {
                    await client.sendMessage(updt.peerId.userId, { message: JSON.stringify({ code: "503", message: "invalid request" }) })
                    return
                }

                request.body.userId = updt.peerId.userId

                await client.sendFile(POSTS_CHANNEL, { file: updt.media, caption: JSON.stringify(request.body) })
                await client.sendMessage(request.body.userId, { message: JSON.stringify({ code: "200", message: "success" }) })

            }


        }

    });
}



