import { UserModel } from '../models/mysql/user.js';
import { validatePartialUser, validateUser } from '../schemas/user.js';

export class UserController {

    // GET ALL
    static async getAll(req, res) {
        const users = await UserModel.getAll();
        res.status(200).json(users);
    }


    // GET BY ID
    static async getById(req, res) {
        const { id } = req.params;
        const user = await UserModel.getById({id});
        if (user.length != 0) return res.json(user);
        res.status(404).json({message:'User not found uu'});
    }
    

    // CREATE
    static async create(req, res) {
        const result = validateUser(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newUser = await UserModel.create({ input: result.data });
        res.status(201).json(newUser);
    }



    // UPDATE
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


    // DELETE (Logic)
    static async delete (req, res){
        const { id } = req.params;
        const success = await UserModel.delete({ id });
        if (!success) return res.status(404).json({message: "Usuario not found uu"});

        res.status(200).json({message: "Usuario borrado correctamente!"});
    }
}