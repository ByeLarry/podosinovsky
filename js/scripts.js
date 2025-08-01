/**
 * Инициализация при загрузке DOM.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Предотвращение автоматической прокрутки к якорю на сенсорных устройствах.
  if ("ontouchstart" in window) {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.substring(1);
      history.replaceState(null, null, " ");
      document.querySelectorAll('nav a[href^="#"]').forEach((link) => {
        if (link.getAttribute("href") === hash) {
          link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.getElementById(targetId);
            if (target) {
              target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
        }
      });
    }
  }

  // Плавная прокрутка к якорям для всех ссылок с якорями.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section);
  });
});

/**
 * Обработка аккордеона.
 */
const accordionHeaders = document.querySelectorAll(".accordion-header");
accordionHeaders.forEach((header) => {
  header.addEventListener("click", function () {
    const item = this.parentElement;
    const body = item.querySelector(".accordion-body");
    const icon = this.querySelector(".accordion-icon");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".accordion-item").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".accordion-body").style.maxHeight = null;
      i.querySelector(".accordion-icon").textContent = "+";
    });

    if (!isOpen) {
      item.classList.add("open");
      body.style.maxHeight = body.scrollHeight + "px";
      icon.textContent = "×";
    }
  });
});

/**
 * Обработка аккордеона с анимацией.
 */
const fancyHeaders = document.querySelectorAll(".fancy-accordion-header");
fancyHeaders.forEach((header) => {
  header.addEventListener("click", function () {
    const item = this.parentElement;
    const body = item.querySelector(".fancy-accordion-body");
    const arrow = this.querySelector(".fancy-arrow");
    const icon = this.querySelector(".fancy-icon");
    const isOpen = item.classList.contains("open");
    if (isOpen) {
      item.classList.remove("open");
      body.style.maxHeight = null;
    } else {
      item.classList.add("open");
      body.style.maxHeight = body.scrollHeight + "px";
    }
  });
});

/**
 * Управление темной темой.
 */
const themeToggle = document.getElementById("dark-mode-toggle");
const toggleWrapper = document.querySelector(".toggle__wrapper");
const toggleBack = document.querySelector(".toggle__back");

/**
 * Проверка сохраненной темы.
 */
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.checked = true;
  toggleWrapper.classList.remove("toggle__wrapper_light");
  toggleBack.classList.remove("toggle__back_light");
} else {
  toggleWrapper.classList.add("toggle__wrapper_light");
  toggleBack.classList.add("toggle__back_light");
}

/**
 * Обработчик переключения темы.
 */
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    document.body.classList.add("dark-theme");
    localStorage.setItem("theme", "dark");
    toggleWrapper.classList.remove("toggle__wrapper_light");
    toggleBack.classList.remove("toggle__back_light");
  } else {
    document.body.classList.remove("dark-theme");
    localStorage.setItem("theme", "light");
    toggleWrapper.classList.add("toggle__wrapper_light");
    toggleBack.classList.add("toggle__back_light");
  }
});

/**
 * Валидация формы.
 */
const form = document.querySelector(".contact-form-modern");
const submitButton = form.querySelector('button[type="submit"]');
const requiredInputs = form.querySelectorAll(
  "input[required], textarea[required]"
);
const checkbox = form.querySelector('input[type="checkbox"]');
const phoneInput = form.querySelector('input[type="tel"]');

/**
 * Проверка корректности российского номера телефона.
 */
function isValidRussianPhone(phone) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  if (!/^[789]/.test(digits)) return false;

  if (!/^[789]\d{10}$/.test(digits)) return false;

  return true;
}

/**
 * Форматирование номера телефона.
 */
function formatPhoneNumber(input) {
  let value = input.value.replace(/\D/g, "");

  if (value.length > 0) {
    if (value[0] === "9") {
      value = "7" + value;
    }
    if (value[0] === "8") {
      value = "7" + value.slice(1);
    }
  }

  let formattedValue = "";
  if (value.length > 0) {
    formattedValue = "+7 (";
    if (value.length > 1) {
      formattedValue += value.slice(1, 4);
    }
    if (value.length > 4) {
      formattedValue += ") " + value.slice(4, 7);
    }
    if (value.length > 7) {
      formattedValue += "-" + value.slice(7, 9);
    }
    if (value.length > 9) {
      formattedValue += "-" + value.slice(9, 11);
    }
  }

  input.value = formattedValue;
}

phoneInput.addEventListener("input", function (e) {
  formatPhoneNumber(this);
  checkFormValidity();
});

function checkFormValidity() {
  let isValid = true;

  requiredInputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
    }
  });

  if (!isValidRussianPhone(phoneInput.value)) {
    isValid = false;
  }

  if (!checkbox.checked) {
    isValid = false;
  }

  submitButton.disabled = !isValid;
}

requiredInputs.forEach((input) => {
  input.addEventListener("input", checkFormValidity);
});

checkbox.addEventListener("change", checkFormValidity);

checkFormValidity();

function showNotification(type = "success") {
  document.querySelectorAll(".form-notification").forEach((notification) => {
    notification.classList.remove("show");
  });

  const notification = document.querySelector(`.form-notification--${type}`);
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
    const formData = new FormData(this);
    const response = await fetch(this.action, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      this.reset();
      checkbox.checked = false;
      checkFormValidity();
      showNotification("success");
    } else {
      showNotification("error");
    }
  } catch (error) {
    console.error("Ошибка при отправке формы:", error);
    showNotification("error");
  }
});

/**
 * Инициализация галереи и модального окна.
 */
