import cors from 'cors';

//Configura el middleware de CORS para permitir el acceso a la aplicación 
//solo desde los orígenes especificados en `ACCEPTED_ORIGINS`.

const ACCEPTED_ORIGINS = [
    'http://localhost:1234',
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