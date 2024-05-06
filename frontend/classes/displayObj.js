import { Sprite } from "./sprite.js";

// a general class for displaying an object during a move segment
export class DisplayObj {
    x; // x position of object
    y; // y position of object
    sprite; // object's sprite

    /**
     * Create a DisplayObj
     * @param { number } x position of obj
     * @param { number } y position of obj
     * @param { string } sheetSrc path to sprite sheet
     * @param { number } sheetX x position sprite starts on sheet
     * @param { number } sheetY y position sprite starts on sheet
     * @param { number } width width of sprite in pixels on sheet
     * @param { number } height height of sprite in pixels on sheet
     * @param { number } dispWidth how wide to display item on canvas
     * @param { number } dispHeight how tall to display item on canvas
     */
    constructor ( x, y, sheetSrc, sheetX, sheetY, width, height, dispWidth, dispHeight ) {
        this.sprite = new Sprite( sheetSrc, sheetX, sheetY, width, height, dispWidth, dispHeight );
        this.x = x;
        this.y = y;
    }

    /**
     * Draw the object
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     */
    draw( canvas, context ) {
        // scale x and y positions with size of canvas
        const xScale = canvas.clientWidth / 1000;
        const yScale = canvas.clientHeight / 800;
        
        // draw the object
        context.drawImage( this.sprite.img, this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height, this.x * xScale, this.y * yScale, this.sprite.dispWidth, this.sprite.dispHeight );
    }
}