const updateScrollVar = () => {
  const htmlElement = document.documentElement;
  const percentOfScreenScrolled =
    htmlElement.scrollTop / htmlElement.clientHeight;
  htmlElement.style.setProperty(
    "--scroll",
    Math.min(percentOfScreenScrolled * 100, 100)
  );
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -10% 0px" }
);

const observerSpecial = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observerSpecial.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -20% 0px" }
);

updateScrollVar();
const hiddenElements = document.querySelectorAll(".hidden:not(.special)");
const hiddenElementsSpecial = document.querySelectorAll(".hidden.special");
hiddenElements.forEach((e) => observer.observe(e));
hiddenElementsSpecial.forEach((e) => observerSpecial.observe(e));
window.addEventListener("scroll", updateScrollVar);
window.addEventListener("resize", updateScrollVar);

function carouselControl() {
  const leftBtn = document.getElementById("btn-left");
  const rightBtn = document.getElementById("btn-right");
  const carousel = document.querySelector(".carousel");
  const carouselDisplay = document.querySelector(".carousel-display");

  let index = 0;

  function updateMaxTranslate() {
    const carouselWidth = carousel.scrollWidth;
    const displayWidth = carouselDisplay.offsetWidth;
    const maxTranslate = carouselWidth - displayWidth;
    return Math.max(0, maxTranslate);
  }

  function translateRightBtn() {
    const currentMaxTranslate = updateMaxTranslate();
    if (index * 255 < currentMaxTranslate) {
      index++;
      let newTranslate = 0;
      if (
        carouselDisplay.offsetWidth > 500 &&
        currentMaxTranslate - index * 255 < 255
      ) {
        newTranslate = currentMaxTranslate + 1;
        index = Math.floor(currentMaxTranslate / 255);
      } else {
        newTranslate = index * 255;
      }
      carousel.style.transform = `translateX(-${newTranslate}px)`;
    }
  }

  function translateLeftBtn() {
    if (index > 0) {
      index--;
      carousel.style.transform = `translateX(-${index * 255}px)`;
    }
  }

  rightBtn.addEventListener("click", translateRightBtn);
  leftBtn.addEventListener("click", translateLeftBtn);
}

function languageControl() {
  const langSwitcher = document.querySelector(".lang-switcher");
  const buttons = document.querySelectorAll(".lang-btn");
  let lastScrollY = window.scrollY;

  function setLanguage(lang) {
    const text = lang === "uk" ? "uk" : "en";
    document.querySelectorAll("[data-lang-en]").forEach((element) => {
      element.textContent = element.getAttribute(`data-lang-${text}`);
    });
    localStorage.setItem("preferredLanguage", lang);
  }

  function handleScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      langSwitcher.classList.add("hidden");
    } else {
      langSwitcher.classList.remove("hidden");
    }
    lastScrollY = currentScrollY;
  }

  window.addEventListener("scroll", handleScroll);

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
  });

  const storedLang = localStorage.getItem("preferredLanguage");
  if (storedLang) {
    setLanguage(storedLang);
  } else {
    const userLang = navigator.language || navigator.userLanguage;
    setLanguage(userLang.startsWith("uk") ? "uk" : "en");
  }
}

languageControl();
carouselControl();
