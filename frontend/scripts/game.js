//imports
import { needsResizing, allEpisodes } from "../scripts/episode.js"
import { getPlayerData } from "../scripts/episode.js"

// setup starter variables
let canvas;
let context;
let audio;
let userID = JSON.parse(localStorage.getItem('player')).username;

// onload, initalize canvas
window.onload = async () => {
    // wait for player data to be received in order to place in index for allEpisodes
    let playerInfo = await getPlayerData(userID); 


    // get the episode with the correct id
    let currSegment = allEpisodes.filter( e => e.id === playerInfo.storySegId)[ 0 ];

    // setup canvas 
    canvas = document.getElementById('game-canvas');
    context = canvas.getContext('2d');

    // scale canvas
    scaleCanvas();

    // resize backgrounds to take up full width and height of canvas
    needsResizing.forEach(b => {
        b.width = canvas.clientWidth;
        b.height = canvas.clientHeight;
    })

    // add event listener for clicking on canvas for choices
    canvas.addEventListener('mousedown', e => sendClick(canvas, e, currSegment));

    // add event listener to skip segements when pressing r
    document.addEventListener('keydown', (e) => {
        if (e.key === 'r') {
            currSegment.skipSeg();
        // reset game if press q
        } else if ( e.key === 'q' ) {
            updateStoryId( userID, allEpisodes[ 0 ] );
            window.location.href = '';
        }
    })

    // start animation
    init(currSegment);
}

// initalize drawing
function init(currSegment) {

    // draw first frame
    window.requestAnimationFrame(() => draw(currSegment));
}


// scale canvas based on dpi
function scaleCanvas() {

    // increase the size of canvas based on dpi
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    // scale drawings based on dpi
    context.scale(devicePixelRatio, devicePixelRatio);

    // reset canvas width and height in css
    canvas.style.width = canvas.clientWidth + 'px';
    canvas.style.height = canvas.clientHeight + 'px';

}

// update storySegId in backend 
function updateStoryId (username, currSegment) {
    let storyId = currSegment.id;
    return fetch(`http://localhost:3000/user/${username}`, {
        method: "PUT",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ // post values from above into json object in body
            storySegId: storyId
        })
    })
        .then(res => {
            res.json()
        })
        .catch(err => new Error('Failed to update StoryID'))
}

// draw the current segment
function draw(currSegment) {
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    let done = currSegment.draw(canvas, context);

    // if there is no music, play 
    if ( !audio ) playMusic( currSegment.background );

    // if currSegment returns another segment, set it as currSegment
    if (done) {
        // set new segment
        currSegment = done;

        // set music if a new area
        playMusic( currSegment.background );

        // remove initial event listener because it was capturing currSegment value only at onload
        canvas.removeEventListener('mousedown', e => sendClick(canvas, e, currSegment))

        // reinstate it to now have the event happening with the new currSegment values as the story progresses
        canvas.addEventListener('mousedown', e => sendClick(canvas, e, currSegment));

        // make function that takes in new currseg id bc we will send this new currseg to the backend to record
        updateStoryId(userID, currSegment)
    }

    // only continue animation if not done
    if (done != 'done') {
        // animate
        window.requestAnimationFrame(() => draw(currSegment));
    }

}

// initiate click event on current segment
function sendClick(canvas, event, currSegment) {

    // get x and y of click on the canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    // call click function in backend
    currSegment.click(x, y);
}

// play music
function playMusic( background ) {
    let newAudio;

    // switch audio url
    switch ( background.sprite.img.src ) {
        case 'http://127.0.0.1:5500/frontend/images/Coffee_Shop.webp':
            newAudio = new Audio( '../audio/coffee.mp3' );
            break;
        case 'http://127.0.0.1:5500/frontend/images/Pizza_Parlor.webp':
            newAudio = new Audio( '../audio/pizza.mp3' );
            break;
        default:
            newAudio = new Audio( '../audio/mission.mp3' );
            break;
    }

    // if there is no audio or audio is different
    if ( !audio || newAudio.src != audio.src ) { 
        // if there is audio, pause it
        if ( audio ) audio.pause();

        // set new audio and play it
        audio = newAudio; 
        audio.volume = 0.05;
        audio.play();
    };
}

//Get elements by ID
let logoutbtn = document.getElementById("logoutbtn");

//Handlers
logoutbtn.addEventListener("click", () => {
    logoutHandler();
})


//Logout button function
function logoutHandler() {
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('penguinColor');
    localStorage.removeItem('inventory')
    location.href = "../html/index.html";
}
