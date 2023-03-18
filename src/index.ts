import db from "./App/Db"
import log from "./Utils/log"
db.config().then(()=>{
    db.addPost({user:{name:"adhil",phone:"918075497228"},messageType:'i',content:"https://play-lh.googleusercontent.com/ZU9cSsyIJZo6Oy7HTHiEPwZg0m2Crep-d5ZrfajqtsH-qgUXSqKpNA2FpPDTn-7qA5Q<::>good"})
})
