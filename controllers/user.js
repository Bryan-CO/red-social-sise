export class UserController{
    static async getAll(req, res) {
        res.send('Se listaron todos los usuarios uwu');
    }
    static async getById(req, res) {
        res.send('Se listó un usuario por ID');
    }
    static async create(req, res) {
        res.send('Se creó un nuevo alumno uwu');
    }
    static async update(req, res) {
        res.send('Se actualizó un alumno uwu');
    }
}