import { randomUUID } from 'node:crypto';
import mysql from 'mysql2/promise.js';
import config from '../../config.json' with { type:'json' };


const connection = await mysql.createConnection(config.development.db);

export class UserModel {

    // GET ALL
    static async getAll(){
        const [users] = await connection.query(
            'SELECT idusuario, alias, nombre, apellido, email, contrasena, rutaAvatar from Usuarios;'
        )
        return users;
    }

    // GET BY ID
    static async getById({ id }){
        const [user] = await connection.query(
            'SELECT idusuario, alias, nombre, apellido, email, contrasena, rutaAvatar from Usuarios WHERE IdUsuario = ?', [id]
        )
        return user;
    }

    // CREATE
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
            `INSERT INTO Usuarios (Alias, Nombre, Apellido, Email, Contrasena, RutaAvatar) VALUES
            (?, ?, ?, ?, ?, ?);`,[alias, nombre, apellido, email, contraseña, rutaAvatar]
        );

        const newUser = {
            id: result[0].insertId,
            ...input
        }
        
        return newUser;
    }

    // UPDATE
    static async update({ id, input }){
        const{
            alias,
            nombre,
            apellido,
            email,
            contraseña,
            rutaAvatar
        } = input;

        const [result] = await connection.query(
            'UPDATE Usuarios SET alias = IFNULL(?, alias), nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), email = IFNULL(?, email), contrasena = IFNULL(?, contrasena), rutaAvatar = IFNULL(?, rutaAvatar) WHERE IDUsuario = ?',
            [alias, nombre, apellido, email, contraseña, rutaAvatar, id]
        );

        if (result.affectedRows === 0) return false;

        const[user] = await connection.query(
            'SELECT idusuario, alias, nombre, apellido, email, contrasena, rutaAvatar from Usuarios WHERE IdUsuario = ?', [id]
        );
        return user;

    }

    // DELETE
    static async delete({ id }){
        const [result] = await connection.query(
            'UPDATE Usuarios SET RgStatus = 0 WHERE IdUsuario = ?', [id]
        );

        return (result.affectedRows === 1);
    }
}