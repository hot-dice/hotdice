
let rollingDice = document.querySelector("rolling-dice");

function handleClick(event) {
  
  let dieClicked = event.target.getAttribute("id");
  
  // invoke function to roll dice and either replace the target with the corresponding die image or preload all images and bring forward using z-index 
  
}

rollingDice.addEventListener('click', handleClick);