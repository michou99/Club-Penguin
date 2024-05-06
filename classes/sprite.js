// class for sprites
export class Sprite {
    img; // image of sprite
    x; // x position of sprite on spritesheet
    y; // y position of sprite on spritesheet
    width; // width of sprite on spritesheet
    height; // height of sprite on spritesheet
    dispWidth; // how wide to display sprite
    dispHeight; // how tall to display sprite
    
    /**
     * Create a Sprite
     * @param { string } sheetSrc path to sprite sheet
     * @param { number } sheetX x position of sprite on sheet
     * @param { number } sheetY y position of sprite on sheet
     * @param { number } width width of sprite on sheet
     * @param { number } height height of sprite on sheet
     * @param { number } dispWidth width of element on canvas, optional
     * @param { number } dispHeight height of element on canvas, optional
     */
    constructor( sheetSrc, sheetX, sheetY, width, height, dispWidth, dispHeight ) {
        // setup image
        this.img = new Image();
        this.img.src = sheetSrc;
        this.img.crossOrigin = true;

        // setup where on sheet sprite is
        this.x = sheetX;
        this.y = sheetY;
        this.width = width;
        this.height = height;

        // if no dispWidth, set to width
        if ( dispWidth ) {
            this.dispWidth = dispWidth;
        } else {
            this.dispWidth = width;
        }

        // if no dispHeight, set to height
        if ( dispHeight ) {
            this.dispHeight = dispHeight;
        } else {
            this.dispHeight = height;
        }
    }
}