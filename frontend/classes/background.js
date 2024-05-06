import { Sprite } from "./sprite.js";

export class Background {
    sprite; // background's image
    height; // height of background - should be height of canvas
    width; // width of background - should be width of canvas

    /**
     * 
     * @param { string } sheetSrc path to image
     * @param { number } width width of canvas
     * @param { number } height height of canvas
     */
    constructor ( sheetSrc, width, height ) {
        this.sprite = new Sprite( sheetSrc, 0, 0, 0, 0 );
        this.width = width;
        this.height = height;
    }

    /**
     * Draw the background
     * @param {*} context context of the canvas obj
     */
    draw( context ) {
        context.drawImage( this.sprite.img, 0, 0, this.width, this.height );
    }
}