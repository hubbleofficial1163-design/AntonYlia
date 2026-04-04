document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка при клике на индикатор
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const invitationMessage = document.querySelector('.invitation-message');
            invitationMessage.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // Обработка формы RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения формы
            const name = document.getElementById('name').value;
            const attendance = document.getElementById('attendance').value;
            
            // Простая имитация отправки
            formMessage.textContent = `Благодарим вас, ${name}! Ваш ответ принят. Мы свяжемся с вами для уточнения деталей.`;
            formMessage.style.display = 'block';
            formMessage.style.backgroundColor = 'rgba(180, 189, 170, 0.3)';
            formMessage.style.color = '#4a5345';
            formMessage.style.border = '1px solid rgba(162, 172, 148, 0.5)';
            
            // Сбрасываем форму
            rsvpForm.reset();
            
            // Плавная прокрутка к сообщению
            formMessage.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // Скрываем сообщение через 6 секунд
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 6000);
        });
    }
});

    // Обработка кнопки подписки (заглушка)
    // const giftLink = document.getElementById('giftSubscriptionLink');
    // if (giftLink) {
    //     giftLink.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         // TODO: заменить на реальную ссылку на подписку
    //         // alert('Ссылка на подписку будет добавлена позже. Спасибо!');
    //         window.location.href = 'https://roz-buket.ru/kopilka-chayko-kuzmina';
    //     });
    // }

        // ========== КАЛЕНДАРЬ ==========
    function buildCalendar(month, year) {
        const weddingDate = new Date(2026, 5, 13); // 13 июня 2026 (месяц 5 = июнь)
        
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        
        document.getElementById('calendarMonth').textContent = monthNames[month];
        document.getElementById('calendarYear').textContent = year;
        
        const firstDayOfMonth = new Date(year, month, 1);
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = воскресенье
        // Конвертируем в понедельник как первый день недели
        let startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Дни предыдущего месяца для заполнения
        const prevMonthDays = new Date(year, month, 0).getDate();
        
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';
        
        let dayCounter = 1;
        let nextMonthCounter = 1;
        
        // 6 строк по 7 дней = 42 ячейки
        for (let i = 0; i < 42; i++) {
            let dayNumber;
            let isOtherMonth = false;
            let isWedding = false;
            
            if (i < startOffset) {
                // Дни предыдущего месяца
                dayNumber = prevMonthDays - startOffset + i + 1;
                isOtherMonth = true;
            } else if (dayCounter <= daysInMonth) {
                dayNumber = dayCounter;
                dayCounter++;
            } else {
                // Дни следующего месяца
                dayNumber = nextMonthCounter;
                nextMonthCounter++;
                isOtherMonth = true;
            }
            
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            if (isOtherMonth) {
                dayDiv.classList.add('other-month');
            }
            dayDiv.textContent = dayNumber;
            
            // Проверяем, является ли этот день датой свадьбы
            if (year === weddingDate.getFullYear() && 
                month === weddingDate.getMonth() && 
                dayNumber === weddingDate.getDate()) {
                dayDiv.classList.add('wedding-day');
                dayDiv.title = 'Наша свадьба! ♥';
            }
            
            calendarDays.appendChild(dayDiv);
        }
    }
    
    let currentMonth = 5; // Июнь (0-11)
    let currentYear = 2026;
    
    function updateCalendar() {
        buildCalendar(currentMonth, currentYear);
    }
    
    // Инициализация календаря
    const calendarContainer = document.querySelector('.calendar-container');
    if (calendarContainer) {
        buildCalendar(currentMonth, currentYear);
        
        document.getElementById('prevMonth').addEventListener('click', function() {
            if (currentMonth === 0) {
                currentMonth = 11;
                currentYear--;
            } else {
                currentMonth--;
            }
            updateCalendar();
        });
        
        document.getElementById('nextMonth').addEventListener('click', function() {
            if (currentMonth === 11) {
                currentMonth = 0;
                currentYear++;
            } else {
                currentMonth++;
            }
            updateCalendar();
        });
    }


    // Обработка формы RSVP
// Обработка формы RSVP
const rsvpForm = document.getElementById('rsvpForm');
const formMessage = document.getElementById('formMessage');

// Показать/скрыть поле "Другое" для алкоголя
const alcoholOtherCheckbox = document.getElementById('alcoholOtherCheckbox');
const alcoholOtherContainer = document.getElementById('alcoholOtherContainer');

