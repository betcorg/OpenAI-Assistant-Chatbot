import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;

const signJWT = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            JWT_SECRET,
            {
                expiresIn: '1d',
            },
            (error, token) => {
                if (error) reject(error);
                resolve(token);
            }
        );
    });
};

const verifyJWT = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (error, data) => {
            if (error) reject(error);
            resolve(data);
        });
    });
};

const hashPassword = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};

const verifyPass = async (password, hash) => {
    return await bcrypt.compare(password, hash);
};

export {
    signJWT,
    verifyJWT,
    hashPassword,
    verifyPass,
}; 
