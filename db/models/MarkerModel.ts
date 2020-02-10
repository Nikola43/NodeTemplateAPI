import {BaseModel} from "./baseModels/BaseModel";
import {Position} from "./Position";

export class MarkerModel {
    public id: number;
    public type: string;
    public title: string;
    public subtitle: string;
    public image: string;
    public Position!: Position;

    constructor(id: number, type: string, title: string, subtitle: string, image: string, Position: Position) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.subtitle = subtitle;
        this.image = image;
        this.Position = Position;
    }
}
