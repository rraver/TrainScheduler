//Configuration for public train project in firebase database
  var config = {
    apiKey: "AIzaSyCWczj5cibDjP3nOsiQ1Y5v8gznjPrX1YI",
    authDomain: "trainscheduler-77103.firebaseapp.com",
    databaseURL: "https://trainscheduler-77103.firebaseio.com",
    projectId: "trainscheduler-77103",
    storageBucket: "trainscheduler-77103.appspot.com",
    messagingSenderId: "544266377345"
  };

//Initialize database and set database variable with form variables
    firebase.initializeApp(config);
    var database = firebase.database();
    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";
    var timeTranslated = "";
    var currentTime = "";
    var timeDifference = "";
    var trainRemainder = "";
    var trainTimeLeft = "";
    var nextTrain = "";

//On click for the submit button in the form
    $("#submit").on("click", function(event) {
//Prevents the reset from the submit button
      event.preventDefault();
//Calculate the time train and format the outputs
      trainName = $("#trainName").val().trim();
      destination = $("#destination").val().trim();
      firstTrainTime = $("#firstTrainTime").val().trim();
      frequency = $("#frequency").val().trim();
      timeTranslated = moment(firstTrainTime, "hh:mm").subtract(1, "years");
      currentTime = moment();
      timeDifference = moment().diff(moment(timeTranslated), "minutes");
      trainRemainder = timeDifference % frequency;
      trainTimeLeft = frequency - trainRemainder;
      nextTrain = moment().add(trainTimeLeft, 'm').format('h:mm');

//Update the database with entered data
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
      });
    });

//Trigger for anytime a child is added to the firebase database
    database.ref().on("child_added", function(childSnapshot) {
      $("#trainTable").find('tbody')
        .append($('<tr>')
            .append($('<td>')
                .append(childSnapshot.val().trainName)
            )
            .append($('<td>')
              .append(childSnapshot.val().destination)
            )
            .append($('<td>')
              .append(childSnapshot.val().frequency)
            )
            .append($('<td>')
              .append(nextTrain)
            )
            .append($('<td>')
              .append(trainTimeLeft)
            )
        );
    // Console log any errrors that might of happened access database children add method
    }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
    });
