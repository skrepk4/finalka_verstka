(() => {
    const refs = {
    openModalBtn: document.querySelector("[data-modal-open]"),
    closeModalBtn: document.querySelector("[data-modal-close]"),
    modal: document.querySelector("[data-modal]"),
    };
    
    refs.openModalBtn.addEventListener("click", toggleModal);
    refs.closeModalBtn.addEventListener("click", toggleModal);
    
    function toggleModal() {
    refs.modal.classList.toggle("is-hidden");
    // document.body.classList.toggle("no-scroll");
    }
    })();

const cardsPerPage = 20;
let currentPage = 0
const countryCode = "US"

async function fetchEvents(page = 0) {
    const API_URL = `https://app.ticketmaster.com/discovery/v2/events.json?limit=${cardsPerPage}&page=${page}&countryCode=${countryCode}&segmentName=Film&apikey=49FrD8b5pF7reRwv5Ebt667wyQ9AQQPZ`

}
