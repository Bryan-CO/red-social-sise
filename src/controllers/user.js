import { UserModel } from '../models/mysql/user.js';
import { validatePartialUser, validateUser } from '../schemas/user.js';
import { ResponseModel } from '../utils/Response.js';

export class UserController {

    // GET ALL
    static async getAll(req, res, next) {
        try{
            const users = await UserModel.getAll();
            res.status(200).json(ResponseModel.success(users, 'Se listó correctamente'));

        }catch(error){
            next(error);
        }
    }


    // GET BY ID
    static async getById(req, res) {
        const { id } = req.params;
        const user = await UserModel.getById({id});

        if (user.length != 0) return res.json(ResponseModel.success(user, 'Usuario obtenido correctamente!'));
        res.status(404).json(ResponseModel.error('Usuario no encontrado', 404));
    }
    

    // CREATE
    static async create(req, res, next) {
        try{
            const result = validateUser(req.body);
            if (result.error) {
                return res.status(400).json(ResponseModel.error('Usuario no fue validado correctamente', 400, JSON.parse(result.error.message)));
            }
            const newUser = await UserModel.create({ input: result.data });
            res.status(201).json(ResponseModel.success(newUser, 'Usuario creado correctamente!', 201));

        }catch(error){
            next(error);
        }
    }



    // UPDATE
    static async update(req, res) {
        const{ id } = req.params;
        const result = validatePartialUser(req.body);

        if (result.error) {
            return res.status(400).json(ResponseModel.error('Usuario no fue validado correctamente', 400, JSON.parse(result.error.message)));
        }

        const updateUser = await UserModel.update({id, input: result.data});

        if(!updateUser) return res.status(404).json(ResponseModel.error('Usuario no encontrado', 404));
        res.status(200).json(ResponseModel.success(updateUser, 'Usuario actualizado correctamente!'));
    }


    // DELETE (Logic)
    static async delete(req, res, next) {
        const { id } = req.params;

        try {
            const success = await UserModel.delete({ id });
            if (!success) {
                return res.status(404).json(ResponseModel.error('Usuario no encontrado', 404));
            }
            res.json(ResponseModel.success(null, 'Usuario eliminado correctamente'));
        } catch (error) {
            next(error);
        }
    }
}