import { randomUUID } from 'node:crypto';
import mysql from 'mysql2/promise.js';

const config = {
    host: 'localhost',
    user: 'root',
    password: 'mysqladmin',
    database: 'RED_SOCIAL'
}

const connection = await mysql.createConnection(config);

export class UserModel {
    static async getAll(){
        return {status: 200, message: "Se listaron los usuarios xd"};
    }
    static async getById(){

    }
    static async create({ input }){
        const{
            alias,
            nombre,
            apellido,
            email,
            contraseña,
            rutaAvatar
        } = input;

        const result = await connection.query(
            `INSERT INTO tb_usuario (Alias, Nombre, Apellido, Email, Contraseña, RutaAvatar) VALUES
(?, ?, ?, ?, ?, ?);`,[alias, nombre, apellido, email, contraseña, rutaAvatar]
        );

        // const newUser = {
        //     id: randomUUID(),
        //     // alias: result.data.alias, // podemos hacerlo así, o...
        //     ...input
        // }
        
        console.log(result);
    }
    static async update(){

    }
    static async delete(){

    }
}