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

export const uploadFile = (file: any) =>
    new Promise((resolve, reject) => {
        const writePath = relativePath(`uploads/${file.name}`);

        const ws = fs.createWriteStream(writePath);

        ws.write(file.data, (err) => { if (err) reject(err); });
        ws.end();

        ws.on('close', () => resolve('success'));
    });
