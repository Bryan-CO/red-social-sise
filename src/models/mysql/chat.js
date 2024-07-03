import mysql from 'mysql2/promise.js';
import { dbConfig } from '../../utils/ProviderConfig.js';

const connection = await mysql.createConnection(dbConfig);

export class ChatModel {

    // GET ALL CHATS
    static async getAll(){
        const [chats] = await connection.query(
            'SELECT * FROM VW_CHT_SEL1_Actived;'
        );
        return chats;
    }

    // GET BY ID
    static async getById({ id }) {
        const [chats] = await connection.query(
            'SELECT * FROM VW_CHT_SEL1_Actived WHERE ID = ?;', [id]
        );
        return chats;
    }

    // GET ALL BY USER
    static async getAllByUser({ id }) {
        const [chat] = await connection.query(
            'CALL SP_CHT_SEL2_ChatsUsuario (UUID_TO_BIN(?));', [id]
        );
        return chat[0];
    }

    // CREATE CHAT
    static async create({ input }) {
        const { nombre } = input;

        await connection.query(
            'CALL SP_CHT_INS1_Registrar (?);', [nombre]
        );

        const [chat] = await connection.query(
            'SELECT * FROM VW_CHT_SEL1_Actived WHERE ID = LAST_INSERT_ID();'
        );
        return chat;
    }

    // UPDATE CHAT
    static async update({ id, input }){
        const { nombre } = input;

        const [result] = await connection.query(
            'CALL SP_CHT_UPD2_ActChat (?, ?);', [id, nombre]
        );

        if (result.affectedRows === 0) return false;

        const [chats] = await connection.query(
            'SELECT * FROM VW_CHT_SEL1_Actived WHERE ID = ?;', [id]
        );
        return chats;
    }

    // DELETE
    static async delete({ id }) {
        const [result] = await connection.query(
            'CALL SP_CHT_DEL1_Inhabilitar (?)', [id]
        );

        return (result.affectedRows === 1);
    }
 
 
}