//alert("This is working fine:");

//Here are the three colours in the button
var buttonColours=["red", "blue", "green", "yellow"];

//Game Pattern
var gamePattern= [];

//Generating the Sequence,which button is to be pressed
 function nextSequence(){
    // var randomNumber=Math.random();
    // randomNumber=randomNumber*4;
    // randomNumber=Math.floor(randomNumber);
    var randomNumber=Math.floor(Math.random()*4);


    //selecting the random color with the random number from colours available
var randomChosenColour=buttonColours[randomNumber];

//Now putting the chossen colour in the gamePattern array
gamePattern.push(randomChosenColour);

//Now Selecting the clicked buttonId from the randomchosenColour and adding flash while clicked
$("#" + randomChosenColour).fadeIn(100).fadeOut(100);fadeIn(100);

var audio=new Audio("sounds/"+randomChosenColour+".mp3");
audio.play();

}


