import mysql from 'mysql2/promise.js';
import config from '../../config.json' with { type:'json' };


const connection = await mysql.createConnection(config.development.db);

export class CommentModel {
    
    // GET ALL COMMENTS
    static async getAll({ id }){
        const [pubs] = await connection.query(
            'CALL SP_COM_SEL1_PubComentarios(?);', [id]
        )
        return pubs[0];
    }

    // CREATE COMMENT
    static async create({ id, input }){
        const{
            uuid_usuario,
            contenido
        } = input;

        console.log(uuid_usuario);

        await connection.query(
            `CALL SP_COM_INS1_Registrar (?, UUID_TO_BIN(?), ?);`, [id, uuid_usuario, contenido]
        );

        const [newComment] = await connection.query(
            'CALL SP_COM_SEL1_ByID(LAST_INSERT_ID());'
        );
        
        return newComment;
    }

    // UPDATE COMMENT
    static async update({idComment, input }){
        const{
            contenido
        } = input;

        const [result] = await connection.query(
            'CALL SP_COM_UPD2_ACTCOMMET (?, ?)',
            [idComment, contenido]
        );

        console.log(idComment);

        if (result.affectedRows === 0) return false;

        const[comment] = await connection.query(
            'CALL SP_COM_SEL1_ByID(?);', [idComment]
        );
        return comment;

    }

    // DELETE COMMENT
    static async delete({ idComment }){
        const [result] = await connection.query(
            'CALL SP_COM_DEL1_INHABILITAR (?)', [idComment]
        );

        return (result.affectedRows === 1);
    }
}