import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment';
import Comment from 'App/Models/Comment';

export default class CommentsController {

    public async store({request, params, response}: HttpContextContract) {
        const { id } = params;
        const { username, text } = request.body();
        const body = request.body();

        await Moment.findOrFail(id);

        body.momentId = id;

        if (username && text) {
            const comment = await Comment.create({momentId: body.momentId, username, text});
            
            response.status(201);
            return { comment };
        }
    }

}
