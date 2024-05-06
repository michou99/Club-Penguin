import { Background } from "./background.js";
import { StorySegment } from "./storySegment.js";

// class for a story segment that explains the mission
export class MissionSegment extends StorySegment {
    name; // name of mission
    text; // array of text to display about mission
    currString; // current string adding characters to
    currIndex; // index of last char drawn
    currTextInd; // index of line being drawn from text
    currText; // current text displayed
    charDelay; // how long to delay between chars in ms
    delay; // how long to delay between lines in ms

    /**
     * Create a MissionSegment
     * @param { string } id id of segment
     * @param { Background } background background of mission start
     * @param { string } name name of mission
     * @param { Array<String> } text array of strings to display
     * @param { StorySegment } next story segment to move onto next
     */
    constructor(id, background, name, text, next ) {
        super( id, background, [], next );

        // setup basic variables
        this.name = name;
        this.text = text;

        // setup delays
        this.charDelay = 30;
        this.delay = 2000;
        this.lastUpdate = Date.now();

        // setup starting displays
        this.currString = '';
        this.currIndex = 0;
        this.currText = [];
        this.currTextInd = 0;
    }

    /**
     * Draw a MissionSegment
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     * @returns next StorySegment when it finishes
     */
    draw( canvas, context ) {

        // if not all text is shown, update
        if ( this.currText != this.text ) {
            this.updateString();
        }

        // draw background and shade it
        this.background.draw( context );
        this.shadeBackground( canvas, context );

        // draw text
        this.drawText( canvas, context );

        // if all text is displayed, reset text align and return next segment
        if ( this.currText.length === this.text.length && this.passDelay() || this.skip ) {
            context.textAlign = 'left';
            return this.next;
        }
    }

    /**
     * Add character to currString or add line to currText
     */
    updateString() {
        // if there are chars left to show in string and charDelay has happened
        if ( !this.exceedTextInd() && !this.exceedStrInd() && this.passCharDelay() ) {
            // update lastUpdate and currIndex
            this.lastUpdate = Date.now();
            this.currIndex += 1;

            // add a character to the string
            this.currString = this.currLine().split('').slice( 0, this.currIndex ).reduce( ( str, word ) => str += word, '');

        // if at end of string and need to reset
        } else if ( !this.exceedTextInd() && this.exceedStrInd() && this.passDelay() ) {
            this.currText.push( this.currString );
            this.currIndex = 0;
            this.currTextInd += 1;
            this.currString = '';
        }
    }

    /**
     * Draw all text
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     */
    drawText( canvas, context ) {
        // set header details and draw it
        context.font = '40px serif'
        context.fillStyle = 'white';
        context.textAlign = 'center';

        // draw the name of the mission
        context.fillText( this.name, canvas.clientWidth / 2, canvas.clientHeight * 1 / 8 );

        // set body details
        context.font = '20px sans-serif'

        // create an array of the text to show
        const arr = [...this.currText]
        arr.push( this.currString );

        // display all of the text
        for ( let i in arr ) {
            // text at index
            const t = arr[ i ]

            // draw text
            context.fillText( t, canvas.clientWidth / 2, canvas.clientHeight / 4 + 35 * i );
        }
    }

    /**
     * Add black shade over background
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     */
    shadeBackground( canvas, context ) {
        // setup alpha and color of shade
        context.globalAlpha = 0.8;
        context.fillStyle = 'black';

        // draw shade
        context.fillRect( 0, 0, canvas.width, canvas.height );

        // reset alpha
        context.globalAlpha = 1;
    }

    /**
     * Checks if above length of text array
     * @returns true if index is beyond text length
     */
    exceedTextInd() {
        return this.currTextInd > this.text.length;
    }

    /**
     * Above length of string
     * @returns true if index is beyond length of string
     */
    exceedStrInd() {
        return this.currIndex > this.currString.length;
    }

    /**
     * Gets current line between added to currString
     * @returns string of current line
     */
    currLine() {
        return this.text[ this.currTextInd ];
    }

    /**
     * Checks if charDelay time has passed
     * @returns true if charDelay has passed
     */
    passCharDelay() {
        return Date.now() - this.lastUpdate > this.charDelay;
    }

    /**
     * Checks if delay time has passed
     * @returns true if delay has passed
     */
    passDelay() {
        return Date.now() - this.lastUpdate > this.delay;
    }
}