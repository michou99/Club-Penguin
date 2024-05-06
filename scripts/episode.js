//imports
import { Player } from '../classes/player.js';
import { InventoryObj } from '../classes/inventoryObj.js';
import { Background } from '../classes/background.js';
import { Penguin } from '../classes/penguin.js';
import { MoveSegment } from '../classes/moveSegment.js';
import { EpisodeSegment } from '../classes/episodeSegment.js';
import { MissionSegment } from '../classes/missionSegment.js';
import { ClosingSegment } from '../classes/closingSegment.js';
import { DisplayObj } from '../classes/displayObj.js';

//variables going into local storage
let playerData = JSON.parse(localStorage.getItem('player'));
let userID = playerData.username;
let color = playerData.penguinColor;
let inventory = playerData.inventory;


// make inventory array of inventory objects
inventory != '' ? inventory = inventory.map(i => new InventoryObj(i.itemName)) : inventory = undefined;

//select canvas element
let canvas = document.getElementById('game-canvas');

//get user data
async function getUser(username) {
    try {
        const res = await fetch(`http://localhost:3000/user/${username}`);
        let uData = await res.json();
        return uData
    } catch (err) {
        return new Error('Failed to get user');
    }
}
// pull player data from backend with player id
async function getPlayerData(userID) {
    try {
        const userData = await getUser(userID)
        localStorage.setItem( 'player', JSON.stringify(userData))
        return userData
    } catch (err) {
        return new Error('Failed to get player data');
    }
}

// player and background variables
const player = new Player(color, 300, 400, userID, inventory);
const aunt = new Penguin('auntarctic', 300, 400, 'Aunt Arctic');
const petWorker = new Penguin('petworker', 450, 500, 'Pet Worker')
const pizzaWaiter = new Penguin('waiter', 600, 400, 'Waiter')
const pizzaWorker = new Penguin('pizzaworker', 150, 300, 'Pizza Worker')
const bystander = new Penguin('bystander', 300, 400, 'Bystander' )
const agent = new Penguin('agent', 500, 400, 'Agent' );
const dojo = new Penguin( 'dojo', 400, 500, 'Sensei' );
const cadence = new Penguin( 'cadence', 300, 260, 'Cadence' )
const pufflehandler = new Penguin( 'pufflehandler', 870, 350, 'Puffle Handler')
const gary = new Penguin( 'gary', 470, 500, 'Gary' )
const rookie = new Penguin('rookie', 800, 500, 'Rookie' )
const herbert = new Penguin('herbert', 750, 300, 'herbert' );
const plaza = new Background('../sprites/plaza.png', canvas.width, canvas.height)
const pizza = new Background('../images/Pizza_Parlor.webp', canvas.width, canvas.height)
const petShop = new Background('../images/Pet_Shop.webp', canvas.width, canvas.height)
const cafe = new Background("../images/Coffee_Shop.webp", canvas.width, canvas.height)
const town = new Background("../images/Town_Stadium.webp", canvas.width, canvas.height)
const puffletreats = new DisplayObj( 280, 500, '../sprites/puffle-treats.png', 0, 0, 250, 341, 20, 25 );
const pinkpuffle = new DisplayObj( 140, 620, '../sprites/pink-puffle.png', 6, 6, 238, 207, 40, 34 );
const redpuffle = new DisplayObj( 50, 610, '../sprites/red-puffle.png', 0, 0, 1965, 1743, 40, 34 );
const greenpuffle = new DisplayObj( 90, 630, '../sprites/green-puffle.png', 0, 0, 1592, 1529, 40, 34 );

//resizing images for canvas
export let needsResizing = [plaza, pizza, petShop, cafe, town];

// create episode segment
let close = new ClosingSegment(24, town, ['You have finished the game!', 'Press Q or make a new character to play again.','', '', '','Created by: Anika Momin, Erin Lincoln, Michelle Akl, and Teresa Nguyen', 'CODA 11']);

// talk to agent
let ep26 = new EpisodeSegment(26, town, [], player, agent, [ {talking: 'right', text: 'Great job, Agent. We knew we could always count on you.'}, {talking: 'right', text: 'Here is something to mark your success.'}, {talking: 'none', text: '* You receive a Medal of Achievement! *', inventory: 'medal'}], null, close );
let move25 = new MoveSegment(25, { x: 350, y: 350 }, { x: 400, y: 400 }, town, [ player, agent, rookie ], ep26);
let move24 = new MoveSegment( 24, { x: 380, y: 410 }, { x: 480, y: 250 }, cafe, [ player, aunt, cadence ], move25);

// give penguin to aunt arctic
let ep23 = new EpisodeSegment(23, cafe, [], player, aunt, [ {talking: 'none', text: '* You give the puffle to Aunt Arctic. *'}, {talking: 'left', text: 'Here she is - safe and sound!'}, {talking: 'right', text : "Thank you so much Agent! I am so glad to have her back. Here is something for your troubles." }, {talking: 'none', text: '* You receive an autograph from Aunt Arctic *', inventory: 'autograph'}, {talking: 'left', text: 'No sweat - let us know if you ever need help again!'}], null, move24)

