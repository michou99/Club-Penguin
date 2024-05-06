import { MissionSegment } from "./missionSegment.js";

// class for closing message after finishing game
export class ClosingSegment extends MissionSegment  {
    
    /**
     * @param { string } id id of segment
     * @param { Background } background background object
     * @param { Array<String> } text array of text to display on screen
     */
    constructor(id, background, text) {
        super( id, background, 'Congratulations!', text, true );
    }

    /**
     * Draws the mission segment and returns next when done
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     * @returns next StorySegment when it is done
     */
    draw( canvas, context ) {
        let done = super.draw( canvas, context );

        // return when done
        if ( done ) return 'done';
    }
}