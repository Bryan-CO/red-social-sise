import mysql from 'mysql2/promise.js';
import { dbConfig } from '../../utils/ProviderConfig.js';
// import config from '../../config.json' with { type:'json' };
// import { randomUUID } from 'node:crypto';

const connection = await mysql.createConnection(dbConfig);


export class UserModel {

    // GET ALL
    static async getAll(){
        const [users] = await connection.query(
            'SELECT * FROM VW_USU_SEL_ALL_ACTIVE;'
        )
        return users;
    }

    // GET BY ID
    static async getById({ id }){
        const [user] = await connection.query(
            'SELECT * FROM VW_USU_SEL_ALL_ACTIVE WHERE ID = ?', [id]
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

        const [uuidResult] = await connection.query(
            'SELECT UUID() uuid;'
        );

        const [{uuid}] = uuidResult;

        await connection.query(
            `CALL SP_USU_INS1_Registrar (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,[uuid, alias, nombre, apellido, email, contraseña, rutaAvatar]
        );

        const newUser = {
            id: uuid,
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
            'CALL SP_USU_UPD2_ActDetalle (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)',
            [id, alias, nombre, apellido, email, contraseña, rutaAvatar]
        );

        if (result.affectedRows === 0) return false;

        const[user] = await connection.query(
            'SELECT * FROM VW_USU_SEL_ALL_ACTIVE WHERE ID = ?', [id]
        );
        return user;

    }

    // DELETE
    static async delete({ id }){
        const [result] = await connection.query(
            'CALL SP_USU_DEL1_Inhabilitar(UUID_TO_BIN(?))', [id]
        );

        return (result.affectedRows === 1);
    }
}