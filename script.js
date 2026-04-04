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
    
    // ========== КАЛЕНДАРЬ ==========
    function buildCalendar(month, year) {
        const weddingDate = new Date(2026, 5, 13);
        
        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        
        document.getElementById('calendarMonth').textContent = monthNames[month];
        document.getElementById('calendarYear').textContent = year;
        
        const firstDayOfMonth = new Date(year, month, 1);
        const startDayOfWeek = firstDayOfMonth.getDay();
        let startOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
        
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();
        
        const calendarDays = document.getElementById('calendarDays');
        calendarDays.innerHTML = '';
        
        let dayCounter = 1;
        let nextMonthCounter = 1;
        
        for (let i = 0; i < 42; i++) {
            let dayNumber;
            let isOtherMonth = false;
            let isWedding = false;
            
            if (i < startOffset) {
                dayNumber = prevMonthDays - startOffset + i + 1;
                isOtherMonth = true;
            } else if (dayCounter <= daysInMonth) {
                dayNumber = dayCounter;
                dayCounter++;
            } else {
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
            
            if (year === weddingDate.getFullYear() && 
                month === weddingDate.getMonth() && 
                dayNumber === weddingDate.getDate()) {
                dayDiv.classList.add('wedding-day');
                dayDiv.title = 'Наша свадьба! ♥';
            }
            
            calendarDays.appendChild(dayDiv);
        }
    }
    
    let currentMonth = 5;
    let currentYear = 2026;
    
    function updateCalendar() {
        buildCalendar(currentMonth, currentYear);
    }
    
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

    // ========== ОТПРАВКА ФОРМЫ В GOOGLE SHEETS ==========
    
    // ВАШ URL ОТ APPS SCRIPT - ЗАМЕНИТЕ НА РЕАЛЬНЫЙ
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwVpBBzM9TfOAq7WZEt9d5lwPwn1fsRavP61fJIK4YDNDLYp3umj5URb9qSplOuD4jc/exec';
    
    // Функция показа уведомлений
    function showNotification(message, isError = false) {
        let notification = document.getElementById('form-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'form-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                padding: 15px 30px;
                border-radius: 50px;
                font-family: 'Cormorant Garamond', serif;
                font-size: 16px;
                font-weight: 500;
                z-index: 9999;
                text-align: center;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(notification);
        }
        
        notification.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
        notification.style.color = 'white';
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.opacity = '1';
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 4000);
    }
    
    // Показать/скрыть поле "Другое" для алкоголя
    const alcoholOtherCheckbox = document.getElementById('alcoholOtherCheckbox');
    const alcoholOtherContainer = document.getElementById('alcoholOtherContainer');
    
    if (alcoholOtherCheckbox) {
        alcoholOtherCheckbox.addEventListener('change', function() {
            alcoholOtherContainer.style.display = this.checked ? 'block' : 'none';
            if (!this.checked) {
                const otherText = document.getElementById('alcoholOtherText');
                if (otherText) otherText.value = '';
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
                const otherText = document.getElementById('foodOtherText');
                if (otherText) otherText.value = '';
            }
        });
    }
    
    // Обработка формы RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Получаем значения формы
            const name = document.getElementById('name').value.trim();
            const attendance = document.getElementById('attendance').value;
            const message = document.getElementById('message').value.trim();
            
            // Валидация
            if (!name) {
                showNotification('Пожалуйста, укажите ваше имя', true);
                return;
            }
            
            if (!attendance) {
                showNotification('Пожалуйста, выберите вариант присутствия', true);
                return;
            }
            
            // Собираем алкогольные предпочтения
            const alcoholCheckboxes = document.querySelectorAll('input[name="alcohol"]:checked');
            const alcoholPreferences = [];
            
            for (const cb of alcoholCheckboxes) {
                if (cb.value === 'other') {
                    const otherText = document.getElementById('alcoholOtherText');
                    if (otherText && otherText.value.trim()) {
                        alcoholPreferences.push(`other: ${otherText.value.trim()}`);
                    }
                } else {
                    alcoholPreferences.push(cb.value);
                }
            }
            
            // Собираем пищевые предпочтения
            const foodCheckboxes = document.querySelectorAll('input[name="food"]:checked');
            const foodPreferences = [];
            
            for (const cb of foodCheckboxes) {
                if (cb.value === 'other') {
                    const otherText = document.getElementById('foodOtherText');
                    if (otherText && otherText.value.trim()) {
                        foodPreferences.push(`other: ${otherText.value.trim()}`);
                    }
                } else {
                    foodPreferences.push(cb.value);
                }
            }
            
            // Блокируем кнопку
            const submitBtn = rsvpForm.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            showNotification('Отправляем ваш ответ...', false);
            
            try {
                // Формируем данные для отправки
                const formData = new URLSearchParams();
                formData.append('name', name);
                formData.append('attendance', attendance);
                formData.append('message', message);
                
                for (const pref of alcoholPreferences) {
                    formData.append('alcohol', pref);
                }
                
                for (const pref of foodPreferences) {
                    formData.append('food', pref);
                }
                
                // Отправляем POST запрос
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                });
                
                const result = await response.json();
                
                if (result.result === 'success') {
                    showNotification('✅ Спасибо! Ваш ответ сохранен.', false);
                    
                    // Показываем сообщение в форме
                    let attendanceText = '';
                    switch(attendance) {
                        case 'yes': attendanceText = 'буду'; break;
                        case 'plusone': attendanceText = 'буду с парой'; break;
                        case 'family': attendanceText = 'придём семьёй'; break;
                        case 'no': attendanceText = 'не смогу'; break;
                    }
                    
                    formMessage.textContent = `Благодарим вас, ${name}! Вы ответили, что ${attendanceText}. Ваш ответ сохранен.`;
                    formMessage.style.display = 'block';
                    formMessage.style.backgroundColor = 'rgba(180, 189, 170, 0.3)';
                    formMessage.style.color = '#4a5345';
                    formMessage.style.border = '1px solid rgba(162, 172, 148, 0.5)';
                    
                    // Сбрасываем форму
                    rsvpForm.reset();
                    document.querySelectorAll('input[name="alcohol"]').forEach(cb => cb.checked = false);
                    document.querySelectorAll('input[name="food"]').forEach(cb => cb.checked = false);
                    
                    if (alcoholOtherContainer) alcoholOtherContainer.style.display = 'none';
                    if (foodOtherContainer) foodOtherContainer.style.display = 'none';
                    
                    // Плавная прокрутка к сообщению
                    formMessage.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Скрываем сообщение через 6 секунд
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 6000);
                    
                } else {
                    showNotification('❌ Ошибка: ' + result.message, true);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showNotification('❌ Ошибка отправки. Попробуйте еще раз.', true);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
