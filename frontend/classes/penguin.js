import { SpriteSet } from './spriteSet.js';

// create penguin class
export class Penguin {
    color; // color of penguin
    x; // x position on canvas
    y; // y position on canvas
    name; // username of penguin
    sprites; // sprite set of penguin, based on color
    currSprite; // current sprite displayed
    target; // target penguin is moving towards
    speed; // speed of penguin, based on devicePixelRatio

    /**
     * Creates a penguin
     * @param { string } spriteName color or skin name 
     * @param { number } startX starting x position of penguin on canvas
     * @param { number } startY starting y position of penguin on canvas
     * @param { string } name name of penguin
     */
    constructor( spriteName, startX, startY, name ) {
        // setup inputted vars
        this.color = spriteName;
        this.x = startX;
        this.y = startY;
        this.name = name;

        // saves last position in move mode
        this.lastPos = { x: startX, y: startY };

        // default params
        this.speed = 1.5 / devicePixelRatio;
        this.target = { x: startX, y: startY }; // set first target to be starting position

        // where to display name
        this.dispName = false;

        // setup sprites and current sprite
        this.sprites = new SpriteSet( spriteName, this.target );
        this.currSprite = this.sprites.initSprite();
    }

    /**
     * Move towards a target
     * @param { Object } target new x and y to move towards in the form of { x: number, y : number }
     */
    move( target ) {
        // if there is a new target passed in, set the new target
        if ( target ) {
            this.target = target;
        }

        // if not at current target
        if ( this.x != this.target.x || this.y != this.target.y ) {
            const xDist = this.target.x - this.x;
            const yDist = this.target.y - this.y;

            // save old position
            const oldPos = { x: this.x, y: this.y };

            // scale movement to move speed distance per movement
            const p = this.speed / Math.sqrt( Math.pow( xDist, 2 ) + Math.pow( yDist, 2 ) );

            // move along line towards target
            this.x = xDist * p + this.x;
            this.y = yDist * p + this.y;

            // if very close to target, move to it
            if ( p > 1 ) {
                this.x = this.target.x;
                this.y = this.target.y;
            }

            // set new sprite
            this.currSprite = this.sprites.updateSprite( oldPos, { x: this.x, y: this.y } ) || this.current;

            // set lastPos
            this.lastPos = { x: this.x, y: this.y };
        }

    }

    /**
     * Setup sprite and location for an episode segment
     */
    episodeStyle() {
        // change sprite for episode
        this.currSprite = this.sprites.episode[ 0 ];

        // set location on screen, which is special for the pizza worker
        this.name === 'Pizza Worker' ? this.x = 500 : this.x = 650;
        this.y = 200;

        // do not draw name above their head
        this.dispName = false;
    }

    /**
     * Draw a penguin
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     */
    draw( canvas, context ) {

        // scale penguin movement with size of canvas
        const x = this.x * canvas.clientWidth / 1000;
        const y = this.y * canvas.clientHeight / 800;

        // draw name above penguin if dispName is true
        if ( this.dispName ) this.drawName( context, x / this.x, y / this.y );

        // draw penguin
        context.drawImage( this.currSprite.img, this.currSprite.x, this.currSprite.y, this.currSprite.width, this.currSprite.height, x, y, this.currSprite.dispWidth, this.currSprite.dispHeight );
    }

    /**
     * Draw the name of the penguin above their head
     * @param {*} context context of canvas
     * @param { number } xScale 1/1000th of the width of the canvas
     * @param { number } yScale 1/800th of the height of the canvas
     */
    drawName( context, xScale, yScale ) {

        // settings for background of name
        context.globalAlpha = 0.6;
        context.fillStyle = 'black';

        // draw name background
        context.beginPath();
        context.roundRect( this.x * xScale, ( this.y - 10 )* yScale, this.sprites.south[ 0 ].dispWidth, 10 * yScale, [ 5 ] );
        context.fill();

        // reset alpha and set text settings
        context.globalAlpha = 1;
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.font = `${10 * yScale}px sans-serif`;

        // draw name
        context.fillText( this.name, this.x * xScale + this.sprites.south[ 0 ].dispWidth / 2, ( this.y - 2 ) * yScale );

        // reset text alignment
        context.textAlign = 'left';
    }
}