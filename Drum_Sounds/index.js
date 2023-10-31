//this is tell what will happen when we will press the first button
// document.querySelector("button").addEventListener("click",handleClick);
// function handleClick() {
//     alert("I got clicked:"); 
// }

//this will now do for all the buttons what will happen with then when we click them

/*
var numberOfButtons=document.querySelectorAll(".drum").length;//thiw tells us the total number of drums

//this will detect the clicks
for(var i=0;i<numberOfButtons;i++){
    document.querySelectorAll(".drum")[i].addEventListener("click",function(){ 


        // this will play the song when the drum will be clicked
           // var audio=new Audio("sounds/tom-1.mp3");
          // audio.play();

        //who this audio is working how this is made

        // function Audio(filePath) {
          //  this.filePath=filePath;
          //  this.play=function(){}
            
        // }


        //Now we will create diff sound for diff drums 

        var drumName= this.innerHTML;//this will tell us which drum is pressed
        
        makeSound(drumName);

        //this will add animation to the particular click
        addAnimation(drumName);

      
    });
}
// this will detect the keypressed
document.addEventListener("keydown",function (event) {
    makeSound(event.key);

    //this will add animation to the particular key
    addAnimation(event.key);
});


//this will play the sound if the input is of click or of keys
function makeSound(key){

      //Now we will switch the sound according to the output we will get
      switch (key) {
        case "w":
        var tom1=new Audio("sounds/tom-1.mp3");
        tom1.play();                
        break;
        case "a":
        var tom2=new Audio("sounds/tom-2.mp3");
        tom2.play();                
        break;
        case "s":
        var tom3=new Audio("sounds/tom-3.mp3");
        tom3.play();                
        break;
        case "d":
        var tom4=new Audio("sounds/tom-4.mp3");
        tom4.play();                
        break;
        case "j":
        var snare=new Audio("sounds/snare.mp3");
        snare.play();                
        break;
        case "k":
        var crash=new Audio("sounds/crash.mp3");
        crash.play();                
        break;
        case "l":
        var kick=new Audio("sounds/kick-bass.mp3");
        kick.play();                
        break;
    
        default:
            console.log(drumName);
    }
   

}

function addAnimation(currentKey) {
   var currentKeyPre= document.querySelector("."+currentKey);
   currentKeyPre.classList.add("pressed");

   //this will make the button to come back to its orignal way
   setTimeout(function () {
    currentKeyPre.classList.remove("pressed");
    
   },100);    
}
*/

// Upper one the java script code and now we will minify this code using online minifier so that it will load more faster 

//Now this is same code as above only minified
for(var numberOfButtons=document.querySelectorAll(".drum").length,i=0;i<numberOfButtons;i++)document.querySelectorAll(".drum")[i].addEventListener("click",(function(){var e=this.innerHTML;makeSound(e),addAnimation(e)}));function makeSound(e){switch(e){case"w":new Audio("sounds/tom-1.mp3").play();break;case"a":new Audio("sounds/tom-2.mp3").play();break;case"s":new Audio("sounds/tom-3.mp3").play();break;case"d":new Audio("sounds/tom-4.mp3").play();break;case"j":new Audio("sounds/snare.mp3").play();break;case"k":new Audio("sounds/crash.mp3").play();break;case"l":new Audio("sounds/kick-bass.mp3").play();break;default:console.log(drumName)}}function addAnimation(e){var n=document.querySelector("."+e);n.classList.add("pressed"),setTimeout((function(){n.classList.remove("pressed")}),100)}document.addEventListener("keydown",(function(e){makeSound(e.key),addAnimation(e.key)}));
  