// game.js for Perlenspiel 3.2

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-15 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.

Perlenspiel uses dygraphs (Copyright © 2009 by Dan Vanderkam) under the MIT License for data visualization.
See dygraphs License.txt, <http://dygraphs.com> and <http://opensource.org/licenses/MIT> for more information.
*/

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// GAME: GHASTLY GARDEN
// Define garden for level-constructing

var garden, character;

( function () {
	// The following variables are for setting of the garden
	garden = {
		width : [10, 10], // width of garden for individual levels
		height : [10, 10], // height of garden for individual levels
		
		currentLevel : 0, // current level
		maxLevel : 1, // number of levels available for the game
		
		wallColor : 0x778779, // color for wall of garden
		floorColor : 0x3D3D3D, // color for floor of garden
		ghostColor : 0xCFCCCB, // color for ghost
		playerColor : 0xAB5341, // color for player
		
		// The following variables are for location of
		// walls and floors according to each level.
		levelWallX : 
			[[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 3, 0, 2, 3, 5, 7, 9, 0, 2, 5, 7, 8, 9, 0, 2, 5, 9, 0, 2, 4, 5, 6, 7, 9, 0, 4, 9, 0, 2, 3, 4, 5, 6, 7, 8, 9, 0, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			 [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 9, 0, 4, 5, 9, 0, 2, 5, 9, 0, 2, 7, 9, 0, 7, 0, 2, 3, 7, 9, 0, 3, 9, 0, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
		levelWallY : 
			[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
			 [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]],
		
		// The following variables are for location of
		// players according to each level
		levelPlayerX : [4, 1],
		levelPlayerY : [4, 4],
		
		// The following variables are for location of
		// ghost according to each level
		levelGhostX : [8, 4],
		levelGhostY : [2, 8],
		
		// setup(level)
		// Attempt to set up garden relative to level	
		setup: function (level) {
			var i;
			
			// Set up dimesion of level
			PS.gridSize( garden.width[level], garden.height[level] );
			PS.gridColor( garden.floorColor );
			PS.color( PS.ALL, PS.ALL, garden.floorColor );
			PS.border( PS.ALL, PS.ALL, 0 );
			
			// Indicate Level
			PS.statusColor(PS.COLOR_WHITE);
			PS.statusText("Level: " + (level+1).toString());
					
			// Set up walls
			for (i = 0; i < garden.levelWallX[level].length; i++){
				PS.color(garden.levelWallX[level][i], garden.levelWallY[level][i], garden.wallColor);
			};
	
			// Place player at initial position
			PS.color(garden.levelPlayerX[level], garden.levelPlayerY[level], garden.playerColor);
			PS.radius(garden.levelPlayerX[level], garden.levelPlayerY[level], 50)
	
			// Place ghost at initial position
			PS.color(garden.levelGhostX[level], garden.levelGhostY[level], garden.ghostColor);
			PS.radius(garden.levelGhostX[level], garden.levelGhostY[level], 50);
			
			// Save level
			garden.currentLevel = level;
		}
	};
	
	// The following variable are for actions of characters, player and ghost
	character = {
		// move(x, y)
		// Attempt to move character relative to current position
		move : function (x, y) {
			var nx, ny;
			
			nx = garden.levelPlayerX[garden.currentLevel] + x;
			ny = garden.levelPlayerY[garden.currentLevel] + y;
			
			// Restrain character from going off the grid
			if ((nx < 0) || (nx >= garden.width[garden.currentLevel]) || (ny < 0) || (ny >= garden.height[garden.currentLevel])) {
				return;
			};
			
			// Restrain character from moving over wall
			if (PS.color(nx, ny) == garden.wallColor){
				return;
			};
			
			// Legal move, proceed to new location
			PS.color(nx, ny, garden.playerColor);
			PS.radius(nx, ny, 50);
			PS.color(garden.levelPlayerX[garden.currentLevel], garden.levelPlayerY[garden.currentLevel], garden.floorColor);
			PS.radius(garden.levelPlayerX[garden.currentLevel], garden.levelPlayerY[garden.currentLevel], 0);
			
			// Update location
			garden.levelPlayerX[garden.currentLevel] = nx;
			garden.levelPlayerY[garden.currentLevel] = ny;
			
			// Check whether the player escapes
			if ((nx == garden.width[garden.currentLevel] - 1) || (ny == garden.height[garden.currentLevel] - 1)) {
				if (garden.currentLevel == garden.maxLevel){
					PS.statusText("You win!");
				} else {
					garden.currentLevel++;
					garden.setup(garden.currentLevel);
				}
			}
		},
		
		ghostWalk : function (x, y) {
			var nx, ny, dirX, dirY, count;
			
			// Initialize proposed direction for ghost
			dirX = 0;
			dirY = 0;
			
			// Compare with the location of player
			
			// x-axis related
			if (garden.levelPlayerX[garden.currentLevel] < garden.levelGhostX[garden.currentLevel]){         // If player is on the left of the ghost
				dirX = -1;
			} else if (garden.levelPlayerX[garden.currentLevel] > garden.levelGhostX[garden.currentLevel]) { // If player is on the right of the ghost
				dirX = 1;
			};
				
			// y-axis related
			if (garden.levelPlayerY[garden.currentLevel] < garden.levelGhostY[garden.currentLevel]){         // If player is above the ghost
				dirY = -1;
			} else if (garden.levelPlayerY[garden.currentLevel] > garden.levelGhostY[garden.currentLevel]) { // If player is below the ghost
				dirY = 1;
			};
			
			// Set initial location for ghost
			nx = garden.levelGhostX[garden.currentLevel];
			ny = garden.levelGhostY[garden.currentLevel];
			
			// Find direction to turn for ghost
			if (!(x==0)) {         // If the player goes along x-axis
				if (PS.color(nx + dirX, ny) == garden.floorColor){
					nx = garden.levelGhostX[garden.currentLevel] + dirX;
				} else if (PS.color(nx, ny + dirY) == garden.floorColor){
					ny = garden.levelGhostY[garden.currentLevel] + dirY;
				} else if ((PS.color(nx + dirX, ny) == garden.playerColor) || (PS.color(nx, ny + dirY) == garden.playerColor)){ // If player is in sight
					nx = garden.levelPlayerX[garden.currentLevel];
					ny = garden.levelPlayerY[garden.currentLevel];
					PS.statusText("You die!");
				};
			} else if (!(y==0)) {  // If the player goes along y-axis
				if (PS.color(nx, ny + dirY) == garden.floorColor){
					ny = garden.levelGhostY[garden.currentLevel] + dirY;
				} else if (PS.color(nx + dirX, ny) == garden.floorColor){
					nx = garden.levelGhostX[garden.currentLevel] + dirX;
				} else if ((PS.color(nx + dirX, ny) == garden.playerColor) || (PS.color(nx, ny + dirY) == garden.playerColor)){ // If player is in sight
					nx = garden.levelPlayerX[garden.currentLevel];
					ny = garden.levelPlayerY[garden.currentLevel];
					PS.statusText("You die!");
				};
			};
			
			// Restrain ghost from going off the grid
			if ((nx < 0) || (nx >= garden.width[garden.currentLevel]) || (ny < 0) || (ny >= garden.height[garden.currentLevel])) {
				return;
			};
			
			// Restrain ghost from moving over wall
			if (PS.color(nx, ny) == garden.wallColor) {
				return;
			};

			// Legal move, proceed to new location
			PS.color(garden.levelGhostX[garden.currentLevel], garden.levelGhostY[garden.currentLevel], garden.floorColor);
			PS.radius(garden.levelGhostX[garden.currentLevel], garden.levelGhostY[garden.currentLevel], 0);
			PS.color(nx, ny, garden.ghostColor);
			PS.radius(nx, ny, 50);
			
			// Update location
			garden.levelGhostX[garden.currentLevel] = nx;
			garden.levelGhostY[garden.currentLevel] = ny;
		}
	}
}() );

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.init = function( system, options ) {
	"use strict";

	// Indicate initial level
	var currentLevel;
	currentLevel = 0;
	
	// Garden setup
	garden.setup(currentLevel);
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead
};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

	switch ( key ) {
		case PS.KEY_ARROW_UP:
		case 119: // lower-case w
		case 87: // upper-case W
		{
			character.move( 0, -1 );
			character.ghostWalk( 0, -1 );
			character.ghostWalk( 0, -1 );
			break;
		}
		case PS.KEY_ARROW_DOWN:
		case 115: // lower-case s
		case 83: // upper-case S
		{
			character.move( 0, 1 );
			character.ghostWalk( 0, 1 );
			character.ghostWalk( 0, 1 );
			break;
		}
		case PS.KEY_ARROW_LEFT:
		case 97: // lower-case a
		case 65: // upper-case A
		{
			character.move( -1, 0 );
			character.ghostWalk( -1, 0 );
			character.ghostWalk( -1, 0 );
			break;
		}
		case PS.KEY_ARROW_RIGHT:
		case 100: // lower-case d
		case 68: // upper-case D
		{
			character.move( 1, 0 );
			character.ghostWalk( 1, 0 );
			character.ghostWalk( 1, 0 );
			break;
		}
	}
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.swipe ( data, options )
// Called when a mouse/finger swipe across the grid is detected
// It doesn't have to do anything
// [data] = an object with swipe information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.swipe = function( data, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters

	/*
	 var len, i, ev;
	 PS.debugClear();
	 PS.debug( "PS.swipe(): start = " + data.start + ", end = " + data.end + ", dur = " + data.duration + "\n" );
	 len = data.events.length;
	 for ( i = 0; i < len; i += 1 ) {
	 ev = data.events[ i ];
	 PS.debug( i + ": [x = " + ev.x + ", y = " + ev.y + ", start = " + ev.start + ", end = " + ev.end +
	 ", dur = " + ev.duration + "]\n");
	 }
	 */

	// Add code here for when an input event is detected
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};

