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
var player1 = "Waiting for Player 1"
var player2 = "Waiting for Player 2"

$("#playerInfo").html("<input id=playerName type=text placeholder=Name><input id=enterPlayer type=submit>");

var player1 = function() {
	$("#player1").html(player1);
};
var player2 = function() {
	$("#player2").html(player2);
};

$("#enterPlayer").on("click", function() {
	connectionsRef.once("value", function(snapshot){
		event.preventDefault();
		if (snapshot.numChildren() == 0){
			var con = connectionsRef.push({
				player1: $("#playerName").val(),
				wins: 0,
				losses: 0
			});
			con.onDisconnect().remove();
			connectionsRef.once("child_added", function(snapshot) {
				player1 = snapshot.val().player1;
				$("#player1Info").html("Hi " + player1 + "! You are Player 1");
				$("#player1").html(player1);
				$("#playerInfo").empty();
			}, function(errorObject) {
				console.log("The read failed: " + errorObject.code);
			});	
		} else if (snapshot.numChildren() == 1) {
			var con = connectionsRef.push({
				player2: $("#playerName").val(),
				wins: 0,
				losses: 0
			});
			con.onDisconnect().remove();
			connectionsRef.once("child_added", function(snapshot) {
				player2 = snapshot.val().player2;
				$("#player2Info").html("Hi " + player2 + "! You are Player 2");
				$("#player2").html(player2);
				$("#playerInfo").empty();
			}, function(errorObject) {
				console.log("The read failed: " + errorObject.code);
			});							
		} else {
			console.log("test");
			$("#player1Info").html("Sorry, two people are already playing");
		};
	}, function(errorObject) {
		console.log("The read failed: " + errorObject.code);
	});	
	
});

database.ref().on("value", function(snapshot) {
	player1 = 
	$("#player1").html(snapshot.val().player1);
}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});


$("#taunt").on("click", function() {
	event.preventDefault();
	$("#chatbox").append($("#messageBox").val(), "<br>");
	$("#messageBox").val("");
});


