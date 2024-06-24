import mysql from 'mysql2/promise.js';
import { dbConfig } from '../../utils/ProviderConfig.js';
// import config from '../../config.json' with { type:'json' };

const connection = await mysql.createConnection(dbConfig);


export class ReactionModel {

    // GET ALL
    static async getAllById({id}){
        const [pubs] = await connection.query(
            'SELECT BIN_TO_UUID(USU.IdUsuario) IdUsuario, USU.Alias, USU.rutaAvatar, PBRC.IdTipoReaccion, RCT.Nombre from publicacionreacciones PBRC INNER JOIN usuarios USU ON USU.IdUsuario = PBRC.IdUsuario INNER JOIN tiporeacciones RCT ON RCT.IdTipoReaccion = PBRC.IdTipoReaccion WHERE PBRC.IdPublicacion = ?;', [id]
        )
        

        // pubs.forEach(async pub => {
        //     const [reacciones] = await connection.
        // query('SELECT TRC.IDTipoReaccion, TRC.Nombre, CRC.Cant FROM CantReacciones CRC INNER JOIN TipoReacciones TRC ON TRC.IDTipoReaccion = CRC.IDTipoReaccion WHERE CRC.IDPublicacion = ? ORDER BY CRC.Cant DESC;', 20);
        //     pub.Reacciones = reacciones[0];
        // })
        console.log(id);
        return pubs;
    }

    // GET BY ID
    static async getById({ id, idReaction }){
        const [reactions] = await connection.query(
            'CALL SP_PBR_SEL1_ReaccionUsuario (?, ?);', [id, idReaction]
        )
        return reactions[0];
    }

    // CREATE
    static async create({ id, input }){
        const{
            user_uuid,
            reaction_id
        } = input;

        await connection.query(
            `CALL SP_PBR_INS1_Agregar (?, UUID_TO_BIN(?), ?);`, [id, user_uuid, reaction_id]
        );
        
        return {message: "Se añadió una reacción!"};
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