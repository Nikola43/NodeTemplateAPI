import {Request, Response} from "express";
import {MarkerModel} from "../db/models/MarkerModel";
import {PositionModel} from "../db/models/PositionModel";

const HttpStatus = require('http-status-codes');

class MarkersController {
    // functions
    // GET ALL
    getAll = (req: Request, res: Response, next: Function) => {
        const markers: any[] = [];

        for (let i = 0; i < 200; i++) {
            const type = 'user';
            const title = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            const subtitle = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('');
            const image = `https://i.picsum.photos/id/${this.getRandomInt(1, 1000)}/300/300.jpg`;
            const coordinate = new PositionModel({Id: i, Latitude: -(this.getRandomInt(1, 6)), Longitude: this.getRandomInt(1, 6)});

            const marker: MarkerModel = new MarkerModel(i, type, title, subtitle, image, coordinate);
            markers.push(marker)
        }
        res.status(HttpStatus.OK).send(markers);
    };


    getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

const markersController = new MarkersController();
export default markersController;
