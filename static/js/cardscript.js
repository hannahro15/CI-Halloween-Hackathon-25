const container = document.getElementById("cardContainer");
let isDragging = false;
let startX = 0;
let currentCard = null;
const cardColors = [
  "#ac85b2",
  "#ff6f40",
  "#a7ac21",
  "#fc9a99",
  "#fdbe70",
  "#ff7f00",
  "#cab2d6",
];
// remove the hardcoded color/card loop and instead fetch cats from the server
document.addEventListener('DOMContentLoaded', () => {

  // fetch cats from the new API and append to container (top-to-bottom order)
  fetch('/api/cats/')
    .then((r) => r.json())
    .then((payload) => {
      const cats = payload.cats || [];
      // append in order so the last card becomes the top one (your getTopCard uses :last-child)
      cats.forEach((cat) => {
        const card = buildCard(cat);
        container.appendChild(card);
      });
    })
    .catch((err) => {
      console.error('Could not load cats:', err);
    });
});

// build card element from a cat object
function buildCard(cat) {
  const card = document.createElement('div');
  
  card.className = 'swipe-card'; 
  
  cardColourNum = cat.id % cardColors.length;
  card.style.backgroundColor = cardColors[cardColourNum];
  
  const content = document.createElement('div');

  content.className = 'card-content';

   { //Image
    const img = document.createElement('img');
    if (cat.image_url) {
      img.src = cat.image_url;
    } else { img.src = "{% static 'images/placeholder.webp' %}"; }
    
    img.alt = cat.name;
    img.className = 'card-image';
    content.appendChild(img);
  }

  const h3 = document.createElement('h3');
  h3.className = 'card-title m-0 p-0';
  h3.textContent = cat.name;
  content.appendChild(h3);

  const pSpecial = document.createElement('p');
  pSpecial.className = 'card-speciality m-0 p-0';
  pSpecial.textContent = cat.speciality || '';
  content.appendChild(pSpecial);

  const pBio = document.createElement('p');
  pBio.className = 'card-bio m-0 p-0';
  pBio.textContent = cat.biography || '';
  content.appendChild(pBio);

  card.setAttribute("data-cat-id", cat.id);
  card.appendChild(content);
  return card;
}

// helper: read cookie (for csrftoken)
function getCookie(name) {
  const v = document.cookie.split("; ").find((row) => row.startsWith(name + "="));
  return v ? decodeURIComponent(v.split("=")[1]) : null;
}

function getTopCard() {
  if (!container) return null;
  return container.querySelector(".swipe-card:last-child");
}

/* Pointer handlers (mouse + touch) */
container.addEventListener("mousedown", (e) => {
  currentCard = getTopCard();
  console.log("Mouse down!");
  if (!currentCard) return;
  isDragging = true;
  startX = e.clientX;
  currentCard.style.transition = "none";
});

window.addEventListener("mousemove", (e) => {
  if (!isDragging || !currentCard) return;
  const deltaX = e.clientX - startX;
  currentCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 10}deg)`;
});

window.addEventListener("mouseup", (e) => {
  if (!isDragging || !currentCard) return;
  const deltaX = e.clientX - startX;
  handleSwipe(deltaX);
});

/* Touch support */
container?.addEventListener("touchstart", (e) => {
  currentCard = getTopCard();
  if (!currentCard) return;
  isDragging = true;
  startX = e.touches[0].clientX;
  currentCard.style.transition = "none";
});

window.addEventListener(
  "touchmove",
  (e) => {
    if (!isDragging || !currentCard) return;
    const deltaX = e.touches[0].clientX - startX;
    currentCard.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 10}deg)`;
  },
  { passive: true }
);

window.addEventListener("touchend", (e) => {
  if (!isDragging || !currentCard) return;
  const deltaX = e.changedTouches[0].clientX - startX;
  handleSwipe(deltaX);
});

/* Core swipe logic + optional API call (right swipe adds candidate) */
function handleSwipe(deltaX) {
  const sensitivity = 75;
  if (!currentCard) {
    isDragging = false;
    return;
  }
  const catIdRaw =
    (currentCard && (
      currentCard.dataset.catId ??
      currentCard.dataset.catID ??
      currentCard.getAttribute("data-cat-id") ??
      currentCard.getAttribute("data-catID")
    )) || null;
  const catId = catIdRaw ? parseInt(catIdRaw, 10) : null;

  if (Math.abs(deltaX) > sensitivity) {
    currentCard.style.transition = "transform 0.4s ease, opacity 0.4s ease";
    currentCard.style.transform = `translateX(${
      deltaX > 0 ? 1000 : -1000
    }px) rotate(${deltaX > 0 ? 45 : -45}deg)`;
    currentCard.style.opacity = 0;

    // POST when swiped right
    if (deltaX > 0 && catId) {
      const csrftoken = getCookie("csrftoken");
      fetch(`/add_to_list/${catId}/`, {            // <-- make path absolute (leading '/')
        method: "POST",
        headers: {
          "X-CSRFToken": csrftoken || "",
        },
        credentials: "same-origin",
      })
        .then((res) => {
          if (res.status === 403) {
            // not authenticated: redirect to allauth login
            window.location.href = `/accounts/login/?next=${encodeURIComponent(window.location.pathname)}`;
            throw new Error("authentication required");
          }
          if (!res.ok) throw new Error("network response was not ok");
          return res.json().catch(() => ({}));
        })
        .then((data) => {
          container.dispatchEvent(
            new CustomEvent("catAccepted", { detail: { catId: catId, response: data } })
          );
        })
        .catch((err) => {
          console.error("Could not add candidate:", err);
        });
    }

    setTimeout(() => {
      currentCard.remove();
      currentCard = null;
    }, 400);
  } else {
    currentCard.style.transition = "transform 0.3s ease";
    currentCard.style.transform = "translateX(0) rotate(0)";
    currentCard = null;
  }
  isDragging = false;
}

/* Optional hook for other UI code */
container?.addEventListener("catAccepted", (e) => {
  // e.detail = { catId, response }
});