// Initialize Firebase
var config = {
  apiKey: "AIzaSyBfUgyioCh73UJvvDgpe5vZsUnzijWtxRo",
  authDomain: "rps-multiplayer-ea28f.firebaseapp.com",
  databaseURL: "https://rps-multiplayer-ea28f.firebaseio.com",
  projectId: "rps-multiplayer-ea28f",
  storageBucket: "",
  messagingSenderId: "413859234582"
};
firebase.initializeApp(config);

var database = firebase.database();

// each player enters in as their own folder in the database
var playerTurn = database.ref();
var players = database.ref("/players");
var player1 = database.ref("/players/player1");
var player2 = database.ref("/players/player2");
var playerChat = database.ref("/chat");
// Initialize all global variables
var player;
var p1snapshot;
var p2snapshot;
var p1result;
var p2result;
var p1 = null;
var p2 = null;
var wins1 = 0;
var wins2 = 0;
var losses1 = 0;
var losses2 = 0;
var playerNum = 0;

// initial submit form to enter as a player
$("#playerInfo").html("<form><input id=playerName type=text placeholder='Enter your name to begin'><input id=enterPlayer type=submit value=Start></form>");



// publishes changes made to the player 1 database
player1.on("value", function(snapshot) {
	if (snapshot.val() !== null) {
		p1 = snapshot.val().player;
		wins1 = snapshot.val().wins;
		losses1 = snapshot.val().losses;
		$("#p1name").html("<h2>" + p1 + "</h2>");
		$("#p1stats").html("<p>Wins: " + wins1 + "  Losses: " + losses1 + "</p>");
	} else {
		$("#p1name").html("Waiting for Player 1");
		$("#p1stats").empty();
		// Displays that player disconnected
		if (p1 !== null) {
			playerChat.push({
				player: p1,
				taunt: " has disconnected",
				dateAdded: firebase.database.ServerValue.TIMESTAMP
			});
		};
	};
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});

// Publishes changes made to the player 2 database
player2.on("value", function(snapshot) {
	if (snapshot.val() !== null) {
		p2 = snapshot.val().player;
		wins2 = snapshot.val().wins;
		losses = snapshot.val().losses;
		$("#p2name").html("<h2>" + p2 + "</h2>");
		$("#p2stats").html("<p>Wins: " + wins2 + "  Losses: " + losses2 + "</p>");
	} else {
		$("#p2name").html("Waiting for Player 2");
		$("#p2stats").empty();
		// Displays that player disconnected
		if (p2 !== null) {
			playerChat.push({
				player: p2,
				taunt: " has disconnected",
				dateAdded: firebase.database.ServerValue.TIMESTAMP
			});
		};
	};
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});

