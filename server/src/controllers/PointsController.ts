import knex from '../database/connection';
import {Request, Response} from 'express';

class PointsController{

    async index(request: Request, response:Response){
        const {city, uf, items} = request.query;
        console.log(city, uf, items);

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('points_items', 'points.id', '=', 'points_items.point_id')
        .whereIn('items.id', parsedItems)//to Do
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*');
        return response.json(points);
    }

    async show(request:Request, response: Response){
        const {id} = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({message: 'Point not found'});
        }

        const items = await knex('items')
        .join('points_items', 'item_id', '=', 'items.id')
        .where('points_items.point_id', id)
        .select('items.title')
        return response.json({point, items});
    }
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();
        const point = {
        image:'image-fake',
        name,
        email,
        whatsapp,
        latitude,
        longitude,
        city,
        uf
    };
        const insertedIds = await trx('points').insert(point);
        const point_id = insertedIds[0];
        const pointItems = items.map((item_id: number) =>{
            return {
                item_id,
                point_id,
            };
        })
    
        await trx('points_items').insert(pointItems);//to Do

        await trx.commit();
        return response.json({
            id: point_id,
            ...point
        });
     }
}

export default PointsController;