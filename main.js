/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Game() {
    this.board = new GameBoard();
    this.guesses = 0;
    
    this.displayMessage = function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    };
    
    this.resetCell = function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "");
    };

    this.displayHit = function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    };

    this.displayMiss = function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    };
    
    this.handleFireButton = function() {
            var guessInput = document.getElementById("guessInput");
            var guess = guessInput.value.toUpperCase();

            game.processGuess(guess);

            guessInput.value = "";
    };
    
    this.handleKeyPress = function(e) {
            var fireButton = document.getElementById("fireButton");

            // in IE9 and earlier, the event object doesn't get passed
            // to the event handler correctly, so we use window.event instead.
            e = e || window.event;

            if (e.keyCode === 13) {
                    fireButton.click();
                    return false;
            }
    };
    
    // helper function to parse a guess from the user

    this.parseGuess = function(guess) {
            var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H"];

            if (guess === null || guess.length !== 2) {
                    alert("Oops, please enter a letter and a number on the board.");
            } else {
                    var firstChar = guess.charAt(0);
                    var row = alphabet.indexOf(firstChar);
                    var column = guess.charAt(1);

                    if (isNaN(row) || isNaN(column)) {
                            alert("Oops, that isn't on the board.");
                    } else if (row < 0 || row >= this.boardSize ||
                               column < 0 || column >= this.boardSize) {
                            alert("Oops, that's off the board!");
                    } else {
                            return row + column;
                    }
            }
            return null;
    };
    

    this.processGuess = function(guess) {
        var location = game.parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = this.board.fire(location);
            if (hit && this.board.shipsSunk === this.board.numShips) {
                game.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
            }
        }
    };
    

    
};

