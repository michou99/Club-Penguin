import { StorySegment } from "./storySegment.js";

// class ot represent a episode-like segment of the sotry
export class EpisodeSegment extends StorySegment {
    leftPeng; // penguin on left
    rightPeng; // penguin on right
    beforeChoice; // array of dialogue before a choice
    choice; // object to represent a choice and its options
    currString; // current line of text that characters are being added to
    currLines; // lines already drawn out in dialogue
    currIndex; // index of current line adding characters to
    currDiag; // current dialogue displaying
    choicesBoxes; // array of coordinates that choices are in
    delay; // how much to delay in ms between dialogues
    charDelay; // how much to delay in ms between adding characters
    lastUpdate; // time dialogue was last updated

    /**
     * Create an EpisodeSegment
     * @param { string } id segment id
     * @param { Background } background background of segment
     * @param { Array } foreground any additional objects to include in foreground
     * @param { Player } leftPeng player object
     * @param { Penguin } rightPeng penguin player is talking to
     * @param { Array } beforeChoice dialogue before choice is presented, in the format of { talking: 'left'/'right'/'none', text: 'dialogue here', inventory: 'name of item, optional' }
     * @param { Object } choice user's choice to make in the same form as beforeChoice objects except inventory is replaced with choices, which is an array of objects with the format { text: 'choice text', next: 'segment choice should go to' }
     * @param { StorySegment } next optional, next story segment to go to, required if there is no choice
     */
    constructor ( id, background, foreground, leftPeng, rightPeng, beforeChoice, choice, next ) {
        super( id, background, foreground, next );

        // set up next placeholders
        this.defaultNext = this.next;
        this.next = null;

        // setup inputted options
        this.leftPeng = leftPeng;
        this.rightPeng = rightPeng;
        this.beforeChoice = beforeChoice;
        this.choice = choice;
        
        // setup dialogue vairables
        this.currString = '';
        this.currLines = [];
        this.currIndex = 0;
        this.currDiag = beforeChoice.shift() || this.choice;
        this.choicesBoxes = [];

        // setup time delays in the text
        this.delay = 2000; // delay between text in ms
        this.charDelay = 30;
        this.fontsize = 25;

    }

    /**
     * Draws the segment and returns next segment when done
     * @param {*} canvas canvas object
     * @param {*} context canvas's context
     * @returns StorySegment to go to next when segment is done
     */
    draw( canvas, context ) {

        // scale x and y positions with size of canvas
        const xScale = canvas.clientWidth / 1000;
        const yScale = canvas.clientHeight / 800;

        // initalize starting positions of episode if not done yet
        if ( !this.init ) this.initEpisode( xScale );

        // if segment isn't done or skipped
        if ( !this.next && !this.skip ) {
            // draw background and shade it
            this.background.draw( context );
            this.shadeBackground( canvas, context );

            // draw left and right penguin
            this.leftPeng.draw( canvas, context );
            this.rightPeng.draw( canvas, context );

            // add lines and lineInd field to currDiag if not already there
            if ( !this.currDiag.lines ) {
                this.currDiag.lines = this.splitText( context, 475 * xScale, this.currDiag.text, yScale );
                this.currDiag.linesInd = 0;
            }

            // draw all text
            this.drawText( canvas, context, xScale, yScale );

        // if segment is done or skipped, return the next segment
        } else {
            return this.next;
        }

        // if there is no before or choice, set to default next
        if ( this.beforeChoice.length === 0 && this.choice === null && !this.currDiag ) {
            this.next = this.defaultNext;
        }
    }

    /**
     * Setup episode
     */
    initEpisode( xScale ) {
        // change init status to true
        this.init = true;

        // set left and right penguin sprite to be the episode version
        this.leftPeng.episodeStyle();
        this.rightPeng.episodeStyle();

        // setting up time
        this.lastUpdate = Date.now();

        // scale font
        this.fontsize *= xScale;
    }

    /**
     * Shade background to make text more readable
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     */
    shadeBackground( canvas, context ) {
        // set settings for rectangle
        context.globalAlpha = 0.7;
        context.fillStyle = 'black';

        // draw rectangle to cover entire canvas
        context.fillRect( 0, 0, canvas.width, canvas.height );

        // reset alpha
        context.globalAlpha = 1;
    }

    /**
     * Update and draw text of current dialogue
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     * @param { number } xScale 1/1000th of the width of the canvas
     * @param { number } yScale 1/800th of the height of the canvas
     */
    drawText( canvas, context, xScale, yScale ) {
        // update current diag
        this.setCurrDiag( context, xScale, yScale );

        if ( this.currDiag ) {
            // update current string shown
            this.updateString();

            // draw name above box
            this.drawName( context, this.currDiag.talking, xScale, yScale );

            // draw background of text box
            this.drawTextBox( context, 250 * xScale, 500 * yScale, 475 * xScale, this.currDiag.lines, yScale );

            // fill in text
            this.fillText( context, xScale, yScale );

            // if there are choices to draw, draw them
            if ( this.currDiag.choices ) {
                this.drawChoices( canvas, context, xScale, yScale );
            }

            // if there is an inventory slot, add it to the user's inventory
            if ( this.currDiag.inventory ) {
                this.leftPeng.give( this.currDiag.inventory );
            }
        }
        
    }

