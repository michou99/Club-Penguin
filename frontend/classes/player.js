import { Penguin } from './penguin.js';
import { Inventory } from './inventory.js';

/**
 * Class for the player
 */
export class Player extends Penguin {
    username; // username of player
    inventory; // inventory of player

    /**
     * Create a player object
     * @param { string } color color of penguin
     * @param { number } startX x position on canvas to draw penguin
     * @param { number } startY y position on canvas to draw penguin
     * @param { string } username username of penguin
     * @param { Array<InventoryObj> } inventory array of player's inventory
     */
    constructor ( color, startX, startY, username, inventory ) {
        super( color, startX, startY, username );

        // if there is an inventory passed in, set up a new inventory object
        if ( inventory ) {
            this.inventory = new Inventory( inventory );
        } else {
            this.inventory = new Inventory();
        }
    }

    /**
     * Set player to correct sprite and placement for episode segments
     */
    episodeStyle() {
        super.episodeStyle();
        this.x = 100;
    }

    /**
     * Add a new object to the inventory and update inventory in backend
     * @param { string } name name of inventory object
     */
     give( name ) {
        this.inventory.add( name, this );
    }

}