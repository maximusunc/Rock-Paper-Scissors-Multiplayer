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

var player1 = database.ref("/player1");
var player2 = database.ref("/player2");
var player;

$("#playerInfo").html("<input id=playerName type=text placeholder='Enter your name to begin'><input id=enterPlayer type=submit>");

player1.on("child_added", function(snapshot) {
	console.log(snapshot.val());
	var playerOne = snapshot.val().player;
	console.log(playerOne);
	$("#player1").html(snapshot.val().player);
	$("#player1").append("<p>Wins: " + snapshot.val().wins + "  Losses: " + snapshot.val().losses + "</p>");
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});

player2.on("child_added", function(snapshot) {
	console.log(snapshot.val());
	player = snapshot.val().player;
	console.log(player);
	$("#player2").html(snapshot.val().player);
	$("#player2").append("<p>Wins: " + snapshot.val().wins + "  Losses: " + snapshot.val().losses + "</p>");
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});

$("#enterPlayer").on("click", function() {
	event.preventDefault();
	player = $("#playerName").val().trim();
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
	if (!p1snapshot.exists()) {
		var p1 = player1.push({
			player: player,
			wins: 0,
			losses: 0
		});
		p1.onDisconnect().remove();
		$("#playerInfo").html("Hi " + player + "! You are Player 1");
	} else if (!p2snapshot.exists()) {
		var p2 = player2.push({
			player: player,
			wins: 0,
			losses: 0
		});
		p2.onDisconnect().remove();
		$("#playerInfo").html("Hi " + player + "! You are Player 2");
	} else {
		$("#playerInfo").html("Sorry. Two people are already playing");
	};
})

$("#taunt").on("click", function() {
	event.preventDefault();
	$("#chatbox").append($("#messageBox").val(), "<br>");
	$("#messageBox").val("");
});