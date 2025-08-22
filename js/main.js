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
  initPagination(
    ".news-card",
    ".news-pagination .pagination__prev",
    ".news-pagination .pagination__next",
    ".news-pagination .pagination__page-numbers",
    3
  );

  document.querySelectorAll(".news-card").forEach((card, index) => {
    const link = card.querySelector(".news-card__link");
    const desc = card.querySelector(".news-card__description");

    const fullText = document.createElement("p");
    fullText.className = "news-card__full hidden";
    fullText.textContent =
      [
        "Подробное описание первой новости.",
        "Подробное описание второй новости.",
        "Подробное описание третьей новости.",
      ][index] || "Полный текст новости...";
    desc.insertAdjacentElement("afterend", fullText);

    link.addEventListener("click", (e) => {
      e.preventDefault();
      fullText.classList.toggle("hidden");
      link.textContent = fullText.classList.contains("hidden")
        ? "Читать подробнее"
        : "Скрыть";
    });
  });
  const calendarEl = document.querySelector("#calendar");
  const calendarBtn = document.querySelector("#calendarBtn");

  if (calendarEl) {
    let isMobile = window.innerWidth <= 900;

    const fp = flatpickr(calendarEl, {
      inline: !isMobile,
      mode: "range",
      locale: flatpickr.l10ns.ru,
      defaultDate: ["2025-08-06"],
      monthSelectorType: "dropdown",
      yearSelectorType: "dropdown",
      clickOpens: false, 
      onDayCreate: function (dObj, dStr, fp, dayElem) {
        const date = dayElem.dateObj;
        const day = date.getDay();
        if (day === 0 || day === 6) {
          dayElem.classList.add("weekend-day");
        }
      },
      onChange: function (selectedDates, dateStr, instance) {
      },
    });

    if (isMobile && calendarBtn) {
      calendarBtn.style.display = "inline-block";

      calendarBtn.addEventListener("click", () => {
        if (fp.isOpen) {
          fp.close();
        } else {
          fp.open();
        }
      });
    }
  }

  const burger = document.querySelector(".header__burger");
  const menu = document.querySelector(".nav__menu");

  burger.addEventListener("click", () => {
    menu.classList.toggle("active");
  });

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
  const sortDropdown = document.querySelector(".sort-dropdown");
  const sortBtn = document.querySelector(".sort-btn");

  if (sortDropdown && sortBtn) {
    sortBtn.addEventListener("click", () => {
      sortDropdown.classList.toggle("active");
    });

    sortDropdown.querySelectorAll(".sort-options li").forEach((option) => {
      option.addEventListener("click", () => {
        sortBtn.textContent = option.textContent + " ▾";
        sortDropdown.classList.remove("active");
      });
    });

    document.addEventListener("click", (e) => {
      if (!sortDropdown.contains(e.target) && e.target !== sortBtn) {
        sortDropdown.classList.remove("active");
      }
    });
  }

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
