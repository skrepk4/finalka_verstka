document.addEventListener("DOMContentLoaded", () => {
  const cardsPerPage = 20;
  const countrySelected = document.getElementById("select")
  let countryCode = countrySelected.value

  const urlParam = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParam.get("page")) || 0;

  const eventsContainer = document.getElementById("events");
  const searchInput = document.getElementById("search");

  function renderEvents(events) {
    eventsContainer.innerHTML = "";

    for (const event of events) {
      const imgSrc = event.images?.[0]?.url;
      const title = event.name;
      const date = event.dates?.start?.localDate;
      const time = event.dates?.start?.localTime;
      const zone = event.dates?.timezone;
      const info = event.info 
      const place = event._embedded?.venues?.[0]?.name;
      const city = event._embedded?.venues?.[0]?.city?.name;

      const card = document.createElement("div");
      card.className = "events__container";

      card.innerHTML = `
        <img class="events__container--img" src="${imgSrc}" data-modal-open alt="">
        <h4 class="events__container--img--title">${title}</h4>

        <div class="backdrop is-hidden" data-modal>
          <div class="modal-container">
            <div class="modal">
              <div class="modal__btn">
                <button class="modal__btn--content" data-modal-close>X</button>
              </div>
              <img class="modal__img" src="${imgSrc}" alt="">
              <div class="modal__container">
                <img class="modal__container--image" src="${imgSrc}" alt="">
                <div class="modal__container--content">
                  <div class="modal__container--content--window">
                    <h4 class="modal__container--content--window--title">INFO</h4>
                    <p class="modal__container--content--window--text">${info}</p>
                  </div>
                  <div class="modal__container--content--window">
                    <h4 class="modal__container--content--window--title">WHEN</h4>
                    <p class="modal__container--content--window--text">${date}</p>
                    <p class="modal__container--content--window--text">${time} (${zone})</p>
                  </div>
                  <div class="modal__container--content--window">
                    <h4 class="modal__container--content--window--title">WHERE</h4>
                    <p class="modal__container--content--window--text">${place}</p>
                    <p class="modal__container--content--window--text">${city}</p>
                  </div>
                  <div class="modal__container--content--window">
                    <h4 class="modal__container--content--window--title">PRICES</h4>
                    <p class="modal__container--content--window--text">
                      <img class="modal__container--content--window--img" src="img/ticket1.svg" alt="">
                      Standart 300-500 UAH
                    </p>
                    <button class="modal__container--content--window--btn">BUY TICKETS</button>
                    <p class="modal__container--content--window--text">
                      <img class="modal__container--content--window--img" src="img/ticket1.svg" alt="">
                      VIP 1000-1500 UAH
                    </p>
                    <button class="modal__container--content--window--btn">BUY TICKETS</button>
                  </div>
                </div>
              </div>
              <div class="modal__end">
                <button class="modal__end--btn">MORE FROM THIS AUTHOR</button>
              </div>
            </div>
          </div>
        </div>

        <p class="events__container--img--date">${date}</p>
        <p class="events__container--img--place"><img src="img/Vector.svg" alt="">${place}</p>
      `;

      eventsContainer.appendChild(card);

      const modal = card.querySelector("[data-modal]");
      const openBtn = card.querySelector("[data-modal-open]");
      const closeBtn = card.querySelector("[data-modal-close]");

      openBtn?.addEventListener("click", () => {
        modal?.classList.remove("is-hidden");
      });

      closeBtn?.addEventListener("click", () => {
        modal?.classList.add("is-hidden");
      });
    }
  }

  async function fetchEvents(page = 0, searchQuery = "", country = "US") {
    let API_URL = `https://app.ticketmaster.com/discovery/v2/events.json?limit=${cardsPerPage}&page=${page}&countryCode=${country}&segmentName=Film&apikey=49FrD8b5pF7reRwv5Ebt667wyQ9AQQPZ`;

    if (searchQuery) {
      API_URL += `&keyword=${encodeURIComponent(searchQuery)}`;
    }

    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      return data._embedded?.events || [];
    } catch (error) {
      console.error("error", error);
      return [];
    }
  }

  function insertPagination(activePage) {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = 10;

    for (let i = 0; i < totalPages; i++) {
      const btn = document.createElement("button");
      btn.className = "pages_page";
      btn.textContent = i + 1;

      if (i === activePage) {
        btn.classList.add("active");
        btn.disabled = true;
      }

      btn.addEventListener("click", () => {
        const base = window.location.pathname;
        window.location.href = `${base}?page=${i}`;
      });

      paginationContainer.appendChild(btn);
    }
  }

  fetchEvents(currentPage, searchInput.value.trim(), countrySelected.value).then(events => {
    renderEvents(events);
    insertPagination(currentPage);
  });

  searchInput.addEventListener("input", async () => {
    const searchQuery = searchInput.value.trim();
    const events = await fetchEvents(0, searchQuery, countrySelected.value);
    renderEvents(events);
  });

  countrySelected.addEventListener("change", async () => {
    countryCode = countrySelected.value;
    const events = await fetchEvents(0, searchInput.value.trim(), countryCode)
    renderEvents(events)
    insertPagination(0)
  })
});