document.addEventListener("DOMContentLoaded", () => {
  const galleryImages = document.querySelectorAll("img.gallery-img");
  const galleryTrack = document.querySelector(".gallery-marquee-track");
  let imagesLoadedCount = 0;
  const totalImages = galleryImages.length;

  const updateMarqueeAnimation = () => {
    if (imagesLoadedCount === totalImages) {
      const trackWidth = galleryTrack.scrollWidth;
      const singleSetWidth = trackWidth / 2;

      galleryTrack.style.setProperty(
        "--marquee-translate-start",
        `-${singleSetWidth}px`
      );
      galleryTrack.style.setProperty("--marquee-translate-end", "0px");
    }
  };

  function loadAllImages() {
    return Promise.all(
      Array.from(galleryImages).map((img) => {
        return new Promise((resolve) => {
          // Убираем класс lazy-load
          img.classList.remove("lazy-load");
          
          if (img.complete) {
            img.classList.add("loaded");
            imagesLoadedCount++;
            updateMarqueeAnimation();
            resolve();
          } else {
            img.onload = () => {
              img.classList.add("loaded");
              imagesLoadedCount++;
              updateMarqueeAnimation();
              resolve();
            };
            img.onerror = () => {
              console.error("Ошибка загрузки изображения:", img.src);
              img.classList.add("error-loaded");
              imagesLoadedCount++;
              updateMarqueeAnimation();
              resolve();
            };
          }
        });
      })
    );
  }

  loadAllImages();

  // Обновление анимации при изменении размера окна.
  window.addEventListener("resize", () => {
    imagesLoadedCount = 0;
    galleryImages.forEach((img) => {
      if (img.complete || (img.naturalWidth > 0 && img.naturalHeight > 0)) {
        imagesLoadedCount++;
      }
    });
    updateMarqueeAnimation();
  });

  // Инициализация модального окна для просмотра изображений.
  const imageModalOverlay = document.querySelector(".image-modal-overlay");
  const imageModalImg = document.querySelector(".image-modal-img");
  const galleryImgs = document.querySelectorAll(".gallery-img");
  const imageModalCloseButton = document.querySelector(".image-modal-close");
  const prevButton = document.querySelector(".image-modal-prev");
  const nextButton = document.querySelector(".image-modal-next");

  let currentImageIndex = 0;
  const images = Array.from(galleryImgs);

  // Функция обновления состояния кнопок навигации.
  function updateNavigationButtons() {
    if (prevButton && nextButton) {
      prevButton.style.display = images.length > 1 ? "block" : "none";
      nextButton.style.display = images.length > 1 ? "block" : "none";
    }
  }

  // Открытие модального окна при клике на изображение.
  galleryImgs.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentImageIndex = index;
      imageModalImg.src = img.src;
      imageModalOverlay.classList.add("visible");
      document.body.classList.add("modal-open");
      updateNavigationButtons();
    });
  });

  // Функция переключения изображений с анимацией.
  function switchImage(direction) {
    let newIndex;
    if (direction === "next") {
      newIndex = currentImageIndex + 1;
      if (newIndex >= images.length) {
        newIndex = 0;
      }
    } else {
      newIndex = currentImageIndex - 1;
      if (newIndex < 0) {
        newIndex = images.length - 1;
      }
    }

    imageModalImg.classList.add(
      direction === "next" ? "sliding-right" : "sliding-left"
    );

    setTimeout(() => {
      currentImageIndex = newIndex;
      imageModalImg.src = images[currentImageIndex].src;
      imageModalImg.classList.remove("sliding-left", "sliding-right");
    }, 200);
  }

  prevButton.addEventListener("click", () => switchImage("prev"));
  nextButton.addEventListener("click", () => switchImage("next"));

  // Обработка клавиш клавиатуры.
  document.addEventListener("keydown", (e) => {
    if (imageModalOverlay.classList.contains("visible")) {
      if (e.key === "ArrowLeft") {
        switchImage("prev");
      } else if (e.key === "ArrowRight") {
        switchImage("next");
      } else if (e.key === "Escape") {
        imageModalOverlay.classList.remove("visible");
        document.body.classList.remove("modal-open");
      }
    }
  });

  // Закрытие модального окна при клике на оверлей.
  imageModalOverlay.addEventListener("click", (e) => {
    if (e.target === imageModalOverlay) {
      imageModalOverlay.classList.remove("visible");
      document.body.classList.remove("modal-open");
    }
  });

  // Закрытие модального окна при клике на кнопку закрытия.
  imageModalCloseButton.addEventListener("click", () => {
    imageModalOverlay.classList.remove("visible");
    document.body.classList.remove("modal-open");
  });
});

/**
 * Загрузка всех изображений.
 */
function loadAllImages() {
  const images = Array.from(galleryImgs);
  return Promise.all(
      images.map((img) => {
          return new Promise((resolve) => {
              img.classList.remove("lazy-load");
              
              if (img.complete) {
                  img.classList.add("loaded");
                  imagesLoadedCount++;
                  updateMarqueeAnimation();
                  resolve();
              } else {
                  img.onload = () => {
                      img.classList.add("loaded");
                      imagesLoadedCount++;
                      updateMarqueeAnimation();
                      resolve();
                  };
                  img.onerror = () => {
                      console.error("Ошибка загрузки изображения:", img.src);
                      img.classList.add("error-loaded");
                      imagesLoadedCount++;
                      updateMarqueeAnimation();
                      resolve();
                  };
              }
          });
      })
  );
}