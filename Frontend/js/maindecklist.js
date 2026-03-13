window.addEventListener('load', function () {

  const setList = document.getElementById("pokemonlist")
  fetch("/api/alldata").then(r => r.json()).then(d => {
    d.forEach(
      p => {
        const card = document.createElement("div")
        const img = document.createElement("img")
        img.src = `https://images.pokemontcg.io/base1/${p.card_id}.png`
        card.className = "card-item"
        card.appendChild(img)
        setList.appendChild(card)
      }
    )
    console.log(d); /*Subject to CSS if user input is introduced*/

    // NOTE: innerText for variables.
  })
});

//<div class="card-item">
//<img src="https://images.pokemontcg.io/xy1/1.png" width="100" />
//</div>

//https://images.pokemontcg.io/base1/1.png

//input box where typing names calls 3rd party api to bring up cards with + button to add card to user's deck
