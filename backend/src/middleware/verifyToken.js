import {verifyJWT} from'../utils/secManager.js';

export const verifyToken = async (req, res, next) => {

    const {token} = req.cookies;
    
    if (!token) {
        return res.status(401).json({
            message: 'Access denied, invalid credentials'
        });
    }

    const userData = await verifyJWT(token);

    req.user_id = userData;

    next();
};
