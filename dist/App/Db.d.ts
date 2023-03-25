/// <reference types="node" />
import { Api } from "telegram";
import { user, post } from "../Utils/types";
declare const _default: {
    config: () => Promise<void>;
    userLogin: (user: user) => Promise<200 | 504>;
    addPost: (entity: post) => Promise<200 | 503 | 404>;
    getPosts: () => Promise<import("telegram/Helpers").TotalList<Api.Message>>;
    downloadFile: (message: any) => Promise<string | Buffer | undefined>;
};
export default _default;
