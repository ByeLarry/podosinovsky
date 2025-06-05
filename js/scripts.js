// Scroll animation for sections
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    document.querySelectorAll("section").forEach(section => {
        observer.observe(section);
    });
});

// Smooth scroll on nav click
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

// Аккордеон для условий сотрудничества
const accordionHeaders = document.querySelectorAll('.accordion-header');
accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const item = this.parentElement;
        const body = item.querySelector('.accordion-body');
        const icon = this.querySelector('.accordion-icon');
        const isOpen = item.classList.contains('open');
        // Закрыть все
        document.querySelectorAll('.accordion-item').forEach(i => {
            i.classList.remove('open');
            i.querySelector('.accordion-body').style.maxHeight = null;
            i.querySelector('.accordion-icon').textContent = '+';
        });
        // Открыть если не был открыт
        if (!isOpen) {
            item.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 'px';
            icon.textContent = '×';
        }
    });
});

// Fancy-аккордеон с выезжающими иконками
const fancyHeaders = document.querySelectorAll('.fancy-accordion-header');
fancyHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const item = this.parentElement;
        const body = item.querySelector('.fancy-accordion-body');
        const arrow = this.querySelector('.fancy-arrow');
        const icon = this.querySelector('.fancy-icon');
        const isOpen = item.classList.contains('open');
        if (isOpen) {
            item.classList.remove('open');
            body.style.maxHeight = null;
        } else {
            item.classList.add('open');
            body.style.maxHeight = body.scrollHeight + 'px';
        }
    });
});

// Переключение темы
const themeToggle = document.getElementById('dark-mode-toggle');
const toggleWrapper = document.querySelector('.toggle__wrapper');
const toggleBack = document.querySelector('.toggle__back');

// Проверяем сохраненную тему
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.checked = true;
    toggleWrapper.classList.remove('toggle__wrapper_light');
    toggleBack.classList.remove('toggle__back_light');
} else {
    toggleWrapper.classList.add('toggle__wrapper_light');
    toggleBack.classList.add('toggle__back_light');
}

// Обработчик переключения темы
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        toggleWrapper.classList.remove('toggle__wrapper_light');
        toggleBack.classList.remove('toggle__back_light');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        toggleWrapper.classList.add('toggle__wrapper_light');
        toggleBack.classList.add('toggle__back_light');
    }
});

// Проверка формы
const form = document.querySelector('.contact-form-modern');
const submitButton = form.querySelector('button[type="submit"]');
const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
const checkbox = form.querySelector('input[type="checkbox"]');
const phoneInput = form.querySelector('input[type="tel"]');

// Функция валидации российского номера телефона
function isValidRussianPhone(phone) {
    // Удаляем все нецифровые символы
    const digits = phone.replace(/\D/g, '');
    
    // Проверяем длину (должно быть 11 цифр)
    if (digits.length !== 11) return false;
    
    // Проверяем, что номер начинается с 7, 8 или 9
    if (!/^[789]/.test(digits)) return false;
    
    // Проверяем, что после кода страны/оператора идут валидные цифры
    if (!/^[789]\d{10}$/.test(digits)) return false;
    
    return true;
}

// Маска для телефона
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value[0] === '9') {
            value = '7' + value;
        }
        if (value[0] === '8') {
            value = '7' + value.slice(1);
        }
    }
    
    let formattedValue = '';
    if (value.length > 0) {
        formattedValue = '+7 (';
        if (value.length > 1) {
            formattedValue += value.slice(1, 4);
        }
        if (value.length > 4) {
            formattedValue += ') ' + value.slice(4, 7);
        }
        if (value.length > 7) {
            formattedValue += '-' + value.slice(7, 9);
        }
        if (value.length > 9) {
            formattedValue += '-' + value.slice(9, 11);
        }
    }
    
    input.value = formattedValue;
}

// Добавляем обработчик для форматирования номера
phoneInput.addEventListener('input', function(e) {
    formatPhoneNumber(this);
    checkFormValidity();
});

function checkFormValidity() {
    let isValid = true;
    
    // Проверяем все обязательные поля
    requiredInputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
    });

    // Проверяем валидность номера телефона
    if (!isValidRussianPhone(phoneInput.value)) {
        isValid = false;
    }

    // Проверяем чекбокс
    if (!checkbox.checked) {
        isValid = false;
    }

    // Обновляем состояние кнопки
    submitButton.disabled = !isValid;
}

// Добавляем обработчики событий
requiredInputs.forEach(input => {
    input.addEventListener('input', checkFormValidity);
});

checkbox.addEventListener('change', checkFormValidity);

// Проверяем форму при загрузке страницы
checkFormValidity();

