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

connectedRef.on("value", function(snap) {
	if (snap.val()) {
		var con = connectionsRef.push(true);
		con.onDisconnect().remove();
	}
});

connectionsRef.on("value", function(snap) {
	$("#playerInfo").html("<input id=playerName type=text placeholder=Name><input id=enterPlayer type=submit>");
	$("#enterPlayer").on("click", function() {
		event.preventDefault();
		if (snap.numChildren() == 1) {
			$("#playerInfo1").html("Hi " + $("#playerName").val() + "! You are Player 1");
		} else if (snap.numChildren() == 2) {
			$("#playerInfo2").html("Hi " + $("#playerName").val() + "! You are Player 2");
		} else {
			$("#playerInfo").html("Sorry, two people are already playing");
		};
	});
})