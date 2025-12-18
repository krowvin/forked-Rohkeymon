document.querySelector("#decklistContainer");

// fetch("/templates/decklistTab.template.html?v=1").then(r=>r.text()).then(d=>{
//   //console.log(d); /*Subject to CSS if user input is introduced*/
//   document.getElementById("decklistContainer").innerHTML=d;
//   // NOTE: innerText for variables.
//   initializeDecklistTab();
// });
function initializeDecklistTab() {
  let decklistButton = document.querySelector(".decklistButton");
  let closeDecklist = document.querySelector(".close");
  let toggleContainer = document.querySelector("#decklistContainer");

  decklistButton.addEventListener("click", () => {
    toggleContainer.classList.toggle("showDecklist");
  });

  closeDecklist.addEventListener("click", () => {
    toggleContainer.classList.toggle("showDecklist");
  });
}
