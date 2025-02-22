/**
 * Created by: Oleksandr Bezrukov
 * Creation date: 9 April 2020
 *
 * Function which extracat host name from url.
 */

export const extractHostname = (url: string | undefined) => {
    if (!url) return undefined;

    let hostname;
    // find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    // find & remove port number
    hostname = hostname.split(':')[0];
    // find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
};

export const separateURL = (url: string) => {
    return new URL(url);
};
