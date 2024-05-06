import { Sprite } from './sprite.js';

// class to represent an item stored the inventory
export class InventoryObj {
    sprite; // image of object
    name; // name as object, same as in db in backend

    /**
     * Create a inventory object
     * @param { string } name name of object, should match name in seeded db
     */
    constructor ( name ) {
        // setup vars
        this.name = name;
        const url = `../sprites/${ name }.png`;

        // set up x, y, width, and height for sprite image
        let params;
        switch ( name ) {
            case 'flyer':
                params = [ 0, 0, 197, 255 ];
                break;
            case 'garlic-bread':
                params = [ 0, 44, 512, 424 ];
                break;
            case 'autograph':
                params = [ 0, 0, 250, 264 ];
                break;
            case 'medal':
                params = [ 0, 0, 1922, 2086 ];
                break;
            case 'puffle-treats':
                params = [ 0, 0, 250, 341 ];
                break;
        }

        // create sprite
        this.sprite = new Sprite( url, ...params );
    }

    /**
     * Draw object in inventory
     * @param {*} context canvas context
     * @param { number } x x position of object
     * @param { number } y y position of object
     * @param { number } width width of object
     * @param { number } height height of object
     */
    draw( context, x, y, width, height ) {
        // calculate scaled height and width of object
        const scaled = this.scale( width, height );

        // draw object
        context.drawImage( this.sprite.img, this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height, x + ( width - scaled.width ) / 2, y + ( height - scaled.height ) / 2, scaled.width, scaled.height );
    }

    /**
     * Find the optimal height and width less than the height and width inputted while maintaining the aspect ratio
     * @param { number } width new width to scale object to
     * @param { number } height new height to scale object to
     * @returns { width: number, height: number } new width and height of object
     */
    scale( width, height ) {
        // calculate what the height and width would be scaled
        const scaledHeightFromWidth = this.sprite.height / this.sprite.width * width;
        const scaledWidthFromHeight = this.sprite.width / this.sprite.height * height;

        // if scaled height would be smaller than allowed height, return height as scaled
        if ( scaledHeightFromWidth < height ) {
            return { width, height: scaledHeightFromWidth };
        // otherwise, return width as scaled
        } else {
            return { width: scaledWidthFromHeight, height };
        }
    }
}