function loadHTML(selector, url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok)
        throw new Error(`Ошибка загрузки ${url}: ${response.status}`);
      return response.text();
    })
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    })
    .catch((err) => console.error(err));
}

Promise.all([
  loadHTML("#header", "components/header.html"),
  loadHTML("#content", "content.html"),
  loadHTML("#footer", "components/footer.html"),
]).then(() => {
  function initPagination(
    cardSelector,
    prevSelector,
    nextSelector,
    pageNumbersSelector,
    perPage = 4
  ) {
    const cards = document.querySelectorAll(cardSelector);
    const prevBtn = document.querySelector(prevSelector);
    const nextBtn = document.querySelector(nextSelector);
    const pageNumbersContainer = document.querySelector(pageNumbersSelector);

    if (!cards.length || !pageNumbersContainer) return;

    let currentPage = 0;
    const totalPages = Math.ceil(cards.length / perPage);

    function showPage(page) {
      cards.forEach((card, idx) => {
        card.classList.toggle(
          "hidden",
          !(idx >= page * perPage && idx < (page + 1) * perPage)
        );
      });
      updatePageNumbers();
    }

    function updatePageNumbers() {
      pageNumbersContainer.innerHTML = "";

      function createPageLink(i) {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = i + 1;
        link.className = "pagination__item";
        if (i === currentPage) link.classList.add("pagination__item--active");

        link.addEventListener("click", (e) => {
          e.preventDefault();
          currentPage = i;
          showPage(currentPage);
        });

        pageNumbersContainer.appendChild(link);
      }

      function createDots() {
        const dots = document.createElement("span");
        dots.textContent = "...";
        dots.className = "pagination__dots";
        pageNumbersContainer.appendChild(dots);
      }

      if (totalPages <= 5) {
        for (let i = 0; i < totalPages; i++) createPageLink(i);
      } else {
        createPageLink(0);
        if (currentPage > 2) createDots();
        const start = Math.max(1, currentPage - 1);
        const end = Math.min(totalPages - 2, currentPage + 1);
        for (let i = start; i <= end; i++) createPageLink(i);
        if (currentPage < totalPages - 3) createDots();
        createPageLink(totalPages - 1);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage > 0) {
          currentPage--;
          showPage(currentPage);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (currentPage < totalPages - 1) {
          currentPage++;
          showPage(currentPage);
        }
      });
    }

    showPage(currentPage);
  }
 
  initPagination(
    ".recommended__card",
    ".recommended__pagination .pagination__prev",
    ".recommended__pagination .pagination__next",
    ".recommended__pagination .pagination__page-numbers",
    4  
  );
 
  initPagination(
    ".event-card",
    ".event-pagination .pagination__prev",
    ".event-pagination .pagination__next",
    ".event-pagination .pagination__page-numbers",
    3  
  );

  const calendarEl = document.querySelector("#calendar");
if (calendarEl) {
  flatpickr(calendarEl, {
    inline: true,
    mode: "range",
    locale: flatpickr.l10ns.ru,
    defaultDate: ["2025-08-06"],

    monthSelectorType: "dropdown", 
    yearSelectorType: "dropdown", 

    onDayCreate: function (dObj, dStr, fp, dayElem) {
      const date = dayElem.dateObj;
      const day = date.getDay(); 

      if (day === 0 || day === 6) {
        dayElem.classList.add("weekend-day");
      }
    },
  });
}

document.querySelectorAll(".selected-filters").forEach((container) => {
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove")) {
        e.target.parentElement.remove(); 
      }
    });
  
    container.querySelector(".reset-filters").addEventListener("click", () => {
      container.querySelectorAll(".filter-tag").forEach((tag) => tag.remove());
    });
  });
  const filtersContainer = document.querySelector(".selected-filters");
  
  filtersContainer.addEventListener("click", function (e) {
    if (e.target.closest(".remove")) {
      const filterTag = e.target.closest(".filter-tag");
      if (filterTag) filterTag.remove();
    }
  });
  
  document.querySelectorAll(".filter-group").forEach((group) => {
    const btn = group.querySelector(".btn-more");
    const options = group.querySelector(".filter-options");
  
    if (!btn || !options) return;  
  
    btn.addEventListener("click", () => {
      const collapsed = options.getAttribute("data-collapsed") === "true";
      options.setAttribute("data-collapsed", collapsed ? "false" : "true");
      btn.textContent = collapsed ? "Скрыть" : "Ещё";
    });
  });
  
});