function GameBoard() {
    this.boardSize = 8;
    this.numShips = 4;
    this.shipLength = 0;
    this.shipLengths = [2, 3, 3, 4];
    this.shipsSunk = 0;
    
    this.ships = [];
    
    this.generateShipLengths = function() {
        for (i = 0; i < this.numShips; i++) {
            var randLength = Math.floor(Math.random() * this.shipLength) + 1;
            this.shipLengths.append(randLength);
        }
    }
    
    this.updateShip = function(ship, oldCells, newCells) {
        
        // Erase old ship
        for (var o = 0; o < oldCells.length; o++) {
            game.resetCell(oldCells[o])
        }

            // Draw new ship
            for (var j = 0; j < newCells.length; j++) {
                ship.locations[j] = newCells[j];
                
                if (ship.hits[j] === "hit") {
                    game.displayHit(newCells[j]);
                }            
                
            }
    }
    
    this.fleeShipVertically = function(ship, choice, stuck) {
                choice === 0 ? console.log("fleeing negatively") : console.log("fleeing positively")
        
        var oldCells = [];
        var newCells = [];
        
        for (var i = 0; i < ship.locations.length; i++) {
            var oldCell = ship.locations[i];
            var newCell;
            
            if (choice === 0) {
                newCell = (parseInt(ship.locations[i][0]) - 1) + ship.locations[i][1]
            } else {
                newCell = (parseInt(ship.locations[i][0]) + 1) + ship.locations[i][1]
            }

            console.log(newCell)
          
            oldCells.push(oldCell);
            newCells.push(newCell);

        }
  
        if (this.leadingCollision(newCells[0], ship, choice) && choice === 0 || this.leadingCollision(newCells[newCells.length - 1], ship, choice) && choice === 1) {
            // Recursively call and go the opposite way
            choice === 0 ? choice = 1 : choice = 0
            

            if (!stuck) {
                this.fleeShipVertically(ship, choice, true);
            }
            
            // The ship collides with another and is stuck at a boundary
            return;
        }
        
        this.updateShip(ship, oldCells, newCells);
         
        
    }
    
    this.fleeShipHorizontally = function(ship, choice, stuck) {
                choice === 0 ? console.log("fleeing negatively") : console.log("fleeing positively")
        var oldCells = [];
        var newCells = [];
        
        for (var i = 0; i < ship.locations.length; i++) {
            var oldCell = ship.locations[i];
            
            if (choice === 0) {  
                var newCell = ship.locations[i][0] + (parseInt(ship.locations[i][1]) - 1)
            } else {
                var newCell = ship.locations[i][0] + (parseInt(ship.locations[i][1]) + 1)
            }


            oldCells.push(oldCell);
            newCells.push(newCell);
            

        }


        // Check for collision in the designated axis
        if (this.leadingCollision(newCells[0], ship, choice) && choice === 0 || this.leadingCollision(newCells[newCells.length - 1], ship, choice) && choice === 1) {
            // Recursively call and go the opposite way
            choice === 0 ? choice = 1 : choice = 0
            
            if (!stuck) {
                this.fleeShipHorizontally(ship, choice, true)
            }
            
            // The ship collides with another and is stuck at a boundary        
            return;
        }

        this.updateShip(ship, oldCells, newCells);
                
        
    }
    
    this.flee = function(ship, guess) {

        // Generate to move the ship backwards or forwards [0] negative [1] positive
        var choice = Math.floor(Math.random() * 2);

        
        
        if (ship.getHits() >= 2) {
            console.log("Ship taken too many hits to flee")
            return;
        }
        
        console.log("Time to flee");
        console.log("Here's the ships locations " + ship.locations);


            

            
            // Add one to the respective axis and check for collisions as needed
            if (ship.facing === 0) {
                    this.fleeShipVertically(ship, choice, false);
            } else if (ship.facing === 1) {
                    this.fleeShipHorizontally(ship, choice, false);
            }
        

        

        game.displayMessage("HIT! The ship flees!")
        console.log("Here is the new locations " + ship.locations)

        
    };
    
    this.fire = function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// here's an improvement! Check to see if the ship
			// has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") {
				game.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
                                
                                game.displayMessage("HIT!");
                                game.displayHit(guess);
                                
                                ship.hits[index] = "hit";
                                
                                if (this.isSunk(ship)) {
                                    game.displayMessage("You sank my battleship!");
                                    this.shipsSunk++;
                                } else {
                                    // See if it triggers flee
                                    var flee = Math.floor(Math.random() * 2)

                                    flee === 0 ? this.flee(ship, guess) : null;


                                }


                                
				return true;
			}
		}
		game.displayMiss(guess);
		game.displayMessage("You missed.");
		return false;
	};

	this.isSunk = function(ship) {
		for (var i = 0; i < ship.locations.length; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	};
        
        this.generateShipLocations = function() {

		for (var i = 0; i < this.numShips; i++) {                    
                    var shipInfo = this.generateShip(i);
                    
                    while (this.collision(shipInfo[0])) {
                        shipInfo = this.generateShip(i);
                    }
                    
                    console.log(shipInfo[0])
     
                    // Have a good location, now make a Ship object and append it
                    
                     var ship = new Ship();
                     ship.locations = shipInfo[0];
                     ship.facing = shipInfo[1];
                     
                     // Add how many hit positions are needed
                     for (var j = 0; j < ship.locations.length; j++) {
                         ship.hits.push("");
                     }
                     
                     this.ships.push(ship);
                     
		}
		console.log("Ships array locations: ");



	};

	this.generateShip = function(shipNum) {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLengths[shipNum] + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLengths[shipNum] + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLengths[shipNum]; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return [newShipLocations, direction];
	};

	this.collision = function(locations) {

		for (var i = 0; i < this.ships.length; i++) {
			var ship = this.ships[i];

			for (var j = 0; j < ship.locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	};
        
        this.leadingCollision = function(location, ship, choice) {
            for (var i = 0; i < this.ships.length; i++) {
                var currentShip = this.ships[i];


                    if (currentShip.locations.indexOf(location) >= 0 && this.ships.indexOf(currentShip) !== this.ships.indexOf(ship)) {
                        console.log(currentShip.locations + " collides with " + ship.locations);
                        return true;
                    } else if (parseInt(ship.locations[ship.locations.length - 1][0]) + 1 > this.boardSize - 1 && ship.facing === 0 && choice === 1 ||
                        parseInt(ship.locations[0][0]) - 1 < 0 && ship.facing === 0 && choice === 0 || 
                        parseInt(ship.locations[ship.locations.length - 1][1]) + 1 > this.boardSize - 1 && ship.facing === 1 && choice === 1 ||
                        parseInt(ship.locations[0][1]) - 1 < 0 && ship.facing === 1 && choice === 0) {
                            console.log("Fleeing this ship will cause it to go out of bounds, exiting")
                            return true;
        
                    }
                }
            
            return false;
        };




};

function Ship() {
    this.locations = [];
    this.hits = [];
    // 0 = Vertical, 1 = Horizontal
    this.facing;
    
    
    this.getHits = function() {
        var count = 0;
        for (var i = 0; i < this.hits.length; i++) {
            if (this.hits[i] === "hit") {
                count++;
            }
        }
        
        return count;
    };
};

window.onload = init;

function init() {
    
        // Inputs, uncomment later?
        /*
        var shipNum = prompt("How many ships do you want? (1-5)")
        
        while (shipNum > 5 || shipNum < 1) {           
            shipNum = prompt("Please enter a valid number. How many ships do you want? (1-5)")
        }
        
        var shipLength = prompt("How long do you potentially want longest ship to be? (2-5)")
        
        while (shipLength > 5 || shipLength < 2) {           
            shipLength = prompt("Please enter a valid number. How long do you potentially want the longest ship to be? (2-5)")
        }
        
        // Set the instance variables
        game.board.numShips = shipNum;
        game.board.shipLength = shipLength;
        */
        
        // Create a game object
        game = new Game();     
        
        game.board.generateShipLocations();
        
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = game.handleFireButton;

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = game.handleKeyPress;

}