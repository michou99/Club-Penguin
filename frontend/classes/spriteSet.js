import { Sprite } from './sprite.js';

export class SpriteSet {
    current; // current sprite shown for set
    index; // index of walking animation
    lastUpdate; // time walking animation was last updated
    updateSpeed; // how fast to update sprites

    // array of sprites for each direction
    north;
    northeast; 
    east;
    southeast;
    south;
    southwest;
    west;
    northwest;
    episode; // sprites for episode segments

    /**
     * Create a SpriteSet
     * @param { string } spriteName color or name of character
     * @param { Object } currPosition { x: number, y: number }
     */
    constructor( spriteName, currPosition ) {
        
        // setup sprite arrays based on direction
        const url = `../sprites/${spriteName}-sprites.png`;
        this.createSprites( url, spriteName );

        // setup other variables
        this.current = this.south;
        this.index = 0;
        this.lastUpdate = currPosition;
        this.updateSpeed = 100;
    }

    /**
     * Get the inital sprite
     * @returns starting sprite
     */
    initSprite() {
        return this.current[ 0 ];
    }

    /**
     * Update which sprite is used based on movement
     * @param {*} prevPosition previous position of penguin
     * @param {*} newPosition new position of penguin
     * @returns new sprite of penguin
     */
    updateSprite( prevPosition, newPosition ) {
        // get new sprite array to use
        const newSet = this.calculateSprite( prevPosition, newPosition );
        
        // distance since last update is greater than updateSpeed
        const update = Math.abs( Math.pow( this.lastUpdate.x - newPosition.x, 2 ) + Math.pow( this.lastUpdate.y - newPosition.y, 2 ) ) > this.updateSpeed;

        // if sprite hasn't changed and has walked far enough to update
        if ( newSet === this.current && update ) {
            // progress walking frame by 1
            this.index +=1;

            // if index is beyond length of array, reset it to 0
            if ( this.index >= this.current.length ) {
                this.index = 0;
            }

            // reset last update
            this.lastUpdate = newPosition;
        }
        // if updating set, reset current and index
        else if ( newSet != this.current ) {
            this.current = newSet;
            this.index = 0;

            // update last update
            this.lastUpdate = newPosition;
        }

        // return sprite
        return this.current[ this.index ];
    }

    /**
     * Get the new sprite set based on direction of movement
     * @param {*} prevPosition previous position of penguin
     * @param {*} newPosition new position of penguin
     * @returns array of sprites to use for penguin
     */
    calculateSprite( prevPosition, newPosition ) {
        const right = prevPosition.x < newPosition.x; // moving towards right
        const xEqual = prevPosition.x === newPosition.x; // no x movement
        const up = prevPosition.y > newPosition.y; // moving up
        const yEqual = prevPosition.y === newPosition.y; // no y movement

        // if all are equal, return false
        if ( xEqual && yEqual ) {
            return false;
        }
        // if not changing x
        else if ( xEqual ) {
            // if moving up, north
            if ( up ) {
                return this.north;
            // if moving down, south
            } else {
                return this.south;
            }
        }
        // if not changing y
        else if ( yEqual ) {
            // if moving right, east
            if ( right ) {
                return this.east;
            }
            // if moving left, west
            else {
                return this.west;
            }
        }
        // if changing x and y
        else {
            // right and up, northeast
            if ( right && up ) {
                return this.northeast;
            }
            // right and down, southeast
            else if ( right ) {
                return this.southeast;
            }
            // if left and up, northwest
            else if ( up ) {
                return this.northwest;
            }
            // if left and down, southwest
            else {
                return this.southwest;
            }
        }
    }

