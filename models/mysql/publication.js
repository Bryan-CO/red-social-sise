import mysql from 'mysql2/promise.js';
import config from '../../config.json' with { type:'json' };


const connection = await mysql.createConnection(config.development.db);

export class PublicationModel {

    // GET ALL
    static async getAll(){
        const [pubs] = await connection.query(
            'SELECT * FROM VW_PUB_SEL1_Lista;'
        )
        

        // pubs.forEach(async pub => {
        //     const [reacciones] = await connection.
        // query('SELECT TRC.IDTipoReaccion, TRC.Nombre, CRC.Cant FROM CantReacciones CRC INNER JOIN TipoReacciones TRC ON TRC.IDTipoReaccion = CRC.IDTipoReaccion WHERE CRC.IDPublicacion = ? ORDER BY CRC.Cant DESC;', 20);
        //     pub.Reacciones = reacciones[0];
        // })
        // console.log('xd');
        return pubs;
    }

    // GET BY ID
    static async getById({ id }){
        const [pub] = await connection.query(
            'SELECT * FROM VW_PUB_SEL1_Lista WHERE IdPublicacion = ?', [id]
        )
        return pub;
    }

    // CREATE
    static async create({ input }){
        const{
            uuid_usuario,
            contenido
        } = input;

        const result = await connection.query(
            `CALL SP_PUB_INS1_Registrar (UUID_TO_BIN(?), ?);`, [uuid_usuario, contenido]
        );

        const [newPub] = await connection.query(
            'SELECT * FROM VW_PUB_SEL1_Lista WHERE IdPublicacion = LAST_INSERT_ID()'
        );
        
        return newPub;
    }

    // UPDATE
    static async update({ id, input }){
        const{
            contenido
        } = input;

        const [result] = await connection.query(
            'CALL SP_PUB_UPD_Actualizar (?, ?);',
            [id, contenido]
        );

        if (result.affectedRows === 0) return false;

        const[pub] = await connection.query(
            'SELECT * FROM VW_PUB_SEL1_Lista WHERE IdPublicacion = ?', [id]
        );
        return pub;

    }

    // DELETE
    static async delete({ id }){
        const [result] = await connection.query(
            'CALL SP_PUB_DEL1_INHABILITAR (?)', [id]
        );

        return (result.affectedRows === 1);
    }
}