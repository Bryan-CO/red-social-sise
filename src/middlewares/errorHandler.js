import { ResponseModel } from "../utils/Response.js";

//Middleware error response
export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json(ResponseModel.error('Internal server error', status, message));
};