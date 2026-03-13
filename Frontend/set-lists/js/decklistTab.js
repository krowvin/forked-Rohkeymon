import { cardId, decklist, count, decklistId, addingToDeck, loadDecklist } from "./main.js";

document.addEventListener('click', e => {
  const isDropdownButton = e.target.matches("[data-dropdown-button]")
  if (!isDropdownButton && e.target.closest('[data-dropdown]') != null) return

  let currentDropdown
  if (isDropdownButton) {
    currentDropdown = e.target.closest('[data-dropdown]')
    currentDropdown.classList.toggle('active')
  }

  document.querySelectorAll("[data-dropdown].active").forEach(dropdown => {
    if (dropdown === currentDropdown) return
    dropdown.classList.remove("active")
  })
})


export async function getName(card_id) {
  try {
    const response = await fetch(`https://api.tcgdex.net/v2/en/cards/${card_id}`);
    if (response.ok) {
      const data = await response.json();
      console.log(data.name);
      return data.name;
    } else {
      throw new Error('Failed to fetch decklist');
    }
  } catch (error) {
    console.error(error);
  }
}

export function buildDecklistTab(cards) {
  /*
  Builds decklist of cards from array of card objects. 
  Card objects should have name and quantity. 
  Returns HTMLDivElement objects representing each card.
  */
  return cards.map(({ card_copies, card_id, card_name }) => {
    const pokemonCard = document.createElement("div");
    pokemonCard.className = "pokemonCard";
    /*Can override class name for card(s) in the array if needed. Maybe use this to label energy cards because they can be > 4 copies. 
    if (cardClassName) {
      pokemonCard.classList.add(cardclassName);
    }*/
    const nameDiv = document.createElement("div");
    nameDiv.className = "name";
    nameDiv.innerText = card_name;

    const copiesDiv = document.createElement("div");
    copiesDiv.className = "copies";
    copiesDiv.innerText = card_copies;

    const addToDeck = document.createElement("BUTTON");
    addToDeck.innerText = '+';
    addToDeck.className = 'add-to-deck';
    addToDeck.id = card_id;
    addToDeck.addEventListener("click", async (event) => {
      //alert(`Adding card ${addToDeck.id} to deck.`)
      await addingToDeck(addToDeck.id)
    });

    const removeFromDeck = document.createElement("BUTTON");
    removeFromDeck.innerText = '-';
    removeFromDeck.className = 'remove-from-deck';
    removeFromDeck.id = card_id;
    removeFromDeck.addEventListener("click", async (event) => {
      //alert(`Removing card ${removeFromDeck.id} from deck.`)
      await removingFromDeck(removeFromDeck.id)


    })

    const deleteFromDeck = document.createElement("BUTTON");
    const deleteImg = document.createElement("img");
    deleteImg.src = "./assets/trashcan.png";
    deleteFromDeck.appendChild(deleteImg);
    deleteFromDeck.className = 'delete-from-deck';
    deleteFromDeck.id = card_id;
    deleteFromDeck.addEventListener("click", async (event) => {
      alert(`Deleting entry ${deleteFromDeck.id} from decklist.`)
      await deletingFromDeck(deleteFromDeck.id)


    })

    pokemonCard.appendChild(nameDiv);
    pokemonCard.appendChild(addToDeck);
    pokemonCard.appendChild(copiesDiv);
    pokemonCard.appendChild(removeFromDeck);
    pokemonCard.appendChild(deleteFromDeck);
    return pokemonCard;
  });
}

export async function getDecklist(decklistId) {
  try {
    const response = await fetch(`/api/decklist/${decklistId}/cards-map`);
    if (response.ok) {
      const cardsMap = await response.json();
      //console.log(data);
      const decklistArray = Object.entries(cardsMap).map(([cardId, cardData]) => ({
        card_id: cardId,
        card_copies: cardData.count
      }));
      return decklistArray;
    } else {
      throw new Error('Failed to fetch decklist');
    }
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

export function initializeDecklistTab() {
  let decklistButton = document.querySelector('.decklistButton');
  let closeDecklist = document.querySelector('.close');
  let toggleContainer = document.querySelector('#decklistContainer');

  decklistButton.addEventListener('click', () => {
    toggleContainer.classList.toggle('showDecklist');
  });

  closeDecklist.addEventListener('click', () => {
    toggleContainer.classList.toggle('showDecklist');
  });
};

export async function decklistTabPrimer() {
  //TODO: click handlers - disable addToDeck button

  initializeDecklistTab();

  const decklistArray = await getDecklist(decklistId); //This fetch gets decklist card objects from API

  if (!decklistArray || !Array.isArray(decklistArray)) {
    console.error('Decklist not loaded or wrong format loaded');
    return;
  }

  //TODO: figure out how to get decklist to show contents without needing to refresh page. 

  const cards = await Promise.all(
    decklistArray.map(async (card) => {
      const cardName = await getName(card.card_id);
      return {
        ...card, //Instead of returning properties manually, allows new properties to be added later on
        card_name: cardName
      };
    })
  );
  console.log(cards);

  document.querySelector(".decklist").append(...buildDecklistTab(cards));

  //TODO: click handlers - reenable addToDeck button 
};

window.addEventListener("load", () => decklistTabPrimer())

export async function removingFromDeck(cardId) {
  console.log(cardId);

  if (!decklist[decklistId]) { // see if id's in deck, init if not 
    decklist[decklistId] = {};
  }
  if (decklist[decklistId][cardId].count) {
    console.log(decklist[decklistId][cardId].count + " (Before)");
  }
  if (!decklist[decklistId][cardId]) {
    decklist[decklistId][cardId] = { count: 0 }; //If no decklist exists, initialize object values
  }
  //console.log(decklist[decklistId][cardId].count + " (Before)");

  decklist[decklistId][cardId].count = decklist[decklistId][cardId].count - 1;
  if (decklist[decklistId][cardId].count < 0) { //If somehow count is negative, set to 0.
    decklist[decklistId][cardId].count = 0;
    return;
  }
  console.log(decklist[decklistId][cardId].count + " (After)");
  const response = await fetch("/api/decrement-copies", {
    method: "PATCH",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({
      decklist_id: decklistId,
      card_id: cardId,
      card_copies: 1 //hardcoded to let API handle decrementing
    }),
  })
  if (response.ok) {
    const updatedDecklist = await response.json();
  } else {
    decklist[decklistId][cardId].count += 1;
  }
  refreshDecklist();
};

export async function deletingFromDeck(cardId) {
  //console.log(decklist[decklistId][cardId]);
  if (!decklist[decklistId]) { // If wrong deck id, exit. 
    return;
  }
  console.log(cardId);
  const response = await fetch("/api/delete-entry", {
    method: "DELETE",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({
      decklist_id: decklistId,
      card_id: cardId
    }),
  })
  if (response.ok) {
    console.log("Deleted entry successfully.");
  }
  refreshDecklist();
};

export async function refreshDecklist() {
  const decklistArray = await getDecklist(decklistId); //This fetch gets decklist card objects from API

  if (!decklistArray || !Array.isArray(decklistArray)) {
    console.error('Decklist not loaded or wrong format loaded');
    return;
  }

  const cards = await Promise.all(
    decklistArray.map(async (card) => {
      const cardName = await getName(card.card_id);
      return {
        ...card, //Instead of returning properties manually, allows new properties to be added later on
        card_name: cardName
      };
    })
  );
  console.log(cards);

  document.querySelector(".decklist").replaceChildren(...buildDecklistTab(cards));
};



