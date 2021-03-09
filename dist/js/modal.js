'use strict';

//reference code


var modal = document.getElementById("myModal");


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
}

let modalHeading = document.createElement('h1');
  modalHeading.textContent = 'Edit your Statement';
  modal.appendChild(modalHeading);
