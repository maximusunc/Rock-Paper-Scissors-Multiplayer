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

var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");
var addPlayer;

$("#playerInfo").html("<input id=playerName type=text placeholder=Name><input id=enterPlayer type=submit>");

var player1 = function() {
	$("#player1").html("test");
};
var player2 = function() {
	$("#player2").html("test");
};

$("#enterPlayer").on("click", function() {
	connectionsRef.once("value", function(snapshot){
		event.preventDefault();
		if (snapshot.numChildren() == 0){
			console.log("test");
			var con = connectionsRef.push({
				player1: $("#playerName").val(),
				wins: 0,
				losses: 0
			});
			con.onDisconnect().remove();
			$("#player1Info").html("Hi " + $("#playerName").val() + "! You are Player 1");
			$("#playerInfo").empty();
			player1();
		} else if (snapshot.numChildren() == 1) {
			console.log("test");
			var con = connectionsRef.push({
				player2: $("#playerName").val(),
				wins: 0,
				losses: 0
			});
			con.onDisconnect().remove();
			$("#player2Info").html("Hi " + $("#playerName").val() + "! You are Player 2");
			$("#playerInfo").empty();
		} else {
			console.log("test");
			$("#player1Info").html("Sorry, two people are already playing");
		};
	});
	
});


