var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
        // When you randonly generate ships you can initialize them here
        /*
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],
    */

// original hard-coded values for ship locations

	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],


	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// here's an improvement! Check to see if the ship
			// has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

        /*
         * Loads the ship locations into the "objects" in 'ships'
         */
	generateShipLocations: function() {
		// Create ships here.
                
		console.log("Ships array: ");
		console.log(this.ships);
                
                console.log("generating a ship")
                
                // Check if everything is free of collisions, if not, the generation will repeat
                this.generateShip();
	},
        /*
         * Returns an array of ship locations.  The array should be the length
         * of the ship.
         * 
         * Ex. [14, 24, 34] for a ship of length 3
         */
	generateShip: function() {
               // Choose whether the ship is vertical or horizontal
               // Also an example of using Math.random
		var direction = Math.floor((Math.random() * 2));
                
                // Generate 3 random positions on the board depending on the direction 
   
                // Generate a row
                var row = Math.floor((Math.random() * this.boardSize));
                // Generate a column
                var column = Math.floor((Math.random() * this.boardSize));
                
                
                /* DEBUG
                var direction = 1;
                var row = 5;
                var column = 6; */
                
                // Temporary "Ship" object position
                var locations = [];
                
                
                console.log("row " + row, "column " + column);
                
                // Handle out of bounds and check for collisions
                
                switch(direction) {
                    // Vertical
                    case 0:
                        // Generated at a bottom cell
                        if (row + 1 > this.boardSize - 1) {
                            // Generate locations
                            for (i = 0; i < this.shipLength; i++) {
                                locations.push(row - i, column);
                            }
                        
                        // Generated at a top cell
                        } else if (row - 1 < 0) {
                            
                            // Generate locations
                            for (i = 0; i < this.shipLength; i++) {
                                locations.push(row + i, column);
                            }
                        // Free to put it wherever
                        } else {
                            
                        }
                        break;
                    // Horizontal
                    case 1:
                        // Generated at a rightmost cell
                        if (column + 1 > this.boardSize - 1) {
                            // Generate locations
                            for (i = 0; i < this.shipLength; i++) {
                                locations.push(row, column - i);
                            }
                        
                        // Generated at a leftmost cell
                        } else if (column - 1 < 0) {
                            
                            // Generate locations
                            for (i = 0; i < this.shipLength; i++) {
                                locations.push(row, column + i);
                            }
                            
                        // Free to put it wherever
                        } else {
                            
                        }
                        break;
                }
                
                console.log(locations);
                
		
	},

/*
 * Returns true if there is a collision between the ships, false otherwise
 * Accepts the array 'location' of a ship, and checks the existing ships in "ships"
 * for collisions.
 */
	collision: function(locations) {
            for (var ship in this.ships) {
                console.log(this.ships[ship].locations);
                var currentShipLoc = this.ships[ship].locations
                
                for (var loc in currentShipLoc) {
                    // Check if there is a conflict
                    for (var myLoc in locations) {
                        if (locations[myLoc] === currentShipLoc[loc]) {
                            return true;
                        }
                    }
                }
            }
            return false;
            
	}
	
}; 


var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}

}; 

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
}


// helper function to parse a guess from the user

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}


// event handlers

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}


// init - called when the page has completed loading

window.onload = init;

function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place the ships on the game board
	//model.generateShipLocations();
        console.log(model.collision(["24"]))
}





