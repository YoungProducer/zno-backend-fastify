/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 April 2020
 *
 * Function which uploads files to static folder.
 */

/** External imports */
import fs from 'fs';

/** Application's imports */
import { relativePath } from './paths';

interface UploadFilePaylod {
    file: any;
    path: string;
    createDirectory?: boolean;
}
type UploadFile = (payload: UploadFilePaylod) => Promise<Error | string>;

export const uploadFile: UploadFile = (payload) =>
    new Promise((resolve, reject) => {
        const { path, file } = payload;
        const writePath = relativePath(`uploads/${path}`);

        const ws = fs.createWriteStream(writePath, { flags: 'w' });

        ws.write(file.data, (err) => { if (err) reject(err); });
        ws.end();

        ws.on('close', () => resolve('success'));
    });
