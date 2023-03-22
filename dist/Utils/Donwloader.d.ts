import { CustomFile } from 'telegram/client/uploads';
export declare const downloader: {
    download: (fileUrl: String) => Promise<CustomFile | null>;
};
