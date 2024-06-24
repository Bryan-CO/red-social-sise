import cors from 'cors';


const ACCEPTED_ORIGINS = [
    'http://localhost:5500',
    'http://localhost:3000',
    'http://redsocial.com.pe'
];

export function corsMiddleware () {
    return cors({
        origin: (origin, callback) => {
            if (ACCEPTED_ORIGINS.includes(origin) || !origin){
                return callback(null, true);
            }
            return callback(new Error('Dominio no permitido :('));   
        }
    });
}