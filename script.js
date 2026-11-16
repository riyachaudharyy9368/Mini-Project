
const $ = selector => document.querySelector(selector);

const savedKey = "cafehop-favourites";

function getSaved() {
    return JSON.parse(localStorage.getItem(savedKey)) || [];
}

function saveSaved(ids) {
    localStorage.setItem(savedKey, JSON.stringify(ids));
}

function cafeCard(cafe) {

    const saved = getSaved().includes(cafe.id);

    const tags = cafe.categories
        .map(tag => `<span class="mini-tag">${tag}</span>`)
        .join("");

    return `
        <article class="cafe-card">

            <div class="card-image-wrap">

                <a href="${cafe.map}" target="_blank">
                    <img src="${cafe.image}" alt="${cafe.name}">
                </a>

                <button class="heart-button ${saved ? "is-saved" : ""}"
                    data-favourite="${cafe.id}">
                    ${saved ? "♥" : "♡"}
                </button>

                <span class="city-label">${cafe.city}</span>

            </div>

            <div class="card-content">

                <h3>${cafe.name}</h3>

                <p class="card-location">⌖ ${cafe.area}</p>

                <p class="card-description">
                    ${cafe.description}
                </p>

                <div class="card-bottom">
                    <div class="tag-list">${tags}</div>
                    <a class="card-arrow" href="${cafe.map}"
                       target="_blank">↗</a>
                </div>

            </div>

        </article>
    `;
}

function renderCards(container, list) {
    if (!container) return;
    container.innerHTML = list.map(cafeCard).join("");
}

function renderHome() {
    const grid = $("#featured-grid");

    if (grid) {
        const featured = cafes.filter(
            cafe => cafe.city === "Ghaziabad"
        ).slice(0, 4);

        renderCards(grid, featured);
    }
}

function renderExplore() {

    const grid = $("#all-cafes-grid");

    if (!grid) return;

    const search = $("#cafe-search");
    const count = $("#results-count");
    const empty = $("#empty-state");

    let activeCategory =
        new URLSearchParams(location.search).get("category") || "All";

    function paint() {

        const query = search.value.toLowerCase().trim();

        const filtered = cafes.filter(cafe => {

            const text = (
                cafe.name + " " +
                cafe.area + " " +
                cafe.description
            ).toLowerCase();

            const matchesSearch = text.includes(query);

            const matchesCategory =
                activeCategory === "All" ||
                cafe.categories.includes(activeCategory);

            return matchesSearch && matchesCategory;
        });

        filtered.sort((a, b) =>
            a.city === b.city ? 0 :
            a.city === "Ghaziabad" ? -1 : 1
        );

        renderCards(grid, filtered);

        count.textContent =
            `Showing ${filtered.length} cafés`;

        empty.classList.toggle(
            "hidden", filtered.length !== 0
        );

        document.querySelectorAll(".filter-chip").forEach(btn => {
            btn.classList.toggle(
                "active",
                btn.dataset.category === activeCategory
            );
        });
    }

    search.addEventListener("input", paint);

    document.querySelectorAll(".filter-chip").forEach(btn => {

        btn.addEventListener("click", () => {
            activeCategory = btn.dataset.category;
            paint();
        });

    });

    $("#clear-filters").addEventListener("click", () => {
        search.value = "";
        activeCategory = "All";
        paint();
    });

    paint();
}

function renderFavourites() {

    const grid = $("#favourites-grid");

    if (!grid) return;

    const list = cafes.filter(cafe =>
        getSaved().includes(cafe.id)
    );

    renderCards(grid, list);

    $("#favourites-empty").classList.toggle(
        "hidden", list.length !== 0
    );
}

document.addEventListener("click", event => {

    const button = event.target.closest("[data-favourite]");

    if (!button) return;

    const id = button.dataset.favourite;
    const saved = getSaved();

    const next = saved.includes(id)
        ? saved.filter(item => item !== id)
        : [...saved, id];

    saveSaved(next);

    renderHome();
    renderExplore();
    renderFavourites();

});

document.addEventListener("DOMContentLoaded", () => {

    renderHome();
    renderExplore();
    renderFavourites();

    const menu = $(".menu-toggle");
    const nav = $(".main-nav");

    menu.addEventListener("click", () => {
        nav.classList.toggle("nav-open");
    });

    const form = $("#contact-form");

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            $("#form-message").textContent =
                "Thank you! Your note has been received. ☕";

            form.reset();
        });
    }

});
