import CryptoJS from 'crypto-js';
import { jwtDecode } from 'jwt-decode';

const encryptToken = async (value: string) => {
    try {
        const encryptedValue = await encryptValue(value);

        localStorage.setItem(String(process.env.REACT_APP_LOCAL_TOKEN), encryptedValue.toString());
    } catch (error) {
        console.error('Erro ao criptografar o token:', error);
    }
};

const encryptValue = (value: string) => {
    return new Promise<string>((resolve, reject) => {
        try {
            const encrypted = CryptoJS.AES.encrypt(value, String(process.env.REACT_APP_ENCRYPT_TOKEN)).toString();
            resolve(encrypted);
        } catch (error) {
            reject(error);
        }
    });
};

const decodeToken = () => {
    const token_local = localStorage.getItem(String(process.env.REACT_APP_LOCAL_TOKEN));

    if (typeof token_local === 'string') {
        const bytes = CryptoJS.AES.decrypt(token_local, String(process.env.REACT_APP_ENCRYPT_TOKEN));
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    return 'Token não localizado.';
};

const decodeTokenAsync = () => {
    return new Promise<string>((resolve) => {
        const token_local = localStorage.getItem(String(process.env.REACT_APP_LOCAL_TOKEN));
        if (typeof token_local === 'string' && typeof token_local === 'string') {
            const bytes = CryptoJS.AES.decrypt(token_local, String(process.env.REACT_APP_ENCRYPT_TOKEN));

            resolve(bytes.toString(CryptoJS.enc.Utf8));
        }
    });
};

const decodeHash = () => {
    const localToken = localStorage.getItem(String(process.env.REACT_APP_LOCAL_TOKEN));

    if (!localToken) {
        return false;
    }

    const data = jwtDecode(decodeToken()) as any;

    return data;
};

const removeToken = () => {
    localStorage.removeItem(String(process.env.REACT_APP_LOCAL_TOKEN));
};

export { encryptToken, decodeToken, decodeTokenAsync, decodeHash, removeToken };
