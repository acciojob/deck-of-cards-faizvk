//your code here

const cards = document.querySelectorAll(".whitebox2");
const deck = document.getElementById("deck");
const holders = document.querySelectorAll("#types .placed");
const wonBox = document.getElementById("won");
const resetBtn = document.getElementById("reset");
const shuffleBtn = document.getElementById("shuffle");

let draggedCard = null;

// map holder index -> suit letter used in filenames
// order in HTML: club, diamond, heart, spade
const holderSuit = ["C", "D", "H", "S"];

// ----------------- Helpers -----------------

function getSuitFromCard(card) {
  const img = card.querySelector("img");
  const src = img.src;
  // filenames like 10C.jpg, 2S.jpg etc
  return src[src.lastIndexOf("/") + 1].replace(".jpg", "").slice(-1);
}

function saveState() {
  const state = {
    deck: [...deck.children].map(w => w.innerHTML),
    holders: [...holders].map(h => h.innerHTML)
  };
  localStorage.setItem("deckState", JSON.stringify(state));
}

function loadState() {
  const state = JSON.parse(localStorage.getItem("deckState"));
  if (!state) return;

  deck.innerHTML = "";
  state.deck.forEach(html => {
    const div = document.createElement("div");
    div.className = "whitebox";
    div.innerHTML = html;
    deck.appendChild(div);
  });

  holders.forEach((h, i) => (h.innerHTML = state.holders[i]));

  // rebind drag events after restoring DOM
  bindCards();
}

function checkWin() {
  // all cards placed if deck is empty
  if (deck.querySelectorAll(".whitebox2").length === 0) {
    wonBox.style.display = "flex";
  }
}

// ----------------- Drag Logic -----------------

function bindCards() {
  document.querySelectorAll(".whitebox2").forEach(card => {
    card.addEventListener("dragstart", e => {
      draggedCard = card;
      setTimeout(() => card.classList.add("hide"), 0);
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("hide");
      draggedCard = null;
      saveState();
      checkWin();
    });
  });
}

holders.forEach((holder, index) => {
  holder.addEventListener("dragover", e => e.preventDefault());

  holder.addEventListener("drop", () => {
    if (!draggedCard) return;

    const cardSuit = getSuitFromCard(draggedCard);
    const requiredSuit = holderSuit[index];

    // only allow correct suit
    if (cardSuit === requiredSuit) {
      holder.appendChild(draggedCard);
    }
  });
});

// ----------------- Shuffle / Reset -----------------

shuffleBtn.addEventListener("click", () => {
  const whiteboxes = [...deck.children];
  for (let i = whiteboxes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    deck.appendChild(whiteboxes[j]);
  }
  saveState();
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem("deckState");
  location.reload();
});

// ----------------- Init -----------------

bindCards();
loadState();

