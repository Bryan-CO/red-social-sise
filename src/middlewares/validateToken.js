import jwt from 'jsonwebtoken';
import { ResponseModel } from "../utils/Response.js";

export const authRequired = async (req, res, next) => {
    const cookieName = process.env.NAME_STORAGE_TOKEN_JWT;
    const token = req.cookies[cookieName];

    if (!token) { return res.status(401).json(ResponseModel.error('No token provided'))}

    try {
        const jwt_key = process.env.JWT_SECRET;
        const decodedToken = jwt.verify(token, jwt_key);
        req.user = decodedToken;
        next();
    } catch (err) {
        console.error('Error al autenticar el token \n', err);
    }
};