    /**
     * Update the current dialogue to be shown
     * @param {*} context context of canvas
     * @param { number } xScale 1/1000th of the width of the canvas
     * @param { number } yScale 1/800th of the height of the canvas
     */
    setCurrDiag( context, xScale, yScale ) {
        // if at last line of dialog and delay has passed
        if ( this.exceedLineInd() && this.passDelay() && !this.onChoice() ) {
            // update lastUpdate and currDiag
            this.lastUpdate = Date.now();
            this.currDiag = this.beforeChoice.shift();

            // if currDiag is null but there is a choice left, set it as the currDiag
            if ( !this.currDiag && this.choice ) {
                this.currDiag = this.choice;
            }

            // if there is a current dialogue, setup lines and index
            if ( this.currDiag ) {
                // add lines and lineInd field to currDiag
                this.currDiag.lines = this.splitText( context, 475 * xScale, this.currDiag.text, yScale );
                this.currDiag.linesInd = 0;

                // reset currLines
                this.currLines = [];
                this.currIndex = 0;
            }
        }

        // if index is at end of string and it has been longer than delay
        else if ( !this.exceedLineInd() && this.exceedStrInd() && this.passCharDelay() ) {
            // there are more lines to animate and at end of this line, reset values
            this.currLines.push( this.currLine() );
            this.currString = '';
            this.currDiag.linesInd += 1;
            this.currIndex = 0;
        } 
            
    }

    /**
     * Update the characters to show
     */
    updateString() {
        // if there are chars left to show in string and charDelay has happened
        if ( !this.exceedLineInd() && !this.exceedStrInd() && this.passCharDelay() ) {
            // update lastUpdate and currIndex
            this.lastUpdate = Date.now();
            this.currIndex += 1;

            // add a character to the string
            this.currString = this.currLine().split('').slice( 0, this.currIndex ).reduce( ( str, word ) => str += word, '');

        }
    }

    /**
     * Draw a text box
     * @param {*} context context of canvas
     * @param { number } x position of text box
     * @param { number } y position of text box
     * @param { number } width of textbox
     * @param { Array } lines array of strings of dialogue that will be drawn on this text box
     * @param { number } xScale 1/1000th of the width of the canvas
     * @param { number } yScale 1/800th of the height of the canvas
     */
    drawTextBox( context, x, y, width, lines, yScale ) {
        let height = 40; // equal to 20 pt font plus padding

        // multiply height by number of lines
        height *= lines.length;

        // set current height if not a choice
        if ( lines === this.currDiag.lines ) {
            this.lastHeight = height;
        }

        // draw background of text box
        context.fillStyle = 'white';
        context.strokeStyle = 'gray';
        context.beginPath();
        context.roundRect( x, y, width, height * yScale, [ 5 ] );
        context.fill();
        context.stroke();
    }

    /**
     * Draw the name of the penguin talking
     * @param {*} context context of canvas
     * @param {*} talking 'left' or 'right' or 'none'
     * @param { number } xScale 1/1000th of the width of the canvas
     * @param { number } yScale 1/800th of the height of the canvas
     */
    drawName( context, talking, xScale, yScale ) {
        // setup variables
        context.fillStyle = 'white';
        context.strokeStyle = 'black';
        context.lineWidth = 0.5;
        context.font = `${this.fontsize}px sans-serif`;

        // vars for name and x position of name tag
        let name;
        let x;

        // setup name and position of name depending on who is talking
        if ( talking === 'none' ) {
            // if no one is talking, do not draw a name
            return;
        } else if ( talking === 'left' ) {
            name = this.leftPeng.name;
            x = 250;
        } else {
            name = this.rightPeng.name;
            x = 720 - context.measureText( name ).width;
        }

        // draw name and outline
        context.fillText( name, x * xScale, 490 * yScale );
        context.strokeText( name, x * xScale, 490 * yScale );

        // reset line width
        context.lineWidth = 1;
    }

    /**
     * Split text into wrapped lines
     * @param {*} context context of canvas
     * @param { number } width width of text box
     * @param { string } string text to split
     * @param { number } yScale 1/800th of the height of the canvas
     * @returns 
     */
    splitText( context, width, string, yScale ) {
        // split the string into words
        const words = string.split( ' ' );

        // setup variables for looping through words
        let currLine = '';
        let testLine = '';
        const lines = [];

        // do not take up full width of text box
        width *= 0.95;

        // loop through all words
        for ( let word of words ) {
            // attempt to add word to line and measure the width
            testLine += `${ word } `;
            context.font = `${this.fontsize}px sans-serif`;
            const currWidth = context.measureText( testLine ).width;

            // if new width is too big
            if ( currWidth > width ) {
                // append prev line to lines
                lines.push( currLine );

                // reset currLine and testLine
                currLine = `${word} `;
                testLine = `${word} `;
            
            // if line isn't too long, set currLine to testLine
            } else {
                currLine = testLine;
            }
        }

        // push current line segment
        lines.push( currLine );
        return lines;
    }

