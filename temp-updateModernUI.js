
        // === ФУНКЦИЯ ОБНОВЛЕНИЯ СОВРЕМЕННЫХ ЭЛЕМЕНТОВ (Material Design 3) ===
        async function updateModernUI() {
            const userCode = localStorage.getItem('zd_login_code') || localStorage.getItem('userPhone');
            if (!userCode) return;
            
            let userData = null;
            try {
                const storedData = localStorage.getItem('zd_user_data') || localStorage.getItem('userData');
                if (storedData) {
                    userData = JSON.parse(storedData);
                }
            } catch (e) {
                console.warn('⚠️ Ошибка парсинга данных для современного UI:', e);
                return;
            }
            
            if (!userData) return;
            
            // Аватар (первые буквы ФИО)
            const avatarEl = document.getElementById('modernUserAvatar');
            const fullName = userData.fio || userData.fullName || userData.name || '';
            if (avatarEl && fullName) {
                const initials = fullName
                    .split(' ')
                    .map(word => word[0])
                    .slice(0, 2)
                    .join('');
                avatarEl.textContent = initials.toUpperCase();
            }
            
            // Имя пользователя в топ-баре
            const modernUserNameEl = document.getElementById('modernUserName');
            if (modernUserNameEl && fullName) {
                modernUserNameEl.textContent = fullName;
            }
            
            // Адрес в топ-баре
            const modernUserAddressEl = document.getElementById('modernUserAddress');
            if (modernUserAddressEl) {
                const house = userData.building_number || userData.house || userData.building || '';
                const apartment = userData.apartment || '';
                if (house && apartment) {
                    modernUserAddressEl.textContent = `д. ${house}, кв. ${apartment}`;
                } else {
                    const address = userData.fullAddress || userData.address || userData.full_address || 'Адрес не указан';
                    modernUserAddressEl.textContent = address.replace('г. Зеленодольск, ', '');
                }
            }
            
            // Баланс в топ-баре (чип)
            const modernBalanceChipEl = document.getElementById('modernBalanceChip');
            if (modernBalanceChipEl) {
                const balanceNum = parseFloat(userData.balance) || 0;
                const formatted = new Intl.NumberFormat('ru-RU', {
                    style: 'currency',
                    currency: 'RUB',
                    minimumFractionDigits: 0
                }).format(Math.abs(balanceNum));
                
                // Убираем все классы
                modernBalanceChipEl.classList.remove('zero', 'positive', 'negative');
                
                if (balanceNum < 0) {
                    modernBalanceChipEl.textContent = formatted;
                    modernBalanceChipEl.classList.add('negative');
                } else if (balanceNum > 0) {
                    modernBalanceChipEl.textContent = `+${formatted}`;
                    modernBalanceChipEl.classList.add('positive');
                } else {
                    modernBalanceChipEl.textContent = formatted;
                    modernBalanceChipEl.classList.add('zero');
                }
            }
            
            console.log('✅ Современный UI обновлён');
        }




