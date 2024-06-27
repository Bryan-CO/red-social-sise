import { ResponseModel } from "../utils/Response.js";

export const permsRequired = (req, res, next) => {
    const { role } = req.user;

    if(role !== 'Admin') {
        return res.status(403).json(ResponseModel.error('Acceso no autorizado',403));
    }
    next();
};