// talk to pet shop owner
let move22 = new MoveSegment(22, { x: 480, y: 250 }, { x: 380, y: 410 }, cafe, [ player, aunt, cadence ], ep23)
let move21post = new MoveSegment(41, { x: 380, y: 500 }, { x: 450, y: 300 }, petShop, [ redpuffle, greenpuffle, petWorker, herbert, pufflehandler, player ], move22)
let ep21 = new EpisodeSegment(21, petShop, [], player, petWorker,[{talking: 'none', text: '* You found the pink puffle! *'}, {talking: 'left', text : "This is her!"}], {talking: 'Right', text: "Ah yes! She just came in today. She saw me handing out treats outside earlier and couldn't get enough of them. Glad you found her!", choices: [ { text: "Thank you!", next: move21post }]} )
let move21pre = new MoveSegment( 40, { x: 200, y: 600 }, {x: 380, y: 500 }, petShop, [ redpuffle, greenpuffle, petWorker, herbert, pufflehandler, player ], ep21)
let move20half = new MoveSegment( 40, {x: 400, y: 450 }, { x: 200, y: 600 }, petShop, [ redpuffle, greenpuffle, pinkpuffle, petWorker, herbert, pufflehandler, player ], move21pre)
let ep20half = new EpisodeSegment(21, petShop, [], player, petWorker,[{talking: 'right', text : "Well, we get a lot of strays in here. We usually keep them all over there - feel free to take a look."}], null, move20half )
let ep20 = new EpisodeSegment(20, petShop, [], player, petWorker, [], {talking: 'right', text: "Hi there, how can I help you?", choices: [{text: "I am looking for a missing pink puffle that was lost in the town earlier.", next: ep20half}, {text: "I am trying to find a lost puffle.", next: ep20half}]})
let move19half = new MoveSegment(39, { x: 450, y: 300 }, { x: 450, y: 400 }, petShop, [ petWorker, herbert, pufflehandler, player ], ep20)


// talk to bystander
let move19 = new MoveSegment(19, { x: 350, y: 500 }, { x: 200, y: 400 }, plaza, [ bystander, player ], move19half)
let ep18 = new EpisodeSegment(18, plaza, [], player, bystander, [], {talking: 'right', text: "Some people think they are tasty, but they are actually puffle treats they came from the pet shop.", choices: [{text:"Thanks for the information.", next: move19}, {text:"Good to know that there are weirdos out there, thanks.", next: move19}]})
let ep17 = new EpisodeSegment(17, plaza, [], player, bystander,[], {talking: 'right', text: "They are puffle treats. There was a pet shop worker handing them out earlier.", choices: [{text:"Thanks for the information.", next: move19}, {text:"Good to know that there are weirdos out there, thanks.", next: move19}]})
let ep16 = new EpisodeSegment(16, plaza, [], player, bystander, [{ talking: 'none', text: '* You picked up a mysterious object. *', inventory: 'puffle-treats'}], {talking: 'right', text: "I wouldn't eat those if I were you.", choices: [{text: "Why not?", next: ep17},{text: "What makes you think I was going to eat them?", next: ep18}]})
let move15 = new MoveSegment(15, { x: 730, y: 390 } , { x: 350, y: 500 }, plaza, [ player, bystander, puffletreats ], ep16 )

// talk to waiter - no garlic bread
let move14half = new MoveSegment(6,  { x: 540, y: 400 }, { x: 540, y: 300 }, pizza, [ player, pizzaWaiter, pizzaWorker ], move15)
let ep14 = new EpisodeSegment(14, pizza,[], player, pizzaWaiter, [], {talking : 'right', text: "He did tell me that a puffle followed him back here because she liked the garlic bread so much. I haven't heard anything else.", choices: [{text: "Thank you for your help!", next: move14half}, {text: "Okay thanks! I will go have a look around outside then.", next: move14half }]})

// talk to pizza worker
let ep13 = new EpisodeSegment(13, pizza, [], player, pizzaWorker, [{talking: 'right', text: "Good luck!"}], null, move19) 
let ep12 = new EpisodeSegment(12, pizza, [], player, pizzaWorker, [{talking: 'right', text: "Hmm, maybe try the pet shop."}], null, move19) 
let ep11 = new EpisodeSegment(11, pizza, [], player, pizzaWorker, [{talking: 'right', text:"Oh yeah I saw her near Aunt Arctic earlier! Didn't know if she was a stray or not but she sure liked the smell of the garlic bread!"}, {talking: 'right', text: "She started following me when I was heading back here, but when I looked back she was gone. I did find these little puffle treats on the ground."}, {talking: 'none', text: '* You receive puffle treats from the worker *', inventory: 'puffle-treats'}], {talking: 'right', text: "Maybe you'll find them useful.", choices: [{text: "Thanks, do you know where these could have came from?", next: ep12}, {text:"Great, I think these are from the pet shop.", next: ep13}]})
let ep10 = new EpisodeSegment(10, pizza, [], player, pizzaWorker, [], {talking: 'right', text: "Hey, how can I help you?", choices: [{text:"I heard you were in town earlier and I am trying to find a lost pink puffle that was there.", next: ep11}, {text:"Did you happen to see a pink puffle in town earlier while you were working?", next: ep11}]})

