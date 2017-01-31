// game.js for Perlenspiel 3.2

// NAME: HUNG HONG - MATTHEW RODRICKS
// TITLE: TILT
// LOGLINE: Tilt to restore balance

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

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

var map, bead, timer;

( function (){
	// The following variab.e are for the setting of the map
	map = {
		// Size of map
		width : [9, 11, 9, 15, 7, 7, 9, 9, 11, 9, 11, 11, 11, 14, 12, 12], // width of map for each level
		height: [8, 7, 8, 14, 6, 7, 5, 7, 9, 12, 11, 6, 10, 13, 7, 5], // height of map for each level

		// Level properties
		currentLevel : 0,
		maxLevel : 15,

		// Tiles & How it works:
		// Wall: You can't move over it
		// Floor: You are free to move
		// Teleportation: You are warped to another teleportation in the same direction that you travel
		// Stone: You collide with the stone and push it 1 square. It will not be pushable later on

		// Color related settings
		wallColor : 0x262626, // color for wall 
		floorColor : 0x848484, // color for floor 
		ballColor : 0xFFFFFF, // color for ball 
		pointColor : 0x545454, // color for point
		tpColor : 0xBABABA, // color for teleportation
		stoneColor : 0x6A6A6A, // color for stone

		// Game status
		pointCounter : 0,
		colorOn : 0,

		// Gridplane for each levels
		// 0: Wall, 1: Plane, 2: Point, 3: Teleportation, 4: Stone
		floorPlane : 0,
		map : [[0, 0, 0, 0, 0, 0, 0, 0, 0,
			    0, 0, 0, 0, 2, 0, 0, 0, 0,
			    0, 0, 0, 1, 1, 1, 0, 0, 0,
			    0, 0, 0, 1, 1, 1, 0, 0, 0,
			    0, 0, 1, 1, 1, 1, 1, 0, 0,
			    0, 1, 1, 2, 1, 0, 2, 1, 0,
			    0, 1, 1, 1, 1, 1, 1, 1, 0,
			    0, 0, 0, 0, 0, 0, 0, 0, 0],

			   [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0,
				0, 0, 2, 1, 1, 0, 1, 2, 0, 0, 0,
				0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
				0, 0, 1, 1, 2, 0, 1, 1, 1, 0, 0,
				0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],

			   [0, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 0, 1, 1, 1, 1, 0,
				0, 1, 2, 0, 1, 1, 1, 1, 0,
				0, 0, 1, 1, 1, 0, 0, 0, 0,
				1, 1, 0, 0, 0, 0, 1, 1, 1,
				1, 1, 1, 2, 1, 0, 1, 1, 1,
				0, 2, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 2, 1, 0],

			   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 0,
				0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
				0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,],

			   [0, 0, 0, 0, 0, 0, 0,
				0, 1, 1, 1, 1, 2, 0,
				0, 3, 1, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 3, 0,
				0, 2, 1, 1, 1, 1, 0,
				0, 0, 0, 0, 0, 0, 0],

			   [0, 0, 0, 0, 0, 0, 0,
				0, 1, 1, 1, 1, 0, 0,
				0, 1, 3, 1, 1, 2, 0,
				0, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 1, 3, 0, 0,
				1, 1, 0, 1, 1, 1, 1,
				0, 0, 0, 0, 0, 0, 0],

			   [0, 0, 0, 0, 3, 0, 0, 0, 0,
				0, 0, 2, 1, 1, 1, 1, 0, 0,
				0, 1, 1, 0, 2, 0, 2, 1, 0,
				0, 0, 1, 1, 1, 2, 0, 0, 0,
				0, 0, 0, 0, 0, 3, 0, 0, 0],

			   [0, 0, 0, 0, 0, 0, 1, 1, 0,
				0, 0, 2, 1, 1, 1, 3, 2, 0,
				0, 1, 1, 0, 1, 1, 0, 0, 0,
				1, 1, 1, 3, 1, 1, 1, 1, 1,
				1, 0, 0, 1, 1, 1, 0, 0, 1,
				2, 1, 1, 1, 1, 1, 0, 1, 2,
				0, 0, 0, 0, 0, 0, 0, 1, 0],

			   [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0,
				0, 0, 1, 3, 1, 1, 0, 1, 3, 1, 0,
				0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 0,
				0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0,
				0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0,
				0, 1, 0, 0, 0, 0, 0, 1, 2, 1, 0,
				0, 1, 0, 2, 1, 0, 0, 0, 0, 0, 0,
				1, 1, 0, 0, 1, 0, 1, 1, 1, 2, 1,
				0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],

			   [0, 0, 0, 0, 0, 0, 0, 0, 0,
				1, 1, 1, 2, 0, 0, 0, 3, 1,
				0, 0, 0, 0, 0, 0, 0, 1, 0,
				0, 0, 0, 0, 0, 0, 0, 1, 0,
				0, 0, 1, 1, 1, 1, 1, 1, 0,
				0, 1, 4, 2, 1, 4, 0, 2, 0,
				0, 0, 1, 1, 1, 1, 2, 4, 0,
				0, 1, 1, 1, 3, 1, 0, 1, 0,
				0, 1, 1, 1, 0, 1, 0, 0, 0,
				0, 0, 0, 0, 1, 4, 2, 1, 0,
				1, 1, 1, 1, 0, 0, 1, 1, 1,
				0, 0, 0, 0, 0, 0, 0, 0, 0],

			   [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1,
			    1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1,
			    1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 1,
				0, 1, 1, 1, 3, 1, 0, 0, 0, 0, 0,
				0, 0, 2, 1, 1, 0, 1, 1, 2, 0, 0,
				0, 0, 0, 0, 0, 1, 3, 1, 1, 1, 0,
				1, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1,
				1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1,
				1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],

			   [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1,
				1, 2, 1, 1, 4, 1, 4, 1, 1, 1, 2,
				0, 1, 4, 4, 1, 1, 1, 4, 4, 1, 0,
				1, 1, 1, 0, 4, 1, 4, 0, 1, 1, 1,
				1, 2, 1, 0, 0, 4, 0, 0, 1, 2, 1,
				1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],

			   [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0,
				1, 2, 0, 1, 1, 1, 0, 0, 2, 1, 1,
				0, 1, 0, 1, 1, 1, 0, 1, 3, 1, 0,
				0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 0,
				1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
				1, 4, 1, 0, 1, 3, 1, 0, 1, 1, 1,
				1, 1, 1, 1, 0, 2, 0, 1, 1, 1, 1,
			    1, 2, 1, 4, 1, 1, 1, 4, 1, 2, 1,
			    1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1,
				0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],

			   [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0,
				1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 3, 1,
				1, 1, 3, 2, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1,
				1, 1, 1, 1, 1, 2, 1, 3, 1, 1, 1, 0, 1, 1,
				1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1,
				0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0,
				1, 2, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 2, 1,
				1, 1, 0, 1, 1, 1, 3, 1, 2, 1, 1, 0, 1, 1,
				1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1,
				1, 1, 1, 0, 2, 1, 1, 3, 1, 1, 1, 0, 1, 1,
				1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1,
				1, 3, 1, 1, 1, 0, 0, 1, 0, 0, 2, 1, 1, 1,
				0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0],
				
			   [0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1,
			    0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 3,
				1, 3, 1, 1, 4, 1, 1, 1, 2, 1, 0, 1,
				1, 0, 2, 1, 4, 1, 1, 1, 4, 1, 0, 1,
				1, 0, 4, 1, 4, 1, 1, 1, 4, 1, 0, 1,
				0, 0, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1,
				0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
				
			   [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1,
			    0, 1, 1, 1, 4, 0, 1, 1, 4, 1, 1, 0,
				0, 0, 0, 2, 4, 1, 0, 1, 4, 1, 2, 0,
				0, 1, 1, 1, 4, 1, 1, 0, 4, 1, 1, 0,
				0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1]],

		// Location of player for each level
		levelBallX : [4, 7, 5, 13, 2, 3, 3, 4, 4, 3, 9, 2, 1, 11, 6, 1],
		levelBallY : [3, 3, 1, 12, 3, 3, 1, 3, 3, 10, 8, 0, 4, 1, 2, 1],
		initlevelBallX : [4, 7, 5, 13, 2, 3, 3, 4, 4, 3, 9, 2, 1, 11, 6, 1],
		initlevelBallY : [3, 3, 1, 12, 3, 3, 1, 3, 3, 10, 8, 0, 4, 1, 2, 1],

		// Teleportation properties
		// Number of teleportation
		numTp : [0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 4, 0, 2, 6, 2, 0],

		// Start Point
		startTpX : [[], [], [], [], [1, 5], [2, 4], [4, 5], [6, 3], [3, 8], [4, 7], [4, 9, 1, 6], [], [5, 8], [6, 7, 12, 7, 1, 2], [1, 11], []],
		startTpY : [[], [], [], [], [2, 3], [2, 4], [0, 4], [1, 3], [1, 1], [7, 1], [4, 3, 7, 6], [], [5, 2], [7, 3, 1, 9, 11, 2], [2, 1], []],

		// End Point
		endTpX : [[], [], [], [], [5, 1], [4, 2], [5, 4], [3, 6], [8, 3], [7, 4], [9, 4, 6, 1], [], [8, 5], [7, 6, 2, 1, 7, 12 ], [11, 1], []],
		endTpY : [[], [], [], [], [3, 2], [4, 2], [4, 0], [3, 1], [1, 1], [1, 7], [3, 4, 6, 7], [], [2, 5], [3, 7, 2, 11, 9, 1], [1, 2], []],

		// Amount of point in each level
		pointAmount : [3, 3, 4, 4, 2, 1, 4, 4, 3, 5, 4, 4, 5, 7, 4, 2],

		// drawMap(level);
		// Scan the map data and draw out layout for corresponding level
		drawMap : function (level) {
			var ptr, x, y, data;

			ptr = 0; // Initial data pointer
			for ( y = 0; y < map.height[level]; y++ ){
				for ( x = 0; x < map.width[level]; x++ ){
					data = map.map[level] [ptr]; // Get map data
					if ( data == 0 ){ // Wall?
						PS.gridPlane(map.floorPlane);
						PS.color( x, y, map.wallColor );
					} else if ( data == 1 ){ // Floor?
						PS.gridPlane(map.floorPlane);
						PS.color( x, y, map.floorColor );
					} else if ( data == 2 ){ // Point?
						PS.gridPlane(map.floorPlane);
						PS.color( x, y, map.pointColor );
						PS.radius( x, y, 50 );
						PS.scale( x, y, 50)
					} else if ( data == 3 ){ // Teleportation?
						PS.gridPlane(map.floorPlane);
						PS.color( x, y, map.tpColor );
						PS.radius( x, y, 25 );
						PS.scale( x, y, 75 );
					} else if ( data == 4 ){
						PS.gridPlane(map.floorPlane);
						PS.color( x, y, map.stoneColor );
					};
					ptr++; // Update pointers0
				}
			}
		},

		// setup(level)
		// Attempt to set up map relative to level
		setup : function (level) {
			// Refresh level
			map.levelBallX[level] = map.initlevelBallX[level];
			map.levelBallY[level] = map.initlevelBallY[level];

			// Set up dimension
			PS.gridSize( map.width[level], map.height[level] );
			PS.gridColor( map.floorColor );
			PS.color( PS.ALL, PS.ALL, map.floorColor );
			PS.border( PS.ALL, PS.ALL, 0 );
			map.drawMap(level);

			// Level indication
			PS.statusColor( map.floorColor );
			PS.statusText( "" );

			// Place player at initial position
			PS.color( map.initlevelBallX[level], map.initlevelBallY[level], map.ballColor );
			PS.radius( map.initlevelBallX[level], map.initlevelBallY[level], 50 );

			// Save level
			map.currentLevel = level;
		}
	};

	character = {
		direction : 0, // 0: Static, 1: Up, 2: Down, 3: Left, 4: Right

		inMotion : 0, // Check whether the ball is currently moving

		// slide()
		// Attempt to move ball relative to current position
		slide : function () {
			character.inMotion = 1;
			x = 0;
			y = 0;
			// Check for current direction of the slide
			if (character.direction == 0) {
				return;
			} else if (character.direction == 1) {
				x = 0;
				y = -1;
			} else if (character.direction == 2) {
				x = 0;
				y = 1;
			} else if (character.direction == 3) {
				x = -1;
				y = 0;
			} else if (character.direction == 4) {
				x = 1;
				y = 0;
			};

			nx = map.levelBallX[map.currentLevel] + x;
			ny = map.levelBallY[map.currentLevel] + y;
			if ((nx >= 0) && (nx <= map.width[map.currentLevel]-1) && (ny >= 0) && (ny <= map.height[map.currentLevel]-1) && (PS.color(nx, ny)==map.wallColor)){
				PS.timerStop(timer);
				timer = null;
				character.direction = 0;
				character.inMotion = 0;
			} else {
				character.move(x,y);
			};

			if (map.pointCounter >= map.pointAmount[map.currentLevel]){
				if (map.currentLevel < map.maxLevel){
					PS.timerStop(timer);
					timer = null;
					character.direction = 0;
					character.inMotion = 0;
					map.pointCounter = 0;
					map.setup(map.currentLevel+1);
				};
			};
		},

		// move(x, y)
		// Attempt to make small step for the ball to bring out the animation
		move : function(x, y) {
			var nx, ny;

			// Ball is moving, proceed to animation
			nx = map.levelBallX[map.currentLevel] + x;
			ny = map.levelBallY[map.currentLevel] + y;

			// Looping border
			if (nx < 0) {
				nx = map.width[map.currentLevel]-1;
			} else if (nx > map.width[map.currentLevel]-1) {
				nx = 0;
			} else if (ny < 0) {
				ny = map.height[map.currentLevel]-1;
			} else if (ny > map.height[map.currentLevel]-1) {
				ny = 0;
			};

			// Teleportation
			if ( PS.color( nx, ny ) == map.tpColor ){
				for (i = 0; i < map.numTp[map.currentLevel]; i++){
					if ((nx == map.startTpX[map.currentLevel][i]) && (ny == map.startTpY[map.currentLevel][i])) {
						nx = map.endTpX[map.currentLevel][i] + x;
						ny = map.endTpY[map.currentLevel][i] + y;
						PS.audioPlay("Warp", {fileTypes: ["mp3"], path: "./audio/", volume: 1.0});
					}
				}
			}

			// Pushing stone
			if ( PS.color( nx, ny ) == map.stoneColor ){
				PS.color( nx+x, ny+y, map.wallColor);
				PS.audioPlay("Rock", {fileTypes: ["mp3"], path: "./audio/", volume: 1.0});
			}

			// Pointer on the way, eat it!
			if ( PS.color( nx, ny ) == map.pointColor ){
				map.pointCounter++;
				PS.audioPlay("Coin", {fileTypes: ["wav"], path: "./audio/", volume: 1.0});
			};

			// Legal move, proceed to new location
			PS.color( nx, ny, map.ballColor );
			PS.radius( nx, ny, 50 );
			PS.scale( nx, ny, 100 );
			PS.color( map.levelBallX[map.currentLevel], map.levelBallY[map.currentLevel], map.floorColor );
			PS.radius( map.levelBallX[map.currentLevel], map.levelBallY[map.currentLevel], 0 );

			// Update location
			map.levelBallX[map.currentLevel] = nx;
			map.levelBallY[map.currentLevel] = ny;

		}
	};
}());
PS.init = function( system, options ) {
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	// Indicate initial level
	var currentLevel = 0;

	// Map setup
	map.setup(currentLevel);

	// Music and sound effect
	PS.audioLoad("Coin", {fileTypes: ["wav"], path: "./audio/"});
	PS.audioLoad("Rock", {fileTypes: ["mp3"], path: "./audio/"});
	PS.audioLoad("Warp", {fileTypes: ["mp3"], path: "./audio/"});
	PS.audioPlay("Glitz At The Ritz 2", {fileTypes: ["mp3"], path: "./audio/", loop: true, volume: 0.25});

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

	// Uncomment the following line to inspect parameters
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed

	switch ( key ){
		case PS.KEY_ARROW_UP:
		case 119:
		case 87:
		{
			if (character.inMotion == 0){
				character.direction = 1;
				timer = PS.timerStart(3, character.slide);
				break;
			};
		}
		case PS.KEY_ARROW_DOWN:
		case 115:
		case 83:
		{
			if (character.inMotion == 0){
				character.direction = 2;
				timer = PS.timerStart(3, character.slide);
				break;
			};
		}
		case PS.KEY_ARROW_LEFT:
		case 97:
		case 65:
		{
			if (character.inMotion == 0){
				character.direction = 3;
				timer = PS.timerStart(3, character.slide);
				break;
			};
		}
		case PS.KEY_ARROW_RIGHT:
		case 100:
		case 68:
		{
			if (character.inMotion == 0){
				character.direction = 4;
				timer = PS.timerStart(3, character.slide);
				break;
			};
		}
		case 32:
		{
			if (character.inMotion == 0){
				map.pointCounter = 0;
				map.setup(map.currentLevel);
				break;
			}
		}
		// Secret Mode: Pop Culture
		// Can be turned on and off
		case 33:
		{
			if (map.colorOn == 0){
				if (character.inMotion == 0){
					map.pointCounter = 0;
					map.wallColor = 0x00253D;
					map.floorColor = 0x000A0E;
					map.ballColor = 0xFFC600;
					map.pointColor = 0xCC0273;
					map.tpColor = 0xEDF7FC;
					map.stoneColor = 0x00619F;
					map.colorOn = 1;
					map.setup(map.currentLevel);
					break;
				}
			} else {
				if (character.inMotion == 0){
					map.pointCounter = 0;
					map.wallColor = 0x262626;
					map.floorColor = 0x848484;
					map.ballColor = 0xFFFFFF;
					map.pointColor = 0x545454;
					map.tpColor = 0xBABABA;
					map.stoneColor = 0x6A6A6A;
					map.colorOn = 0;
					map.setup(map.currentLevel);
					break;
				}
			}
		}
	};
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
