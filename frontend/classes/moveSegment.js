import { StorySegment } from './storySegment.js';
import { Penguin } from './penguin.js';

// class to represent a move segment
export class MoveSegment extends StorySegment {
    startPos; // starting position of player
    endPos; // end position of player

    /**
     * Create a movement segment
     * @param { Object } startPos player starting position in { x : number, y : number }
     * @param { Object } endPos player ending position in { x : number, y : number }
     * @param { Background } background background object
     * @param { Array } foreground array of foreground objects, such as penguins
     * @param { StorySegment } next story segment to move to next
     */
    constructor ( id, startPos, endPos, background, foreground, next ) {
        super( id, background, foreground, next );

        // set starting and ending position
        this.startPos = startPos;
        this.endPos = endPos;

        // set player target as endPos
        this.player.move( endPos );
    }

    /**
     * Setup variables for starting movement
     */
    initMove() {
        // set init to true so it isn't called again
        this.init = true;

        // reset all penguin positions to be south and back to default positions
        this.foreground.forEach( p => {
            if ( p instanceof Penguin ) {
                p.currSprite = p.sprites.south[ 0 ]; 
                p.x = p.lastPos.x;
                p.y = p.lastPos.y;
                p.dispName = true;
            }
        });

        // set starting x and y
        this.player.x = this.startPos.x;
        this.player.y = this.startPos.y;

        // set player target as endPos
        this.player.move( this.endPos );
        
    }

    /**
     * Draw the move segment
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     * @returns next StorySegment when it finishes
     */
    draw( canvas, context ) {

        // if move hasn't been initiated, set starting vars
        if ( !this.init ) this.initMove();

        // draw as normal
        return super.draw( canvas, context );
    }

    /**
     * Checks if player position is the same as endPos
     * @returns true when player is at endPos
     */
    complete () {
        return this.player.x === this.endPos.x && this.player.y === this.endPos.y;
    }
}