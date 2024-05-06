import { InventoryObj } from "./inventoryObj.js";

// class to represent a player's inventory
export class Inventory {
    objects; // array of objects in inventory

    /**
     * Create an inventory
     * @param { Array<InventoryObj> } objects array of inventory objects
     */
    constructor( objects ) {
        // if there are no objects, set them to an empty array
        if ( objects ) {
            this.objects = objects;
        } else {
            this.objects = [];
        }
    }

    /**
     * Draw an inventory
     * @param {*} canvas canvas element
     * @param {*} context context of canvas
     */
    draw( canvas, context ) {

        // numbers for scaling
        const xScale = canvas.clientWidth / 1000;
        const yScale = canvas.clientHeight / 800;

        // create inventory background
        context.fillStyle = 'white';
        context.globalAlpha = 0.8;
        context.fillRect( 0, 700 * yScale, 1000 * xScale, 100 * yScale );
        context.globalAlpha = 1;

        // create slots for inventory
        context.strokeStyle = 'gray'; // set outline color
        context.globalAlpha = 1; // reset alpha
        const slotWidth = 125 * xScale * 0.8;
        const widthGap = 125 * xScale * 0.175;
        const slotHeight = 100 * yScale * 0.8;
        const heightGap = 710 * yScale;

        // draw each inventory slot
        for ( let i = 0; i < 8; i++ ) {
            // starting x position based on index
            const startX = ( i + 1 ) * widthGap + i * slotWidth;

            // draw background of slot
            context.beginPath();
            context.roundRect( startX, heightGap, slotWidth, slotHeight, [ 5 ] );
            context.fill();
            context.stroke();

            // if there is inventory at that slot, draw it
            if ( this.objects[ i ] ) {
                this.objects[ i ].draw( context, startX, heightGap, slotWidth, slotHeight );
            }
        }
    }

    /**
     * Add an item to the inventory if not already in it
     * @param { string } name name of inventory item
     */
    add( name, player ) {
        if ( !this.inInventory( name ) ) { 
            this.objects.push( new InventoryObj( name ) );
            this.addItem( name, player )
        }
    }

    /**
     * Check if item is in inventory
     * @param { string } name name of inventory item
     */
    inInventory( name ) {
        return this.objects.filter( o => o.name === name ).length > 0;
    }

    /**
     * Send a fetch request to add item to user's inventory
     * @param { string } itemName name of inventory item
     */
     addItem( itemName, player ) {
        fetch( `http://localhost:3000/user/${ player.name }/inventory`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify( { itemName } )
        })
        .catch( err => new Error( 'Error adding to inventory.' ) );
    }
}