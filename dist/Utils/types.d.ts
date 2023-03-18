export interface user {
    name: string;
    phone: string;
}
export interface post {
    user: user;
    messageType: 'i' | 'v' | 't';
    content: string;
}
