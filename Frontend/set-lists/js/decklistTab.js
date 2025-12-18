// The idea here is you can give this ANY array of card objects and it will build the decklist tab
function buildDeckListTab(cards = [{ name: "Pikachu", quantity: 2 }]) {
  /* 
    Builds a list of decklist items from an array of card objects. Each card object should have:
    - name: The name of the card
    - quantity: The number of copies in the decklist

    Returns:
    An array of HTMLDivElement objects representing each card in the decklist

  */
  return cards.map(({ name: cardName, quantity, cardClassName }) => {
    const pokemonCard = document.createElement("div");
    pokemonCard.className = "pokemonCard";
    // Example of how you could override the class name if needed for one or more cards in the array
    if (cardClassName) {
      pokemonCard.classList.add(cardClassName);
    }
    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.innerText = cardName;

    const quantityDiv = document.createElement("div");
    quantityDiv.className = "quantity";
    quantityDiv.innerText = quantity;

    pokemonCard.appendChild(nameDiv);
    pokemonCard.appendChild(quantityDiv);
    return pokemonCard;
  });
}

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

window.addEventListener("load", function () {
  // Setup click handlers before making any API calls
  initializeDecklistTab();

  // Do your fetch here after the DOM is ready to get your cards from the API
  const cards = [
    { name: "Pikachu", quantity: 2 },
    { name: "Charizard", quantity: 1, cardClassName: "rareCard" },
    { name: "Bulbasaur", quantity: 3 },
  ];
  // Query the already built HTML and add the decklist elements to it
  // The ... is a spread operator that expands the array into individual elements
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
  // this means append() gets multiple arguments instead of a single array
  // like saying append([elem1, elem2, elem3]) but shorter syntax
  document.querySelector(".decklist").append(...buildDeckListTab(cards));
});
