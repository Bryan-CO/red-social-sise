import { validateComment, validatePartialComment } from '../schemas/comment.js';
import { CommentModel } from '../models/mysql/comment.js';
import { ResponseModel } from '../utils/Response.js';

export class CommentController {

    // GET ALL COMMENTS BY PUBLICATION ID
    static async getAll(req, res, next) {
        try {
            const comments = await CommentModel.getAll();
            res.status(200).json(ResponseModel.success(comments, 'Comentarios obtenidos correctamente'));
        } catch (error) {
            next(error)
        }
    }

    // GET COMMENTS BY ID
    static async getById(req, res, next) {
        const { id } = req.params;

        try {
            const comments = await CommentModel.getById({ id });
            if (comments.length !== 0) return res.json(ResponseModel.success(comments, 'Comentario obtenido correctamente'));

            res.status(404).json(ResponseModel.error(comments, 'Comentario no encontrado.'));
        } catch (error) {
            next(error)
        }
    }

    // GET ALL ANSWERS BY COMMENT ID
    static async getAnswerById(req, res, next) {
        const { id } = req.params;

        try {
            const comments = await CommentModel.getAnswerById({ id });
            if (comments.length !== 0) return res.json(ResponseModel.success(comments, 'Respuestas obtenidas correctamente'));

            res.status(404).json(ResponseModel.error("No hay respuestas", 404));
        } catch (error) {
            next(error)
        }
    }

    // CREATE NEW COMMENT FOR A PUBLICATION
    static async create(req, res, next) {
        const { id } = req.params;
        const result = validateComment(req.body);

        if (result.error) {
            return res.status(400).json(ResponseModel.error('Validación fallida', 400, JSON.parse(result.error.message)));
        }

        try {
            const newComment = await CommentModel.create({ id, input: result.data });
            res.status(201).json(ResponseModel.success(newComment, 'Comentario creado correctamente', 201));
        } catch (error) {
            next(error);
        }
    }

    // CREATE NEW ANSWER FOR A COMMENT
    static async createAnswer(req, res, next) {
        const { id, comment } = req.params;
        const result = validateComment(req.body);

        if (result.error) {
            return res.status(400).json(ResponseModel.error('Validación fallida', 400, JSON.parse(result.error.message)));
        }

        try {
            const newAnswer = await CommentModel.createAnswer({ id, comment, input: result.data });
            res.status(201).json(ResponseModel.success(newAnswer, 'Respuesta creada correctamente', 201));
        } catch (error) {
            next(error);
        }
    }


    // UPDATE COMMENT
    static async update(req, res, next) {
        const { idComment } = req.params;
        const result = validatePartialComment(req.body);

        if (result.error) {
            return res.status(400).json(ResponseModel.error('Validación fallida', 400, JSON.parse(result.error.message)));
        }

        try {
            const updateComment = await CommentModel.update({ idComment, input: result.data });
            if (!updateComment) {
                return res.status(404).json(ResponseModel.error('Comentario no encontrado', 404));
            }
            res.status(200).json(ResponseModel.success(updateComment, 'Comentario actualizado correctamente'));
        } catch (error) {
            next(error);
        }
    }

    // DELETE COMMENT (Logic)
    static async delete(req, res, next) {
        const { idComment } = req.params;

        try {
            const success = await CommentModel.delete({ idComment });
            if (!success) {
                return res.status(404).json(ResponseModel.error('Comentario no encontrado', 404));
            }
            res.status(200).json(ResponseModel.success(null, 'Comentario eliminado correctamente'));
        } catch (error) {
            next(error);
        }
    }
}
