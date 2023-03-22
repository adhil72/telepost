import log from "./log"

export const parceJson = (text:string)=>{

    return new Promise((r)=>{
        try {
            let parceble = JSON.parse(text)
            r(parceble)
        } catch (error) {            
            log.e(error)
            r(null)
        }
    })
}
export const isType = (obj1:any,obj2:any)=>{
    let verified = true
    Object.keys(obj1).map((v)=>{
        let key:string = v as string
        if (obj2[key]==null) {            
            verified = false
        }
    })
    return verified
}