// Функция для показа уведомления
function showNotification(type = 'success') {
    // Скрываем все уведомления
    document.querySelectorAll('.form-notification').forEach(notification => {
        notification.classList.remove('show');
    });
    
    // Показываем нужное уведомление
    const notification = document.querySelector(`.form-notification--${type}`);
    notification.classList.add('show');
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Обработчик отправки формы
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(this);
        const response = await fetch(this.action, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Очищаем все поля формы
            this.reset();
            // Сбрасываем состояние чекбокса
            checkbox.checked = false;
            // Проверяем валидность формы после очистки
            checkFormValidity();
            // Показываем уведомление об успешной отправке
            showNotification('success');
        } else {
            // Показываем уведомление об ошибке
            showNotification('error');
        }
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
        // Показываем уведомление об ошибке
        showNotification('error');
    }
});

// Обработчик загрузки изображений галереи с заглушкой и настройка анимации
document.addEventListener("DOMContentLoaded", () => {
    const galleryImages = document.querySelectorAll('img.gallery-img');
    const galleryTrack = document.querySelector('.gallery-marquee-track');
    let imagesLoadedCount = 0;
    const totalImages = galleryImages.length;

    const updateMarqueeAnimation = () => {
        // Убедимся, что все изображения загружены, чтобы width: max-content был корректным
        if (imagesLoadedCount === totalImages) {
            // Ширина одного набора изображений - это половина общей ширины трека
            const trackWidth = galleryTrack.scrollWidth; // scrollWidth дает полную ширину элемента, включая скрытые части
            const singleSetWidth = trackWidth / 2;

            // Устанавливаем CSS переменные для анимации
            galleryTrack.style.setProperty('--marquee-translate-start', `-${singleSetWidth}px`);
            galleryTrack.style.setProperty('--marquee-translate-end', '0px');

            // Перезапускаем анимацию, если необходимо (может потребоваться удаление/добавление класса анимации)
            // Убираем явный сброс анимации, полагаясь на браузер при изменении переменных
            // galleryTrack.style.animation = 'none'; // Временно отключаем анимацию
            // void galleryTrack.offsetWidth; // Вызываем reflow для сброса анимации
            // galleryTrack.style.animation = ''; // Включаем анимацию снова (используя стили из CSS)
        }
    };

    galleryImages.forEach(img => {
        // Обработчик события load
        const imgLoadHandler = () => {
            img.classList.remove('lazy-load');
            img.classList.add('loaded');
            imagesLoadedCount++;
            updateMarqueeAnimation();
        };

        // Обработчик события error
        const imgErrorHandler = () => {
            console.error('Ошибка загрузки изображения:', img.src);
            img.classList.remove('lazy-load'); // Убираем заглушку даже при ошибке
            img.classList.add('error-loaded'); // Добавляем класс ошибки
            imagesLoadedCount++;
            updateMarqueeAnimation();
        };

        // Если изображение уже загружено (например, из кеша),
        // сразу убираем заглушку и учитываем его в счетчике
        if (img.complete || (img.naturalWidth > 0 && img.naturalHeight > 0)) {
             imgLoadHandler(); // Вызываем обработчик загрузки сразу
        } else {
            // Если изображение еще не загружено, добавляем обработчики событий
            img.addEventListener('load', imgLoadHandler);
            img.addEventListener('error', imgErrorHandler);
        }
    });

     // Также проверяем и обновляем анимацию на случай изменения размера окна
    window.addEventListener('resize', () => {
         imagesLoadedCount = 0; // Сбрасываем счетчик, чтобы пересчитать после resize (изображения уже в кеше)
         galleryImages.forEach(img => {
             // Если изображение уже загружено после resize
            if (img.complete || (img.naturalWidth > 0 && img.naturalHeight > 0)) {
                imagesLoadedCount++;
            }
         });
        updateMarqueeAnimation();
    });

    // Модальное окно для просмотра изображений
    const imageModalOverlay = document.querySelector('.image-modal-overlay');
    const imageModalImg = document.querySelector('.image-modal-img');
    const galleryImgs = document.querySelectorAll('.gallery-img');

    galleryImgs.forEach(img => {
        img.addEventListener('click', () => {
            imageModalImg.src = img.src;
            imageModalOverlay.classList.add('visible');
            document.body.classList.add('modal-open');
        });
    });

    imageModalOverlay.addEventListener('click', (e) => {
        // Закрываем модальное окно только если клик был по оверлею, а не по самому изображению
        if (e.target === imageModalOverlay || e.target.parentElement === imageModalOverlay) {
             imageModalOverlay.classList.remove('visible');
             document.body.classList.remove('modal-open');
        }
    });

}); 