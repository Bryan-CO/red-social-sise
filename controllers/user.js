import { UserModel } from '../models/mysql/user.js';
import { validatePartialUser, validateUser } from '../schemas/user.js';

export class UserController {

    static async getAll(req, res) {
        const users = await UserModel.getAll();
        res.status(200).json(users);
    }

    static async getById(req, res) {
        const { id } = req.params;
        const user = await UserModel.getById({id});
        if (user.length != 0) return res.json(user);
        res.status(404).json({message:'User not found uu'});
    }
    
    static async create(req, res) {
        const result = validateUser(req.body);

    // Console.log(JSON.parse(result)); Esto no, porque el JSON.parse sirve para convertir un JSON a un objeto

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newUser = await UserModel.create({ input: result.data });
        res.status(201).json(newUser);
    }

    static async update(req, res) {
        const{ id } = req.params;
        const result = validatePartialUser(req.body);

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const updateUser = await UserModel.update({id, input: result.data});

        if(!updateUser) return res.status(404).json({message: 'Usuario not found uu'});
        res.status(200).json(updateUser);
    }
}