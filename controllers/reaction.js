import { ReactionModel } from '../models/mysql/reaction.js';
import { validateReaction} from '../schemas/reaction.js'

export class ReactionController {

    // GET ALL
    static async getAll(req, res) {
        const pubs = await ReactionModel.getAll();
        res.status(200).json(pubs);
    }


    // GET BY ID
    static async getById(req, res) {
        const { id, idReaction } = req.params;
        const reactions = await ReactionModel.getById({ id, idReaction });
        if (reactions.length != 0) return res.json(reactions);
        res.status(404).json({message:"Publication don't exists"});
    }
    

    // CREATE
    static async create(req, res) {
        const { id } = req.params;
        const result = validateReaction(req.body);
        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }
        const newReaction =  await ReactionModel.create({ id, input: result.data });
        res.status(201).json(newReaction);
    }



    // UPDATE
    static async update(req, res) {
        const{ id } = req.params;
        const result = validatePartialPublication(req.body);

        if (result.error) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const updatePub = await PublicationModel.update({id, input: result.data});

        if(!updatePub) return res.status(404).json({message: 'Publication not found uu'});
        res.status(200).json(updatePub);
    }


    // DELETE (Logic)
    static async delete (req, res){
        const { id } = req.params;
        const success = await PublicationModel.delete({ id });
        if (!success) return res.status(404).json({message: "Publication not found uu"});

        res.status(200).json({message: "Publicación borrada correctamente!"});
    }
}