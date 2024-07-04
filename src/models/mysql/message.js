import mysql from 'mysql2/promise.js';
import { dbConfig } from '../../utils/ProviderConfig.js';

const connection = await mysql.createConnection(dbConfig);

export class MessageModel {

    // GET ALL
    static async getAll(){
        const [messages] = await connection.query(
            'SELECT * FROM VW_MSG_SEL1_Actived;'
        )
        return messages;
    }

    // GET BY ID
    static async getById({ id }){
        const [messages] = await connection.query(
            'SELECT * FROM VW_MSG_SEL1_Actived WHERE IDMensaje = ?;', [id]
        )
        return messages;
    }

    // GET BY ID TO CHAT
    static async getByChat({ id }){
        const [pub] = await connection.query(
            'CALL SP_MSG_SEL2_ActivedByChat (?);', [id]
        )
        return pub[0];
    }

    // CREATE
    static async create({ id, input }){
        const{
            uuid_usuario,
            contenido
        } = input;

        await connection.query(
            `CALL SP_MSG_INS1_Registrar (?, UUID_TO_BIN(?), ?);`, [id, uuid_usuario, contenido]
        );

        const [newMessage] = await connection.query(
            'SELECT * FROM VW_MSG_SEL1_Actived WHERE IDMensaje = LAST_INSERT_ID();'
        );
        
        return newMessage;
    }

    // UPDATE
    static async update({ id, input }){
        const {
            contenido
        } = input;

        const [result] = await connection.query(
            'CALL SP_MSG_UPD2_Actualizar (?, ?);',
            [id, contenido]
        );

        if (result.affectedRows === 0) return false;

        const [msg] = await connection.query(
            'SELECT * FROM VW_MSG_SEL1_Actived WHERE IDMensaje = ?;', [id]
        );
        return msg;

    }

    // DELETE
    static async delete({ id }){
        const [result] = await connection.query(
            'CALL SP_MSG_DEL1_Inhabilitar (?)', [id]
        );

        return (result.affectedRows === 1);
    }
}