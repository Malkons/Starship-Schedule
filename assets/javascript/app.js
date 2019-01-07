// firebase config from google
var config = {
    apiKey: "AIzaSyCs3K5zwuOuS0odq89IpPLC7HnXTOcDqgI",
    authDomain: "https://train-schedule-f4c80.firebaseapp.com",
    databaseURL: "https://train-schedule-f4c80.firebaseio.com",
    projectId: "train-schedule-f4c80",
    storageBucket: ""
};

// initializing firebase
firebase.initializeApp(config);

// setting up variables
var database = firebase.database();
var trainName = "";
var destination = "";
var firstTime = 0;
var frequency = 0;



// event listener for the submit button
$("#form-submit").on("click", function (event) {

    // prevent page from refreshing when the submit button is hit
    event.preventDefault();

    // getting the values from field inputs
    trainName = $("#train-name").val().trim();
    destination = $("#destination").val().trim();
    firstTime = $("#first-train").val().trim();
    frequency = $("#frequency").val().trim();

    // pushing an object to firebase
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTime: firstTime,
        frequency: frequency
    });
});


// adding to firebase
database.ref().on("child_added", function (snapshot) {
    var newTrainName = snapshot.val().trainName;
    var newDestination = snapshot.val().destination;
    var newFirstTime = snapshot.val().firstTime;
    var newFrequency = snapshot.val().frequency;

    // first Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(newFirstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // sifference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // time apart (remainder)
    var tRemainder = diffTime % newFrequency;
    console.log(tRemainder);

    // minute Until Train
    var tMinutesTillTrain = newFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // console log everything
    console.log(newTrainName);
    console.log(newDestination);
    console.log(newFirstTime);
    console.log(newFrequency);

    // create a row with the new train info
    var newRow = $("<tr>").append(
        $("<td>").text(newTrainName),
        $("<td>").text(newDestination),
        $("<td>").text(newFrequency),
        $("<td>").text(moment(nextTrain).format("hh:mm a")),
        $("<td>").text(tMinutesTillTrain)
    );

    // append the row to the website
    $("table tbody").append(newRow);
});


