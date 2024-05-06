# Club Penguin

Club Penguin was a massively multiplayer online game, dominating the viritual world from 2005 all the way to 2017. Our 
team has set out on a mission to revive the spirit of Club Penguin with our own take: Club Penguin Remastered. 
Club Penguin Remastered is a text-based adventure game that pulls inspiration from the original franchise.

This game allows users to create accounts to immerse themselves into the world of Remastered. They are met with NPCs
(Non-Playable Characters) throughout the game play, choosing their own responses which then has the potential to 
shape what occurs next in the storyline. 

### Setting Up:

To play the game start by cloning the repo to your computer. Once you have cloned the repo change directory into the repo and run the following command in your terminal.

```
npm install

```
Once you have installed all dependencies change directory into the backend folder and run the following commands

```
npm run seed
npm run start

```

Open the repo in Visual Studio Code and go to extensions. Install the live server extention if you do not already have it. Navigate to the index.html file which is located in the frontend/html folder. Right click on the file and select "Open with Live Server"

From there you can create a penguin and log in to being game play. Enjoy!

## Frontend

### Technologies Used:
* Javascript
* Canvas
* HTML
* CSS

### Start Page:
The start page at index.html allows the user to create an account and login into any existing accounts. 
Using vanilla JS and CSS, the start up page was created to mimic the look of the original Club Penguin. The 
"Create a Penguin" button prompts a modal that allows users to choose their penguin color, create a username
and email, and input their password. There is validation to ensure emails are inputted in expected syntax and 
usernames are capped at 6 characters to ensure cleaner UI during gameplay. 

The UI displays errors to the user when the password inputs fail to match. The username and email is sent to the 
backend to ensure these fields are unique in order to avoid user overlaps and errors. 

The login button opens a modal that verifies if the user exists. If the user does not exist in the database or 
if the password inputted by the user does not match that of the database, the UI presents an error. 

Once successfully logged in, the username, penguin color, inventory, and user id are stored in localStorage. 

### Logout:
During gameplay, users can click the logout button which saves their progress in the game. This button also 
triggers the deletion of localStorage elements to prevent information from carrying over thus preventing errors. 

### Canvas and Classes
The game is displayed on the Canvas with the help of multiple classes. There is a class for each type of object that would be displayed: DisplayObj ( for general items ), Penguin, Player, Background, and Inventory ( shown at the bottom of the screen ). All of these classes have a draw function that can be called throughout the story to actually draw the object on the canvas in the specified x and y position and display height and width. The image displayed is controlled through the SpriteSet ( for penguins and player ) or Sprite ( all other classes ). SpriteSet holds the frame for each part of the walking animation for all 8 directions the player could walk. It also has the episode-style sprite for each penguin. 

## StorySegments and the Child Classes of it
The actual story shown is displayed through StorySegments. There are four child classes of it: MissionSegment ( for the starting page ), MoveSegment ( when the player is automatically moving ), MissionSegment ( when the player is talking to someone ), and ClosingSegment ( for the final page ). These segments call a init function when they are first drawn to ensure that all elements are in the correct position and starting variables are set. Then, the draw function is continuously called on that Segment until it finishes. The draw function calls the draw function of all other elements within it. Finally, when the segment finishes, the next segment to move to is returned, allowing the segment to be switched out in game.js. The audio played throughout the game is switched based on the background of the segment showing.

## Backend

### Technologies Used:
- Javascript
- MongoDB
- Mongoose

## Implementation:
For the backend of this application, we implemented a MongoDB database and queried it using Mongoose in order for us to pull the neccessary data with different CRUD applications as needed. Our database was named `clubPenguinDB` and it would be created if needed upon connection with the backend. We seeded our Inventory collection with pre-set data which was referenced within our User collection so that each user's inventory would correlate with the items they pickup during their game play. A crucial responsibility of our backend was housing the storySegId which would allow for the user to logout and save their spot in the game so that they can resume at the same spot upon logging back in. This id was used in conjunction with the episode segment id which aided in keeping track of which chapter the user was currently playing. 

### Issues:
One issue that we faced on the backend having the email and username fields be unique across the entire collection since we did not want users to be able to sign up with duplicate information. We initially looked into having it setup within the mongosh shell and it had worked, however, upon further inspection, this method would require users to run `createIndex()` in their own mongosh shell which we thought would not be user friendly. To overcome this issue, we looked into using the `syncIndexes()` function that mongoose has to offer which would ensure that the indexes within the MongoDB collection match with the indexes defined in our model's schema. This allowed for us to set the `unique` keyword to true and the database would show error if any duplicate emails or usernames were attempting to be posted. 


## Bugs
Bugs that are currently known
* Refreshing the page during game play will occasionally reload at the wrong story segment and break the inventory functionality if the player has gotten inventory since logging in. 
* Once game has ended, inventory will not reset if you begin a new game.


## Credits
NPC and Background Sprites: [Club Penguin Rewritten wiki](https://clubpenguinrewritten.fandom.com/wiki/Club_Penguin_Rewritten_Wiki)

Player Sprites: Created by iChibi

Music: [Archive.org](https://archive.org/details/club-penguin-music)



