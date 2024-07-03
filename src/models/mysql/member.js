import mysql from 'mysql2/promise.js';
import { dbConfig } from '../../utils/ProviderConfig.js';

const connection = await mysql.createConnection(dbConfig);

export class MemberModel {

    // GET ALL MEMBERS
    static async getAllMembers({ id }) {
        const [members] = await connection.query(
            'CALL SP_CHM_SEL1_Miembros (?);', [id]
        );
        return members[0];
    }

    // ADD MEMBER
    static async addMember({ id, input }) {
        const { miembro } = input;

        await connection.query(
            'CALL SP_CHM_INS1_Agregar (?, UUID_TO_BIN(?));', [id, miembro]
        );

        const [members] = await connection.query(
            'CALL SP_CHM_SEL1_Miembros (?);', [id]
        );
        return members;
    }

    // DELETE MEMBER
    static async delete({ id, user }) {
        const [result] = await connection.query(
            'CALL SP_CHM_DEL1_Inhabilitar (?, UUID_TO_BIN(?))', [id, user]
        );

        return (result.affectedRows === 1); 
    }

}