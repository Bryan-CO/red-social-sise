import { UserModel } from "../models/user.js";
import { validateUser } from "../schemas/user.js";

export class UserController{
    static async getAll(req, res) {
        const users = await UserModel.getAll();
        res.json(users);
    }

    static async getById(req, res) {
        res.send('Se listó un usuario por ID');
    }

    static async create(req, res) {
        const result = validateUser(req.body);

        //console.log(JSON.parse(result)); Esto no, porque el JSON.parse sirve para convertir un JSON a un objeto

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newUser = await UserModel.create({input: result.data});
        res.status(201).json(newUser);
    }
    static async update(req, res) {
        res.send('Se actualizó un alumno uwu');
    }
}