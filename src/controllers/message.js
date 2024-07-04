import { validateMessage, validatePartialMessage } from '../schemas/message.js';
import { MessageModel } from '../models/mysql/message.js';
import { ResponseModel } from '../utils/Response.js';

export class MessageController {

    // GET ALL MESSAGES
    static async getAll(req, res, next) {
        try {
            const messages = await MessageModel.getAll();
            res.status(200).json(ResponseModel.success(messages, 'Mensajes obtenidos correctamente'));
        } catch (error) {
            next(error)
        }
    }

    // GET BY ID 
    static async getById(req, res, next) {
        const { id } = req.params;

        try {
            const messages = await MessageModel.getById({ id });
            if (messages.length !== 0) return res.json(ResponseModel.success(messages, 'Mensaje obtenido correctamente'));

            res.status(404).json(ResponseModel.error(messages, 'Mensaje no encontrado.'));
        } catch (error) {
            next(error)
        }
    }

    // GET ALL MESSAGES BY CHAT
    static async getByChat(req, res, next) {
        const { id } = req.params;

        try {
            const messages = await MessageModel.getByChat({ id });
            if (messages.length !== 0) return res.json(ResponseModel.success(messages, 'Mensajes obtenidos correctamente'));

            res.status(404).json(ResponseModel.error(messages, 'Mensajes no encontrados.'));
        } catch (error) {
            next(error)
        }
    }

    // CREATE
    static async create(req, res, next) {
        const { id } = req.params;
        const result = validateMessage(req.body);

        if (result.error) {
            return res.status(400).json(ResponseModel.error('Validación fallida', 400, JSON.parse(result.error.message)));
        }

        try {
            const newMsg = await MessageModel.create({ id, input: result.data });
            res.status(201).json(ResponseModel.success(newMsg, 'Mensaje creado correctamente', 201));
        } catch (error) {
            console.error('Error al crear un nuevo mensaje:', error);
            next(error);
        }
    }

    // UPDATE
    static async update(req, res, next) {
        const { id } = req.params;
        const result = validatePartialMessage(req.body);

        if (result.error) {
            return res.status(400).json(ResponseModel.error('Validación fallida', 400, JSON.parse(result.error.message)));
        }

        try {
            const updMessage = await MessageModel.update({ id, input: result.data });
            if (!updMessage) {
                return res.status(404).json(ResponseModel.error('Mensaje no encontrado', 404));
            }
            res.status(200).json(ResponseModel.success(updMessage, 'Mensaje actualizado correctamente'));
        } catch (error) {
            next(error);
        }
    }

    // DELETE
    static async delete(req, res, next) {
        const { id } = req.params;

        try {
            const success = await MessageModel.delete({ id });
            if (!success) {
                return res.status(404).json(ResponseModel.error('Mensaje no encontrado', 404));
            }
            res.status(200).json(ResponseModel.success(null, 'Mensaje eliminado correctamente'));
        } catch (error) {
            next(error);
        }
    }
}