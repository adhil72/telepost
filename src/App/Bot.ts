import { Bot } from "grammy";
import env from "../Utils/env";
import Db from "./Db";
import { postObject, user } from "../Utils/types";
import { isType, parceJson } from "../Utils/checks";
import { post } from "../Utils/types";
import { client } from "telegram";
import log from "../Utils/log";
const bot = new Bot(env.BOT_TOKEN());
export default {
    run:async()=>{
        await Db.config()
        bot.command('login',async(ctx)=>{
            let user:user = ctx.chat as user;
            let res = await Db.userLogin(user)
            ctx.reply(res+"")
        })


        bot.command("posts",async(ctx)=>{      
            let time:Date = new Date()
            log.m("BOT: posts request")
      
            var posts = await Db.getPosts() 
            posts.forEach((p)=>{
                ctx.reply(p.message)
            })

            log.m(`BOT: posts request done in ${new Date().getTime()-time.getTime() }`)
        })
        
        bot.on('message:text',async (ctx)=>{
            let time:Date = new Date()
            log.m("BOT: text message request")

            let message = await parceJson(ctx.message.text)
            if (message) {

                if (isType(postObject,message)) {                    
                    let msg:post  = message as post
                    if (msg.messageType=='t') {
                        let res = await Db.addPost(msg)
                        ctx.reply(res+"")
                    }else {
                        ctx.reply("503")
                    }
                }else{
                    ctx.reply("503")
                }
            }else{
                ctx.reply("503")
            }
            log.m(`BOT: text message request done in ${new Date().getTime()-time.getTime() }`)
        })
        bot.on(['message:photo','message:video'],async (ctx)=>{
            let time:Date = new Date()
            log.m("BOT: media message request")

            if (ctx.message.caption==null) {
                ctx.reply("503 no caption")
                return
            }
            let message = await parceJson(ctx.message.caption)
            if (message) {
                 if (isType(postObject,message)) {
                    let msg:post  = message as post

                    if (msg.messageType=='f') {
                        let file = await ctx.getFile()
                        if (!file.file_path){ctx.reply("503 no file path");return}
                        msg.content += "<::>"+file.file_path                        
                        let res = await Db.addPost(msg)
                        ctx.reply(res+"")
                    }else {
                        ctx.reply("503 ")
                    }

                }else{
                    ctx.reply("503 incoreect message type")
                }
            }else{
                ctx.reply("503 not parcable")
            }
             
            log.m(`BOT: media message request done in ${time.getTime() - new Date().getTime()}`)
        })
        bot.start()
    }
}




