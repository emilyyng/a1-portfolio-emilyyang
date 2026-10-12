const SITE_ROOT = new URL("./", document.currentScript.src).href;
const PROJECTS_URL = new URL("data/projects.json", SITE_ROOT).href;
const imgUrl = (path) => new URL(path, SITE_ROOT).href;

// SCROLLING ANIMATION ON HOME PAGE
document.addEventListener("DOMContentLoaded", () => {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-scroll');
            } else {
                entry.target.classList.remove('active-scroll');
            }
        });
    }, {
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    });

    document.querySelectorAll('.revealable').forEach(el => {
        revealObserver.observe(el);
    });
});


// PROJECTS CAROUSEL ON HOME PAGE
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.querySelector(".carousel-card");
    if (!carouselContainer) return;

    let projects = [];
    let currentIndex = 0;

    fetch(PROJECTS_URL)
        .then(response => response.json())
        .then(data => {
            projects = data;
            updateCarousel();
        })
        .catch(error => console.error('Error loading project data:', error));

    function updateCarousel() {
        if (!projects.length) return;

        const cards = document.querySelectorAll(".carousel-card");

        cards.forEach((card, i) => {
            const targetIndex = (currentIndex + i) % projects.length;
            const proj = projects[targetIndex];

            // card.style.cursor = "pointer";

            card.querySelector("img").src = proj.image;
            card.querySelector("img").alt = proj.name;
            card.querySelector("p").textContent = proj.name;
        });
    }

    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
          currentIndex = (currentIndex + 1) % projects.length;
          updateCarousel();
      });

      prevBtn.addEventListener('click', () => {
          currentIndex = (currentIndex - 1 + projects.length) % projects.length;
          updateCarousel();
      });
    }
});




// PROJECTS GRID ON PROJECTS PAGE
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("projects");
  if (!container) return;

  fetch(PROJECTS_URL)
    .then(response => response.json())
    .then(data => {
      data.forEach(proj => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
          <div class="card-cont">
            <img src="${imgUrl(proj.image)}" alt="${proj.name}" />
            <p><b>${proj.name}</b></p>
          </div>
          <a href="${proj.link}" target="_blank" class="button">view project &#8599;</a>
        `;

        card.addEventListener("click", (e) => {
            if (e.target.closest("a")) return;
            openProfile(proj);
        });
        container.appendChild(card);
      });
    })
    .catch(error => console.error("Error loading JSON data:", error));
});





// populate and display the project profile
function openProfile(proj) {
  const card = document.getElementById("project-card");
  if (!card) return;

  const cardImg = card.querySelector("#card-content img");
  if (cardImg) {
    cardImg.src = imgUrl(proj.image);
    cardImg.alt = proj.name;
  }

  const projNameHeader = card.querySelector("#card-content h2");
  if (projNameHeader) projNameHeader.textContent = proj.name;

  const desc = card.querySelector("#card-content p");
  if (desc) desc.textContent = proj.description;

  const linkEl = card.querySelector("#card-btns a");
  if (linkEl) linkEl.href = proj.link;

  card.classList.add("open");
  showOverlay();
}

function closeProfile() {
  const card = document.getElementById("project-card");
  if (card) card.classList.remove("open");
  hideOverlay();
}

document.addEventListener("DOMContentLoaded", () => {
  const closeBtn = document.getElementById("close-card");
  const overlay = document.getElementById("overlay");

  if (closeBtn) closeBtn.addEventListener("click", closeProfile);
  if (overlay) overlay.addEventListener("click", closeProfile);
});

function showOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.classList.add("active");
}

function hideOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) overlay.classList.remove("active");
}