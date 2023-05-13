export interface user {
    id: string, username: string, firstname: string
}
export interface post {
    userId: string,
    caption: string
}

export interface request {
    req: "login" | "uploads" | "posts"| "text",
    body: post
}

export const userObject = {
    id: 'number', first_name: 'string', username: 'string'
}
export const postObject = {
    user: 'user',
    messageType: '',
    content: 'string'
}