// On Submit button, added player depending on who is already in the firebase database by checking if exists
$("#enterPlayer").on("click", function(event) {
	event.preventDefault();
	var regex = /(^([a-zA-Z]{2,})?(\s?[a-zA-Z]{2,}$))/;
	player = $("#playerName").val().trim();
	if (regex.test(player)) {
		player1.once("value", function(snapshot) {
			p1snapshot = snapshot;
		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
		player2.once("value", function(snapshot) {
			p2snapshot = snapshot;
		}, function(errorObject) {
			console.log("The read failed: " + errorObject.code);
		});
		// if there is no player 1
		if (!p1snapshot.exists()) {
			// sets local variable of player number, to know which page to display choices on and who is taunting
			playerNum = 1;
			// if player disconnects, remove them from the database
			player1.onDisconnect().remove();
			// sets a new player 1
			player1.set({
				player: player,
				wins: 0,
				losses: 0
			});
			$("#playerInfo").html("Hi " + player + "! You are Player 1");
			// If there is no player 2
			if (!p2snapshot.exists()) {
				$("#playerTurn").html("Waiting for Player 2 to join...");
			};
		// if there is no player 2
		} else if (!p2snapshot.exists()) {
			// sets local variable of player number, to know which page to display choices on and who is taunting
			playerNum = 2;
			// if player disconnects, remove them from the database
			player2.onDisconnect().remove();
			// sets a new player 2
			player2.set({
				player: player,
				wins: 0,
				losses: 0
			});
			// This starts the game
			playerTurn.update({
				turn: 1
			});
			$("#playerInfo").html("Hi " + player + "! You are Player 2");
			$("#playerTurn").html("Waiting for " + p1 + " to choose.");
		// if both players have already joined, don't let a third join
		} else {
			$("#playerInfo").html("Sorry. Two people are already playing");
		};
	} else {
		alert("Please enter a valid name. Your name can be up to two words.");
		$("#playerName").val("");
	};
});

players.on("value", function(snapshot) {
	// If both players leave, everything is deleted from database to reset for next game
	if (snapshot.val() == null) {
		$("#player1").css("border-color", "black");
		$("#player2").css("border-color", "black");
		playerTurn.set({});
	};
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});


// Results checker
var rpsResults = function() {
	// once this function is called, grabs both players' data
	player1.once("value", function(snapshot) {
		p1result = snapshot;
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	player2.once("value", function(snapshot) {
		p2result = snapshot;
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	// Logic for round result
	if (p1result.val() !== null && p2result.val() !== null) {
		// If both players choose the same item
		if (p1result.val().choice == p2result.val().choice) {
			$("#p1choices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#p2choices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#results").html("<h1>Tie Game!</h1>");
		// Player one wins
		} else if (p1result.val().choice == "Rock" && p2result.val().choice == "Scissors") {
			$("#p1choices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#p2choices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#results").html("<h1>" + p1 + " wins!</h1>");
			wins1++;
			losses2++;
		// Player two wins
		} else if (p1result.val().choice == "Rock" && p2result.val().choice == "Paper") {
			$("#p1choices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#p2choices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#results").html("<h1>" + p2 + " wins!</h1>");
			wins2++;
			losses1++;
		// Player two wins
		} else if (p1result.val().choice == "Paper" && p2result.val().choice == "Scissors") {
			$("#p1choices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#p2choices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#results").html("<h1>" + p2 + " wins!</h1>");
			wins2++;
			losses1++;
		// Player one wins
		} else if (p1result.val().choice == "Paper" && p2result.val().choice == "Rock") {
			$("#p1choices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#p2choices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#results").html("<h1>" + p1 + " wins!</h1>");
			wins1++;
			losses2++;
		// Player one wins
		} else if (p1result.val().choice == "Scissors" && p2result.val().choice == "Paper") {
			$("#p1choices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#p2choices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#results").html("<h1>" + p1 + " wins!</h1>");
			wins1++;
			losses2++;
		// Player two wins
		} else if (p1result.val().choice == "Scissors" && p2result.val().choice == "Rock") {
			$("#p1choices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#p2choices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#results").html("<h1>" + p2 + " wins!</h1>");
			wins2++;
			losses1++;
		};
		// After results are calculated, reset the round in 4 seconds
		setTimeout(function() {
			playerTurn.update({
				turn: 1
			});
			player1.once("value", function(snapshot) {
				p1result = snapshot;
			}, function(errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
			if (p1result.val() !== null) {
				player1.update({
					wins: wins1,
					losses: losses1
				});
			};
			player2.once("value", function(snapshot) {
				p2result = snapshot;
			}, function(errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
			if (p2result.val() !== null) {
				player2.update({
					wins: wins2,
					losses: losses2
				});
			};
			$("#results").html("");
			$("#p2choices").html("");
			$("#player2").css("border-color", "black");
			}, 1000*4);
	};
};

// Checks whos turn it is
playerTurn.on("value", function(snapshot) {
	if (snapshot.val() !== null) {
		// Highlights the border around whoever's turn it is
		if (snapshot.val().turn == 1) {
			$("#player1").css("border-color", "blue");
		} else if (snapshot.val().turn == 2) {
			$("#player2").css("border-color", "blue");
			$("#player1").css("border-color", "black");
		}
		// Display waiting for other player whenever it's their turn
		if (snapshot.val().turn == 2 && playerNum == 1) {
			$("#playerTurn").html("Waiting for " + p2 + " to choose.");
		} else if (snapshot.val().turn == 1 && playerNum == 2) {
			$("#p1choices").html("");
			$("#playerTurn").html("Waiting for " + p1 + " to choose.");
		}
		// If it's player 1's turn, display choices on their specific page
		if (snapshot.val().turn == 1 && playerNum == 1) {
			$("#p1choices").empty();
			$("#p1choices").append("<div>Rock</div>");
			$("#p1choices").append("<div>Paper</div>");
			$("#p1choices").append("<div>Scissors</div>");
			$("#playerTurn").html("It's your turn!");
		// If it's player 2's turn, display choices on their specific page
		} else if (snapshot.val().turn == 2 && playerNum == 2) {
			$("#p2choices").empty();
			$("#p2choices").append("<div>Rock</div>");
			$("#p2choices").append("<div>Paper</div>");
			$("#p2choices").append("<div>Scissors</div>");
			$("#playerTurn").html("It's your turn!");
		// After both turns, call rpsResults
		} else if (snapshot.val().turn == 3) {
			$("#playerTurn").html("");
			rpsResults();
		};
	};
});

// Displays player's choice while they wait for the other player
$("#p1choices").on("click", "div", function() {
	var choice = $(this).text();
	$("#p1choices").html("<h1>" + choice + "</h1>");
	setTimeout(function() {
		playerTurn.update({
			turn: 2
		});
		player1.update({
			choice: choice
		}); 
	}, 500);
});
$("#p2choices").on("click", "div", function() {
	var choice = $(this).text();
	$("#p2choices").html("<h1>" + choice + "</h1>");
	setTimeout(function() {
		player2.update({
			choice: choice
		}); 
		playerTurn.update({
			turn: 3
		});
	}, 500);
});

// Operation of the chat box below the player cards
$("#taunt").on("click", function(event) {
	event.preventDefault();
	var message = $("#messageBox").val().trim();
	$("#messageBox").val("");
	if (playerNum == 1) {
		playerChat.push({
			player: p1 + ": ",
			taunt: message,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	} else if (playerNum == 2) {
		playerChat.push({
			player: p2 + ": ",
			taunt: message,
			dateAdded: firebase.database.ServerValue.TIMESTAMP
		});
	};
});

// Adds new messages to chat box and keeps the box scrolled down to most recent
playerChat.orderByChild("dateAdded").on("child_added", function(snapshot) {
	$("#chatbox").append(snapshot.val().player + snapshot.val().taunt + "<br>");
	var bottom = $("#chatbox").get(0);
    bottom.scrollTop = bottom.scrollHeight;
});

