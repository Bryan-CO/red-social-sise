import { validateMember, validatePartialMember } from '../schemas/member.js';
import { MemberModel } from '../models/mysql/member.js';
import { ResponseModel } from '../utils/Response.js';

export class MemberController {
    
    // GET ALL MEMBERS BY CHAT
    static async getAllMembers(req, res, next) {
        const { id } = req.params;

        try {
            const members = await MemberModel.getAllMembers({ id });
            if (members.length !== 0) return res.json(ResponseModel.success(members, 'Miembros obtenidos correctamente'));
            
            res.status(404).json(ResponseModel.error("El chat no tiene miembros", 404));
        } catch (error) {
            next(error);
        }
    }

    // ADD MEMBER TO CHAT
    static async addMember(req, res, next) {
        const { id } = req.params;
        const result = validateMember(req.body);

        if (result.error) {
            return res.status(400).json(ResponseModel.error('Validación fallida', 400, JSON.parse(result.error.message)));
        }

        try {
            const members = await MemberModel.addMember({ id, input: result.data});
            if (members.length !== 0) return res.json(ResponseModel.success(members, 'Miembros obtenidos correctamente'));
            
            res.status(404).json(ResponseModel.error("El chat no tiene miembros", 404));
        } catch (error) {
            next(error);
        }
    }

    // KICK MEMBER TO CHAT
    static async delete(req, res, next) {
        const { id, user } = req.params;

        try {
            const success = await MemberModel.delete({ id, user });
            if (!success) {
                return res.status(404).json(ResponseModel.error('Miembro no encontrado', 404));
            }
            res.status(200).json(ResponseModel.success(null, 'Miembro eliminado correctamente'));
        } catch (error) {
            next(error);
        }
    }


}