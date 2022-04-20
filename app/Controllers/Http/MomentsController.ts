import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { v4 as uuidv4 } from 'uuid'; 
import Application from '@ioc:Adonis/Core/Application';

import Moment from 'App/Models/Moment';

export default class MomentsController {

    public async store({request, response}: HttpContextContract) {
        let { title, description, image } = request.body()

        const img = request.file('image', { size: '2mb' });

        if (img) {
            const imageName = `${uuidv4()}.${img.extname}`;
            
            await img.move(Application.tmpPath('uploads'), {
                name: imageName
            })

            image = imageName
        }

        const post = await Moment.create({title, description, image})
        
        response.status(201);
        
        return { post };
    }

    public async index() {
        const moments = await Moment.query().preload('comments');
        
        return { moments };
    }

    public async show({params}: HttpContextContract) {
        const moment = await Moment.findOrFail(params.id);

        await moment.load('comments');

        return { moment };
    }

    public async destroy({params, response}: HttpContextContract) {
        const moment = await Moment.findOrFail(params.id);

        await moment.delete();
        response.status(200);

        return {message: 'Deletado com sucesso!'};
    }

    public async update({params, request, response}: HttpContextContract) {
        const { title, description, image } = request.body();
        const moment = await Moment.findOrFail(params.id);
        
        if (title) {
            moment.title = title;
        }

        if (description) {
            moment.description = description;
        }

        if (image) {
            const img = request.file('image', { size: '2mb' });
            
            if (img) {
                const imageName = `${uuidv4()}.${img.extname}`;
                
                moment.image = imageName;     
            }
        }

        await moment.save();
        response.status(200);
        return { moment };
    }

}
