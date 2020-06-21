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

export const isDirectoryExist = (directory: string): Promise<boolean> =>
    new Promise((resolve) => {
        fs.access(directory, fs.constants.R_OK, (err) => {
            if (err) resolve(false);
            resolve(true);
        });
    });

export const createDirectory = (directory: string): Promise<Error | 'success'> =>
    new Promise((resolve, reject) => {
        fs.mkdir(directory, { recursive: true }, (err) => {
            if (err) reject(err);
            resolve('success');
        });
    });

interface UploadFilePaylod {
    file: any;
    path: string;
    /**
     * If true check is directory exist,
     * in case if not then create new
     *
     * 'Create Directory If Not Exists'
     */
    createDirIfNX?: boolean;
    fileName?: string;
}
type UploadFile = (payload: UploadFilePaylod) => Promise<Error | string>;

export const uploadFile: UploadFile = (payload) =>
    new Promise(async (resolve, reject) => {
        const {
            path,
            file,
            createDirIfNX,
            fileName,
        } = payload;

        const filePath = fileName
            ? `${path}/${fileName}`
            : `${path}/${file.name}`;

        const relativeFilePath = relativePath(`uploads/${path}`);
        const writePath = relativePath(`uploads/${filePath}`);

        if (createDirIfNX) {
            const alreadyExists = await isDirectoryExist(relativeFilePath);

            if (!alreadyExists) {
                const res = await createDirectory(relativeFilePath);

                if (res !== 'success') {
                    reject(res);
                }
            }
        }

        const ws = fs.createWriteStream(writePath, { flags: 'w' });

        ws.write(file.data, (err) => { if (err) reject(err); });
        ws.end();

        ws.on('close', () => resolve('success'));
    });
