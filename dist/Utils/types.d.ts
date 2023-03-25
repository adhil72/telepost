export interface user {
    id: string;
    username: string;
    firstname: string;
}
export interface post {
    userId: string;
    caption: string;
}
export interface request {
    req: "login" | "photo";
    body: post;
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
