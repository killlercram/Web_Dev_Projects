//alert("Working");
//this is for the first one
var randomNumber1=Math.floor(Math.random()*6)+1;
var randomDiceImage="dice"+randomNumber1+".png";//image from dice 1 to dice 6
var randomImageSource="images/"+randomDiceImage;//source from where the image is being selected
var image1=document.querySelectorAll("img")[0];//[0]-this at last specify that we are selecting the first one in all the other imgs
image1.setAttribute("src",randomImageSource);

//now this is  for the second image
var randomNumber2=Math.floor(Math.random()*6)+1;
var randomDiceImage2="images/dice"+randomNumber2+".png";
var image2=document.querySelectorAll("img")[1].setAttribute("src",randomDiceImage2);

if(randomNumber1>randomNumber2){
    document.querySelector("h1").innerHTML="Player 1 is the winner:";
}else if(randomNumber2>randomNumber1){
    document.querySelector("h1").innerHTML="Player 2 is the winner:";
}else{
    document.querySelector("h1").innerHTML="Tie Reshuffle";
}
