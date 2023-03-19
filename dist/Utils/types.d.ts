export interface user {
    id: number;
    first_name: string;
    username: string;
}
export interface post {
    user: user;
    messageType: 'f' | 't';
    content: string;
}
export declare const userObject: {
    id: string;
    first_name: string;
    username: string;
};
export declare const postObject: {
    user: string;
    messageType: string;
    content: string;
};
