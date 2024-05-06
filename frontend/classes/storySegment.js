import { Inventory } from "./inventory.js";
import { Player } from './player.js';

// class to represent a general story segment
export class StorySegment {
    id; // id of segment
    next; // next Segment after this segment
    background; // background object
    foreground; // array of foreground objects
    player; // player object
    inventory; // inventory of player

    /**
     * Create a story segment
     * @param { Background } background background object
     * @param { Array } foreground array of foreground objects, such as penguins
     * @param { StorySegment } next story segment to move to next
     */
    constructor( id, background, foreground, next ) {
        // setup vars inputted
        this.id = id;
        this.background = background;
        this.foreground = foreground;

        // if there is a next, set it
        if ( next ) this.next = next;

        // setup inventory as empty or as player's inventory if there is a player
        this.player = foreground.filter( e => e instanceof Player )[ 0 ];
        if ( !this.player ) {
            this.inventory = new Inventory();
        } else {
            this.inventory = this.player.inventory;
        }
    }

    /**
     * Draw segment
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     * @returns next segment when this segment finishes
     */
    draw ( canvas, context ) {
        // if segment isn't complete or skipped
        if ( !this.complete() && !this.skip ) {
            // move player
            this.player.move();

            // draw background
            this.background.draw( context );

            // draw objects in foreground
            this.foreground.forEach( e => e.draw( canvas, context ) );

            // draw inventory
            this.inventory.draw( canvas, context );
        
        // if finished or skipped, return next segment
        } else if ( this.next || this.skip ) {
            return this.next;
        }
        
    }

    /**
     * Control what happens when a player clicks a segment
     * @param { number } x x position of click
     * @param { number } y y position of click
     */
    click( x, y ) {}

    /**
     * Returns true when segment is finished
     */
    complete() {}

    /**
     * Make segment skip to next
     */
    skipSeg() {
        this.skip = true;
    }
}