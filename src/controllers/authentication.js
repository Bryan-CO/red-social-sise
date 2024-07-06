import { UserModel } from '../models/mysql/user.js';
import { validatePartialUser } from '../schemas/user.js';
import { AuthUtil } from '../utils/AuthUtil.js';
import { ResponseModel } from '../utils/Response.js';

export class AuthController {

    // GENERATE TOKEN (ONLY TO TEST TOKEN SIGNING)
    static async generate(req, res, next) {
        try {
            const result = req.body;
            const token = await AuthUtil.generateToken(result);
            res.json({ authId: result.id, authUser: result.username, role: result.role, token: token });
        } catch (err) {
            res.status(500).json(ResponseModel.error('Token no generado', 400, JSON.parse(err.message)));
        }
    }

    // REGISTER
    static async register(req, res, next) {
        try {
            const result = validatePartialUser(req.body);
            if(result.error) { 
                return res.status(400).json(ResponseModel.error('Usuario no fue validado correctamente', 400, JSON.parse(result.error.message))); 
            }
            
            const passFlat = result.data.contraseña;
            const hashedPass = await AuthUtil.hashPassword(passFlat);
            result.data.contraseña = hashedPass;

            const newUser = await UserModel.create({ input: result.data });

            // const payload = { id: newUser.id, role: 1, username: newUser.username }
            
            // const token = await AuthUtil.generateToken( payload );
            // if(!token) { 
            //     return res.status(500).json(ResponseModel.error('Token no generado', 500)); 
            // }
            
            // res.status(201).cookie(process.env.NAME_STORAGE_TOKEN_JWT, token).json(ResponseModel.success(newUser, 'Usuario y Token creado correctamente', 201));

            res.status(201).json(ResponseModel.success(newUser, 'Usuario registrado correctamente', 201));
        } catch (error) {
            next(error);
        }
    }

    // LOGIN
    static async login(req, res, next) {
        try {
            const result = validatePartialUser(req.body);
            if(result.error) {
                return res.status(400).json(ResponseModel.error('Usuario no fue validado correctamente', 400));
            }

            const { username, contraseña } = result.data;

            const userFount = await UserModel.getByUsername({username});
            if(userFount.length === 0) {
                return res.status(401).json(ResponseModel.error('Credenciales invalidas', 401));
            }

            const { ID, Username, ROL, Contrasena } = userFount[0]; 

            const validPassword = await AuthUtil.comparePassword( contraseña, Contrasena );
            if(!validPassword) {
                return res.status(401).json(ResponseModel.error('Contraseña invalida', 401));
            }

            const payload = { id: ID, username: Username, role: ROL }
            
            const token = await AuthUtil.generateToken( payload );
            if(!token) {
                return res.status(500).json(ResponseModel.error('Token no generado', 500));
            }
            
            res.status(201).cookie(process.env.NAME_STORAGE_TOKEN_JWT, token).json(ResponseModel.success(userFount, 'Usuario y Token verificados', 201));
        } catch (err) {
            next(err);
        }
    }

    // LOGOUT
    static async logout(req, res, next){
        try {
            res.status(200).clearCookie(process.env.NAME_STORAGE_TOKEN_JWT).json({ message: 'Cierre de sesión exitoso' })
        } catch (err) {
            next(err)
        }
    }

}