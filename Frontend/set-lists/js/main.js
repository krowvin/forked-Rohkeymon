import { buildDecklistTab, deletingFromDeck, decklistTabPrimer, removingFromDeck, initializeDecklistTab, getDecklist, getName, refreshDecklist } from "./decklistTab.js";



const BASE_SET_ONE_UNIQUES = 102
export var cardId = 0
export let decklist = {}
export let count = 0
export let decklistId = "44764e09-bf3d-11f0-a784-d8bbc1d9bfc1"; //hardcoded until multiple decklists supported

window.addEventListener('load', async function () {
  await loadDecklist(decklistId);
  const setList = document.getElementById("cardgrid")
  for (cardId; cardId < BASE_SET_ONE_UNIQUES; cardId++) {
    const card = document.createElement("div")
    const addToDeck = document.createElement("BUTTON")
    const img = document.createElement("img")
    addToDeck.className = 'grid-add-to-deck'
    addToDeck.id = `base1-${cardId + 1}`
    const removeFromDeck = document.createElement("BUTTON")
    removeFromDeck.className = 'remove-from-deck'

    addToDeck.addEventListener("click", async (event) => {
      //alert(`Attempting to add card ${addToDeck.id} to deck...`)
      await addingToDeck(addToDeck.id)

      //addingToDecklistTab(event.target.id)
    })
    removeFromDeck.innerText = '-'
    img.src = `https://images.pokemontcg.io/base1/${cardId + 1}.png`
    setList.appendChild(card)
    card.className = "card-item"
    addToDeck.appendChild(img)
    card.appendChild(addToDeck)


  }
  // NOTE: innerText for variables.
});

export async function loadDecklist(decklistId) {
  const response = await fetch(`/api/decklist/${decklistId}/cards-map`);
  const cardsMap = await response.json();

  // Populate the global decklist object
  decklist[decklistId] = cardsMap;
  // Now decklist is: {"44764e09...": {"base1-6": {count: 3}, "base1-4": {count: 2}}}
}

export async function addingToDeck(cardId) {
  document.getElementById(cardId).disabled = true
  if (!decklist[decklistId]) { // see if id's  in deck, init if not 
    decklist[decklistId] = {};
  }
  if (!decklist[decklistId][cardId]) {
    decklist[decklistId][cardId] = { count: 0 };
  }
  decklist[decklistId][cardId].count += 1;
  console.log(decklist[decklistId][cardId].count);
  /*if (decklist[decklistId][cardId].count >= 4) {
    alert("1st Maximum copies of card added to deck")
    decklist[decklistId][cardId].count -= 1;
    return;
  }*/
  console.log("decklist:", decklist);
  console.log("decklist[decklistId]:", decklist[decklistId]);
  console.log("cardId:", cardId);

  const response = await fetch("/api/add-to-deck", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({
      decklist_id: decklistId,
      card_id: cardId,
      card_copies: 1 //hardcoded to let API handle incrementing
    }),
  })
  if (response.ok) {
    const updatedCard = await response.json();
    console.log("Updated card:", updatedCard);
    decklist[decklistId][cardId].count = parseInt(updatedCard.card_copies);
    if (updatedCard.card_copies >= 4) {
      //document.getElementById(cardId).disabled = true
      alert("Maximum copies reached");
      //alert(decklist?.message?decklist.message:"Unknown Error.") Ternary operator
    }


  } else {
    decklist[decklistId][cardId].count -= 1;
  }
  refreshDecklist();

  document.getElementById(cardId).disabled = false
}


