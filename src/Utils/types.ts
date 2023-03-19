export interface user {
    id: number, first_name: string, username: string
}
export interface post {
    user: user,
    messageType: 'f' | 't',
    content: string
}

export const userObject = {
    id: 'number', first_name: 'string', username: 'string'
}
export const postObject =  {
    user: 'user',
    messageType: '',
    content: 'string'
}