    /**
     * Fill in text on the text box
     * @param {*} context context of canvas
     * @param { number } xScale 1/1000th of the width of the canvas
     * @param { number } yScale 1/800th of the height of the canvas
     */
    fillText( context, xScale, yScale ) {
        // set text style
        context.font = `${this.fontsize}px sans-serif`;
        context.fillStyle = 'black';

        let i = 0;
        // loop through each row of dialogue
        while ( i < this.currLines.length ) {
            // set starting height of line based on i
            let y = 490 + 40 * ( i + 1 );

            // draw text
            context.fillText( this.currLines[ i ], 260 * xScale, y * yScale );

            i+=1;
        }
        
        // draw text of line that characters are currently being added to
        context.fillText( this.currString, 260 * xScale, 490 * yScale + 40 * ( i + 1 ) * yScale );
        
    }

    /**
     * Draw text box and text for choices
     * @param {*} canvas canvas object
     * @param {*} context context of canvas
     * @param { number } xScale 1/1000th of the width of the canvas
     * @param { number } yScale 1/800th of the height of the canvas
     */
    drawChoices( canvas, context, xScale, yScale ) {
        // set var to hold previous lines to check their height later
        this.prevLines = [];

        // loop through choices
        for ( let i in this.currDiag.choices ) {
            // setup common variables
            const xPos = 300 * xScale;
            const yPos = 510 * yScale + this.lastHeight * yScale + 45 * i * yScale * this.prevLines.length;
            const choice = this.currDiag.choices[ i ];
            const width = 370 * xScale;

            // wrap choice text by splitting it into lines
            let lines = this.splitText( context, width, choice.text, yScale );

            // draw text box for choice
            this.drawTextBox( context, xPos, yPos, width, lines, yScale );

            // draw text for choice
            this.fillChoices( context, lines, 30 * yScale + yPos, xScale, yScale );

            // add box of choice to boxes to check for clicks
            let box = { x: xPos, y: yPos, width, height: 40 * lines.length * yScale, next: choice.next };

            // only add box if it wasn't already added
            if ( this.choicesBoxes.filter( e => e.x === box.x && e.y === box.y && e.next === box.next ).length === 0 ) { 
                this.choicesBoxes.push( box ) 
            };

            // save lines for later reference
            this.prevLines = lines;
        }
    }

    /** 
     * Check if someone clicked within a choice box
     * @param { number } x position of click
     * @param { number } y position of click
     */
    click( x, y ) {

        // if on a choice
        if ( this.onChoice() ) {
            // loop through all hit boxes of choices
            for ( let box of this.choicesBoxes ) {
                // check if clicked within x or y of hitbox
                const inX = x >= box.x && x <= box.x + box.width;
                const inY = y >= box.y && y <= box.y + box.height;

                // set next if someone clicks a choice
                if ( inX && inY ) {
                    this.next = box.next;
                }
            }
        }
    }

    /**
     * Draw text for choices
     * @param {*} context context of canvas
     * @param { Array } text text of choice as an array of strings for wrapping
     * @param { number } y position to start writing text
     * @param { number } xScale 1/1000th of the width of the canvas
     * @param { number } yScale 1/800th of the height of the canvas
     */
    fillChoices( context, text, y, xScale, yScale ) {
        // set text style
        context.font = `${this.fontsize}px sans-serif`;
        context.fillStyle = 'black';

        // for each line of text, draw it
        for ( let i in text ) {
            // context.fillText( text[ i ], 260 * xScale, y + ( i * 40 * yScale ) );
            context.fillText( text[ i ], 310 * xScale, y + ( i * 40 * yScale ) );
        }

    }

    /**
     * bool if the line index exceeds the number of text lines
     */
    exceedLineInd() {
        return this.currDiag.linesInd >= this.currDiag.lines.length;
    }

    /**
     * bool if the string index exceeds the num of characters
     */
    exceedStrInd() {
        return this.currIndex >= this.currLine().length;
    }

    /**
     * get current line parsing
     */
    currLine() {
        return this.currDiag.lines[ this.currDiag.linesInd ];
    }

    /** 
     * time more than charDelay has passed
     */
    passCharDelay() {
        return Date.now() - this.lastUpdate > this.charDelay;
    }

    /**
     * time more than delay has passed
     */
    passDelay() {
        return Date.now() - this.lastUpdate > this.delay;
    }

    /** 
     * current dialog is a choice
     */
    onChoice() {
        return this.currDiag === this.choice;
    }
}