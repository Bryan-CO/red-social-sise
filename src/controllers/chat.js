import { validateChat, validatePartialChat } from '../schemas/chat.js';
import { ChatModel } from '../models/mysql/chat.js';
import { ResponseModel } from '../utils/Response.js';

export class ChatController {

    // GET ALL CHATS
    static async getAll(req, res, next) {
        try {
            const chats = await ChatModel.getAll();
            res.status(200).json(ResponseModel.success(chats, 'Chats obtenidos correctamente'));
        } catch (error) {
            next(error)
        }
    }

    // GET BY ID
    static async getById(req, res, next) {
        const { id } = req.params;

        try {
            const chat = await ChatModel.getById({ id });
            if (chat.length !== 0) return res.json(ResponseModel.success(chat, 'Chat obtenido correctamente'));
            
            res.status(404).json(ResponseModel.error("El chat no existe", 404));
        } catch (error) {
            next(error);
        }
    }

    // GET ALL BY IDUSER
    static async getAllByUser(req, res, next) {
        const { id } = req.params;

        try {
            const chats = await ChatModel.getAllByUser({ id });
            if (chats.length !== 0) return res.json(ResponseModel.success(chats, 'Chats obtenidos correctamente'));
            
            res.status(404).json(ResponseModel.error("No tiene chats.", 404));
        } catch (error) {
            next(error);
        }
    }

    // CREATE
    static async create(req, res, next) {
        const result = validateChat(req.body);
        if (result.error) {
            return res.status(400).json(ResponseModel.error('Validación fallida', 400, JSON.parse(result.error.message)));
        }

        try {
            const newChat = await ChatModel.create({ input: result.data });
            res.status(201).json(ResponseModel.success(newChat, 'Chat creado correctamente', 201));
        } catch (error) {
            next(error);
        }
    }

    // UPDATE
    static async update(req, res, next) {
        const { id } = req.params;
        const result = validatePartialChat(req.body);

        if (result.error) {
            return res.status(400).json(ResponseModel.error('Validación fallida', 400, JSON.parse(result.error.message)));
        }

        try {
            const updChat = await ChatModel.update({ id, input: result.data });
            if (!updChat) {
                return res.status(404).json(ResponseModel.error('Chat no encontrado', 404));
            }
            res.status(200).json(ResponseModel.success(updChat, 'Chat actualizado correctamente'));
        } catch (error) {
            next(error);
        }
    }

    // DELETE (Logic)
    static async delete(req, res, next) {
        const { id } = req.params;

        try {
            const success = await ChatModel.delete({ id });
            if (!success) {
                return res.status(404).json(ResponseModel.error('Chat no encontrado', 404));
            }
            res.status(200).json(ResponseModel.success(null, 'Chat eliminado correctamente'));
        } catch (error) {
            next(error);
        }
    }

}