    /**
     * Get array of coordinates for each direction of sprite in a single object
     * @param { string } spriteName name of sprite
     * @returns Array of [ x, y, width, height, dispWidth, dispHeight ] for each direction in an object with the direction as the key
     */
    getSpriteLocation( spriteName ) {
        // variables to easily scale all sprites' dispWidth and dispHeight
        const scale = 1.3;
        let xWidth = 131 * scale;
        let yWidth = 142 * scale;


        // give the correct coordinates based on sprite name
        switch ( spriteName ) {
            case 'auntarctic':
                return {
                    south: [ [ 0, 0, 486, 555, xWidth, yWidth ] ],
                    episode: [ [ 950, 5, 833, 1533, 600, 1100 ] ]
                };
            case 'waiter':
                return {
                    south: [ [ 962, 0, 250, 334, xWidth, yWidth ] ],
                    episode: [ [ 0, 0, 962, 1380, 800, 1100 ] ]
                };
            case 'pizzaworker':
                return {
                    south: [ [ 867, 0, 145, 291, xWidth, yWidth * 1.4 ] ],
                    episode: [ [ 18, 34, 803, 645, 1200, 1100 ] ]
                };
            case 'petworker':
                return {
                    episode: [ [ 59, 0, 508, 626, 800, 1100 ] ],
                    south: [ [ 626, 0, 1000, 1063, xWidth, yWidth ] ]
                };
            case 'bystander':
                return {
                    south: [ [ 376, 0, 1000, 1276, xWidth, yWidth ] ],
                    episode: [ [ 0, 0, 376, 651, 650, 1150 ] ]
                };
            case 'agent':
                return {
                    episode: [ [ 0, 0, 591, 764, 800, 1150 ] ],
                    south: [ [ 593, 0, 1483, 1699, xWidth, yWidth ] ]
                };
            case 'dojo': 
                return {
                    south: [ [ 0, 0, 250, 278, xWidth, yWidth ] ]
                }
            case 'cadence':
                return {
                    south: [ [ 0, 0, 250, 279, xWidth, yWidth ] ]
                };
            case 'pufflehandler':
                return {
                    south: [ [ 0, 0, 1000, 1202, xWidth, yWidth ] ]
                };
            case 'gary':
                return {
                    south: [ [ 0, 0, 250, 257, xWidth, yWidth ] ]
                };
            case 'herbert':
                return {
                    south: [ [ 34, 12, 301, 364, xWidth * 1.7, yWidth * 2 ] ]
                };
            case 'rookie':
                return {
                    south: [ [ 0, 0, 1000, 1127, xWidth, yWidth ] ]
                }
            // for general/player penguins
            default:
                // make slightly smaller since these sprites are naturally larger
                xWidth *= 0.9;
                yWidth *= 0.9;
                return {
                    north: [ [ 499, 24, 132, 115, xWidth, yWidth * 0.81 ] ],
                    northeast: [ [ 647, 24, 101, 132, xWidth * 0.77, yWidth *  0.93 ], [ 893, 189, 125, 122, xWidth * 0.95, yWidth * 0.865 ], [ 896, 338, 125, 121, xWidth * 0.95, yWidth * 0.85 ] ],
                    east: [ [ 771, 27, 80, 149, xWidth * 0.61, yWidth ], [ 537, 178, 80, 146, xWidth * 0.61, yWidth ], [ 533, 327, 80, 145, xWidth * 0.61, yWidth ] ],
                    southeast: [ [ 891, 27, 98, 132, xWidth * 0.75, yWidth * 0.93 ], [ 654, 182, 87, 142, xWidth * 0.66, yWidth ], [ 647, 337, 87, 142, xWidth * 0.66, yWidth ] ],
                    south: [ [ 7, 10, 131, 122, xWidth, yWidth * 0.865 ], [ 13, 168, 125, 126, xWidth * 0.95, yWidth *  0.89 ], [ 7, 320, 124, 125, xWidth * 0.94, yWidth * 0.89 ] ],
                    southwest: [ [ 161, 17, 98, 132, xWidth * 0.75, yWidth * 0.93 ], [ 165, 178, 87, 143, xWidth * 0.66, yWidth ], [ 147, 327, 126, 128, xWidth * 0.95, yWidth * 0.91 ] ],
                    west: [ [ 288, 20, 81, 150, xWidth * 0.61, yWidth * 1.1 ], [ 295, 172, 81, 146, xWidth * 0.61, yWidth ], [ 302, 320, 81, 145, xWidth * 0.61, yWidth ] ],
                    northwest: [ [ 392, 20, 101, 129, xWidth * 0.77, yWidth * 0.91 ], [ 395, 178, 125, 122, xWidth * 0.95, yWidth * 0.865 ], [ 392, 327, 125, 121, xWidth * 0.95, yWidth * 0.865 ] ],
                    episode: [ [ 1033, 189, 2167, 3001, 800, 1200 ] ]
                };
        }
    }

    /**
     * Setup direction of each sprite as array of sprites
     * @param { string } url path to spritesheet
     * @param { string } spriteName name of sprite
     */
    createSprites( url, spriteName ) {
        let directions = this.getSpriteLocation( spriteName );
        
        // scale penguin size
        let canvas = document.querySelector( 'canvas' );
        const dispScale = canvas.clientWidth / 2500 ;

        // loop through entries in directions
        for ( const [ key, val ] of Object.entries( directions ) ) {
            // set direction values by changing arrays of pixel locations to sprite objects
            this[ key ] = val.map( ( e ) => {
                

                // pass spread of array as parameter and scale dispSize
                if ( e.length === 4 ) {
                    return new Sprite( url, ...e, e[ 2 ] * dispScale, e[ 3 ] * dispScale );
                } else {
                    return new Sprite( url, e[ 0 ], e[ 1 ], e[ 2 ], e[ 3 ], e[ 4 ] * dispScale, e[ 5 ] * dispScale );
                }
            });
        }

        // if there are empty directions, set them to the south sprite(s)
        for ( const dir of [ 'north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest' ] ) {
            if ( !this[ dir ] ) this[ dir ] = this.south;
        }
    }
}