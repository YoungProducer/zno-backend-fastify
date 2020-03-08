import {
    genSalt,
    hash,
    compare,
} from 'bcryptjs';

import { PasswordHasher } from './types';
import { BCRYPT_HASHER } from '../constants/auth';

class BcryptHasher implements PasswordHasher {
    async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(BCRYPT_HASHER.BCRYPT_ROUNDS);
        return hash(password, salt);
    }

    async comparePasswords(providedPass: string, storedPass: string): Promise<boolean> {
        const isMatched = await compare(providedPass, storedPass);
        return isMatched;
    }
}

export = BcryptHasher;
