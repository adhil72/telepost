import { user, post } from "../Utils/types";
declare const _default: {
    config: () => Promise<void>;
    userLogin: (user: user) => Promise<200 | 503>;
    addPost: (entity: post) => Promise<200 | 404>;
};
export default _default;
