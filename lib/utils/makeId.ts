/**
 * Craeted by: Oleksandr Bezrukov
 * Creation date 24 March 2020
 */

/**
 * Function which generated random string for unique names for files or folders.
 */

export const makeId = (length: number): string => {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
