import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';
import { CustomFile } from 'telegram/client/uploads';


export const downloader = {
    download: (fileUrl: String) => {
        return new Promise<CustomFile | null>((r)=>{

        const protocol:any = fileUrl.startsWith('https') ? https : http;

        protocol.get(fileUrl, (response:any) => {
            if (response.statusCode !== 200) {
                console.error(`Failed to download file, status code: ${response.statusCode}`);
                r(null)
                return;
            }

            var path_name = fileUrl.split('/')[fileUrl.split('/').length-1]
            const fileStream = fs.createWriteStream(path_name);

            response.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close()
                r(new CustomFile(path_name, fs.statSync(path_name).size, path_name))
                console.log('File downloaded successfully');
            });
        }).on('error', (error:any) => {
            console.error(`Error downloading file: ${error.message}`);
        });
        })
    }
}