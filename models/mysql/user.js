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

    // GET ALL
    static async getAll(){
        const [users] = await connection.query(
            'SELECT idusuario, alias, nombre, apellido, email, contraseña, rutaAvatar from TB_Usuario;'
        )
        return users;
    }

    // GET BY ID
    static async getById({ id }){
        const [user] = await connection.query(
            'SELECT idusuario, alias, nombre, apellido, email, contraseña, rutaAvatar from TB_Usuario WHERE IdUsuario = ?', [id]
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
            `INSERT INTO tb_usuario (Alias, Nombre, Apellido, Email, Contraseña, RutaAvatar) VALUES
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
            'UPDATE TB_USUARIO SET alias = IFNULL(?, alias), nombre = IFNULL(?, nombre), apellido = IFNULL(?, apellido), email = IFNULL(?, email), contraseña = IFNULL(?, contraseña), rutaAvatar = IFNULL(?, rutaAvatar) WHERE IDUsuario = ?',
            [alias, nombre, apellido, email, contraseña, rutaAvatar, id]
        );

        if (result.affectedRows === 0) return false;

        const[user] = await connection.query(
            'SELECT idusuario, alias, nombre, apellido, email, contraseña, rutaAvatar from TB_Usuario WHERE IdUsuario = ?', [id]
        );
        return user;

    }

    // DELETE
    static async delete({id}){
        
    }
}