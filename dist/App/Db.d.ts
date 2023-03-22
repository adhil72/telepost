import { Api } from "telegram";
import { user, post } from "../Utils/types";
declare const _default: {
    config: () => Promise<void>;
    userLogin: (user: user) => Promise<200 | 504 | 503>;
    addPost: (entity: post) => Promise<200 | 404>;
    getPosts: () => Promise<import("telegram/Helpers").TotalList<Api.Message>>;
};
export default _default;
