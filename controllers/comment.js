import { validateComment, validatePartialComment} from '../schemas/comment.js'
import { CommentModel } from '../models/mysql/comment.js';

export class CommentController {
    static async getAll(req, res) {
        const { id } = req.params;
        const pubs = await CommentModel.getAll({ id });
        res.status(200).json(pubs);
    }

    // CREATE COMMENT
    static async create(req, res) {
        const { id } = req.params;
        const result = validateComment(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newComment = await CommentModel.create({ id, input: result.data });
        res.status(201).json(newComment);
    }

    // UPDATE COMMENT
    static async update(req, res) {
        const{ idComment } = req.params;
        const result = validatePartialComment(req.body);

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const updateComment = await CommentModel.update({idComment, input: result.data});

        if(!updateComment) return res.status(404).json({message: 'Publication not found uu'});
        res.status(200).json(updateComment);
    }

    // DELETE COMMENT (Logic)
    static async delete(req, res){
        const { idComment } = req.params;
        const success = await CommentModel.delete({ idComment });
        if (!success) return res.status(404).json({message: "Publication not found uu"});

        res.status(200).json({message: "Publicación borrada correctamente!"});
    }
}