/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 18 April 2020
 *
 * Extract main paths and functions which calculates them.
 */

/** External imports */
import path from 'path';

const mode = process.env.NODE_ENV || 'production';

export const relativePath = (filePath: string) => {
    const normalizedFilePath = mode === 'production'
        ? `../../../${filePath}`
        : `../../${filePath}`;

    return path.join(__dirname, normalizedFilePath);
};
