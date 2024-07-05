import { ResponseModel } from "../utils/Response.js";

//Middleware que bloquea el acceso si el usuario no es Administrador.
export const permsRequired = (req, res, next) => {
    const { role } = req.user;

    if(role !== 'Admin') {
        return res.status(403).json(ResponseModel.error('Acceso no autorizado',403));
    }
    next();
};