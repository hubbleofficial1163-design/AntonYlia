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
    const giftLink = document.getElementById('giftSubscriptionLink');
    if (giftLink) {
        giftLink.addEventListener('click', function(e) {
            e.preventDefault();
            // TODO: заменить на реальную ссылку на подписку
            alert('Ссылка на подписку будет добавлена позже. Спасибо!');
            // window.location.href = 'ВАША_ССЫЛКА_НА_ПОДПИСКУ';
        });
    }

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