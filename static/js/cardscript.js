const container = document.getElementById("cardContainer");
let isDragging = false;
let startX = 0;
let startY = 0;                // <--- new
let currentCard = null;
let isTouchScrolling = null;   // <--- new
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
      cats.forEach((cat) => {
        const card = buildCard(cat);

        // append card to DOM BEFORE measuring
        container.appendChild(card);

        // measure after layout so sizes are correct
        requestAnimationFrame(() => {
          const contentEl = card.querySelector('.card-content');
          const titleEl = card.querySelector('.card-title');
          const textContentEl = card.querySelector('.card-breed');
          

          if (contentEl && titleEl) {
            const textContentRect = textContentEl.getBoundingClientRect();
            const titleRect = titleEl.getBoundingClientRect();

            // distance from top of title down to bottom of visible content area (px)
            let fadeSize = Math.max(0, textContentRect.bottom - titleRect.top);
            

            // small offset so the gradient doesn't cover the title itself (tweak if needed)
            fadeSize = Math.max(0, fadeSize - 4);

            // set CSS var used by your .content-end-fade (set on card and on content)
            card.style.setProperty('--fade-size', `${fadeSize}px`);
            contentEl.style.setProperty('--fade-size', `${fadeSize}px`);
            // ensure padding var matches CSS pad if you rely on it:
            contentEl.style.setProperty('--pad', '0px');

            console.log(`textContentRect Bottom is ${textContentRect.bottom} 
              Title top is ${titleRect.top}
              Fade Size is: ${fadeSize}
              `);
          }

          // optional: set --fade-top for absolute overlay if you use it
          if (titleEl) {
            const cardRect = card.getBoundingClientRect();
            const offsetFromCardTop = titleEl.getBoundingClientRect().top - cardRect.top;
            card.style.setProperty('--fade-top', `${offsetFromCardTop + 4}px`);
          }
        });
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
  h3.className = 'card-title card-text-content px-3';
  h3.textContent = `${cat.name}, ${cat.age}`;
  content.appendChild(h3);

  const pDistance = document.createElement('p');
  pDistance.className = 'card-distance card-text-content px-3';
  pDistance.textContent = `${cat.distance || ''} miles away`;
  content.appendChild(pDistance);

  const pBio = document.createElement('p');
  pBio.className = 'card-bio card-text-content px-3';
  pBio.textContent = cat.biography || '';
  content.appendChild(pBio);

  const pSpecial = document.createElement('p');
  pSpecial.className = 'card-speciality card-text-content px-3 mb-1';
  pSpecial.textContent = `Speciality: ${cat.speciality || ''}`;
  content.appendChild(pSpecial);

  const pBreed = document.createElement('p');
  pBreed.className = 'card-breed card-text-content px-3';
  pBreed.textContent = `Breed: ${cat.breed || ''}`;
  content.appendChild(pBreed);

  // add an in-flow fade element that sits at the end of the content and overlaps
  const endFade = document.createElement('div');
  endFade.className = 'content-end-fade';
  // optionally tune per-card: endFade.style.setProperty('--fade-size', '120px');
  content.appendChild(endFade);

  card.setAttribute("data-cat-id", cat.id);
  card.appendChild(content);

  // DO NOT measure here — return and let caller append + measure
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
  isTouchScrolling = null;            // reset per-touch
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  currentCard.style.transition = "none";
});

// Note: remove passive: true so we can call preventDefault() when needed.
window.addEventListener(
  "touchmove",
  (e) => {
    if (!isDragging || !currentCard) return;

    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    // Determine intent on first move: vertical scroll vs horizontal swipe
    if (isTouchScrolling === null) {
      const contentEl = currentCard.querySelector(".card-content");
      const canScrollVertically =
        contentEl && contentEl.scrollHeight > contentEl.clientHeight;
      // prefer vertical if vertical movement larger and inner content can scroll
      isTouchScrolling = Math.abs(dy) > Math.abs(dx) && canScrollVertically;
    }

    if (isTouchScrolling) {
      // Allow browser to scroll inner .card-content naturally.
      // But ensure the scroll is applied to inner content rather than the page:
      // If the touch originated over the inner content, do nothing here.
      return;
    } else {
      // Horizontal swipe: prevent page vertical scroll while swiping
      e.preventDefault();
      currentCard.style.transform = `translateX(${dx}px) rotate(${dx / 10}deg)`;
    }
  },
  { passive: false }
);

window.addEventListener("touchend", (e) => {
  if (!isDragging || !currentCard) return;
  // If it was a vertical scroll gesture, just clear state and don't treat as a swipe.
  if (isTouchScrolling) {
    isDragging = false;
    currentCard = null;
    isTouchScrolling = null;
    return;
  }
  const deltaX = (e.changedTouches[0].clientX || 0) - startX;
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
    }, 100);
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