// talk to waiter
let move9half = new MoveSegment(38, { x: 540, y: 400 }, { x: 220, y: 350 }, pizza, [ player, pizzaWaiter, pizzaWorker ], ep10)
let ep9 = new EpisodeSegment(9, pizza, [], player, pizzaWaiter, [{talking: 'right', text: "Yes - of course. He is right over there."}], null, move9half )
let ep8 = new EpisodeSegment(8, pizza, [], player, pizzaWaiter, [{talking: 'none', text: '* You receive garlic bread from the waiter *', inventory: 'garlic-bread'}], {talking: 'right', text: "Hope you like it! They have been a hit. Is there anything else I can help you with?", choices: [{text: "Is there any way I could speak to the worker who was in town today?", next: ep9}]} )
let ep7 = new EpisodeSegment(7, pizza, [], player, pizzaWaiter, [{talking: "left", text: "Hello, I am looking for a missing puffle and found this flyer of yours in the town."}, { talking: 'right', text: "Ah yes, one of our workers was there earlier handing out samples of our new garlic bread."}], {talking: 'right', text: "In fact, I have some right here - would you like to try one?", choices: [{text: "Sure!", next: ep8}, {text: "No thanks - I am on an important mission. Did your employee see anything strange?", next: ep14}]})
let move6 = new MoveSegment(6, { x: 540, y: 300 } , { x: 540, y: 400 }, pizza, [ player, pizzaWaiter, pizzaWorker ], ep7)


// move locations
let move5half2 = new MoveSegment(37, { x: 650, y: 450 }, { x: 730, y: 390 }, plaza, [ player ], move6)
let move5half = new MoveSegment(36, { x: 200, y: 450 }, { x: 650, y: 450 }, plaza, [ player ], move5half2)
let move5 = new MoveSegment(5, { x: 0, y: 350 } , { x: 200, y: 450 }, plaza, [ player ], move5half)
let move4half3 = new MoveSegment( 35, { x: 550, y: 500 }, { x: 880, y: 500 }, town, [ player, dojo, gary ], move5 )
let move4half2 = new MoveSegment( 34, { x: 350, y: 350 }, { x: 550, y: 470 }, town, [ player, dojo, gary ], move4half3 )
let move4half = new MoveSegment( 33, { x: 380, y: 410 }, { x: 480, y: 250 }, cafe, [ player, aunt, cadence ], move4half2 );

// talk to aunt 
let ep4 = new EpisodeSegment(4, cafe, [], player, aunt, [{talking: 'right', text: "The only thing I saw was this crumpled up flyer from the pizza shop."}, {talking: 'none', text: '* You receive a flyer from Aunt Arctic *', inventory: 'flyer'}, {talking: 'left', text: "Don't worry - I will be sure to find your puffle for you!"}], null, move4half) 
let ep3 = new EpisodeSegment(3, cafe, [], player, aunt, [], {talking: "right", text: "I was walking my puffle in the town when a fan came up to me for an autograph. I look away for one minute and then the next thing I know she is gone!", choices: [{text: "Strange, anything else you can tell me?", next: ep4}, {text: "Were there any clues?", next: ep4}]})
let ep2 = new EpisodeSegment(2, cafe, [], player, aunt, [], {talking: "right", text: "Agent, thank goodness you are here. My pink puffle has gone missing and I was told you can help me.", choices: [{text: "Yes I would love to help, how did this happen?", next: ep3}, {text: "Sure, can you tell me what happened?", next : ep3}]})
let move1half = new MoveSegment( 1, { x: 480, y: 250 }, { x: 380, y: 410 }, cafe, [ player, aunt, cadence ], ep2)

// talk to agent
let move1 = new MoveSegment(32, { x: 480, y: 470 } , { x: 350, y: 350 }, town, [ player, agent ], move1half)
let epneg1 = new EpisodeSegment( 31, town, [], player, agent, [ { talking: 'right', text: "Good to see you made it. We have a new mission for you." }, { talking: 'right', text: "Aunt Arctic's puffle has gone missing and she needs your help. To start your mission, head to the coffee shop to speak with her." }, { talking: 'right', text: "Good luck and don't let us down."}], null, move1 )
let moveneg2 = new MoveSegment( 30, { x: 300, y: 800 }, { x: 480, y: 470 }, town, [ player, agent ], epneg1 );
let missionsSeg = new MissionSegment( 0, town, 'Mission 1', [ "You have been recruited by a familiar face to solve an important mission.", "Talk to the agent for details."], moveneg2 );

//array of segment variables
export let allEpisodes = [missionsSeg, moveneg2, epneg1, move1, move1half, ep2, ep3, ep4, move4half,move4half2,  move4half3, move5, move5half, move5half2, move6, ep7, ep8, ep9, move9half, ep10, ep11, ep12, ep13, ep14, move15, ep16, ep17, ep18, move19, move19half, ep20, move20half, move21pre, ep21, move21post, move22, ep23, move24, move25, ep26, close]
export { getPlayerData }