if (alcoholOtherCheckbox) {
    alcoholOtherCheckbox.addEventListener('change', function() {
        alcoholOtherContainer.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) {
            document.getElementById('alcoholOtherText').value = '';
        }
    });
}

// Показать/скрыть поле "Другие особенности" для еды
const foodOtherCheckbox = document.getElementById('foodOtherCheckbox');
const foodOtherContainer = document.getElementById('foodOtherContainer');

if (foodOtherCheckbox) {
    foodOtherCheckbox.addEventListener('change', function() {
        foodOtherContainer.style.display = this.checked ? 'block' : 'none';
        if (!this.checked) {
            document.getElementById('foodOtherText').value = '';
        }
    });
}

if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Получаем значения формы
        const name = document.getElementById('name').value;
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('message').value;
        
        // Собираем выбранные алкогольные предпочтения
        const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]:checked');
        const alcoholPreferences = Array.from(alcoholCheckboxes).map(cb => {
            const labels = {
                'white_wine': 'Белое вино',
                'red_wine': 'Красное вино',
                'champagne': 'Шампанское',
                'cognac': 'Коньяк',
                'vodka': 'Водка',
                'none': 'Не пью алкоголь',
                'other': 'Другое'
            };
            return labels[cb.value] || cb.value;
        });
        
        // Добавляем текст "Другое" если заполнен
        const alcoholOtherText = document.getElementById('alcoholOtherText');
        if (alcoholOtherCheckbox && alcoholOtherCheckbox.checked && alcoholOtherText.value.trim()) {
            alcoholPreferences.push(`Другое: ${alcoholOtherText.value.trim()}`);
        }
        
        let alcoholText = '';
        if (alcoholPreferences.length > 0) {
            alcoholText = `\nПредпочтения по алкоголю: ${alcoholPreferences.join(', ')}`;
        }
        
        // Собираем предпочтения по еде
        const foodCheckboxes = document.querySelectorAll('input[name="food"]:checked');
        const foodPreferences = Array.from(foodCheckboxes).map(cb => {
            const labels = {
                'no_meat': 'Не ем мясо',
                'no_fish': 'Не ем рыбу',
                'other': 'Другие особенности'
            };
            return labels[cb.value] || cb.value;
        });
        
        // Добавляем текст "Другие особенности" если заполнен
        const foodOtherText = document.getElementById('foodOtherText');
        if (foodOtherCheckbox && foodOtherCheckbox.checked && foodOtherText.value.trim()) {
            foodPreferences.push(`Особенности питания: ${foodOtherText.value.trim()}`);
        }
        
        let foodText = '';
        if (foodPreferences.length > 0) {
            foodText = `\nПредпочтения по еде: ${foodPreferences.join(', ')}`;
        }
        
        // Формируем сообщение
        let attendanceText = '';
        switch(attendance) {
            case 'yes': attendanceText = 'буду'; break;
            case 'plusone': attendanceText = 'буду с парой'; break;
            case 'family': attendanceText = 'придём семьёй'; break;
            case 'no': attendanceText = 'не смогу'; break;
        }
        
        // Показываем сообщение
        formMessage.textContent = `Благодарим вас, ${name}! Вы ответили, что ${attendanceText}.${alcoholText}${foodText} ${message ? '\nВаше сообщение: ' + message : ''} Мы свяжемся с вами для уточнения деталей.`;
        formMessage.style.display = 'block';
        formMessage.style.backgroundColor = 'rgba(180, 189, 170, 0.3)';
        formMessage.style.color = '#4a5345';
        formMessage.style.border = '1px solid rgba(162, 172, 148, 0.5)';
        
        // Сбрасываем форму
        rsvpForm.reset();
        
        // Сбрасываем чекбоксы
        document.querySelectorAll('input[name="alcohol"]').forEach(cb => cb.checked = false);
        document.querySelectorAll('input[name="food"]').forEach(cb => cb.checked = false);
        
        // Скрываем поля "Другое"
        if (alcoholOtherContainer) alcoholOtherContainer.style.display = 'none';
        if (foodOtherContainer) foodOtherContainer.style.display = 'none';
        if (alcoholOtherText) alcoholOtherText.value = '';
        if (foodOtherText) foodOtherText.value = '';
        
        // Плавная прокрутка к сообщению
        formMessage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Скрываем сообщение через 6 секунд
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 6000);
    });
}
