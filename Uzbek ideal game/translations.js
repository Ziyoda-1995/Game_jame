const TRANSLATIONS = {
    uz: {
        // UI Buttons & Headers
        START_GAME: "BOSHLASH",
        SHOP: "DO'KON",
        EXIT: "CHIQISH",
        BACK: "ORTGA",
        CONTINUE: "DAVOM ETISH",
        RESTART: "QAYTA BOSHLASH",
        TO_MAP: "XARITAGA",
        LOGIN_TITLE: "👤 ISMINGIZNI KIRITING",
        LOGIN_BTN: "KIRISH",
        MAP_TITLE: "XARITA",
        PROFILE_TITLE: "👤 PROFIL",
        CLOSE: "YOPISH",
        YES: "HA",
        NO: "YO'Q",

        // HUD
        LEVEL: "BOSQICH",
        COINS: "Tangalar",
        LIVES: "Jonlar",
        TITLES: "Unvonlar",
        SCORE: "Ball",

        // Input & Profile
        ENTER_NAME: "Ismingizni kiriting...",
        SUBMIT: "OK",
        PLAYER: "O'yinchi",
        PLEASE_ENTER_NAME: "Iltimos, ismingizni kiriting!",
        WARNING: "DIQQAT",

        // Shop
        SHOP_TITLE: "🛒 DO'KON",
        SHOP_BALANCE: "Balansingiz:",
        ITEM_LIFE_NAME: "❤️ Qo'shimcha Jon",
        ITEM_LIFE_DESC: "O'yinda ishlatish uchun +1 jon",
        ITEM_HINT_NAME: "💡 Maslahat",
        ITEM_HINT_DESC: "Yulduz qayerdaligini ko'rsatadi",
        ITEM_TELE_NAME: "🔭 Super Teleskop",
        ITEM_TELE_DESC: "Kattalashtirish funksiyasini ochadi (bir umrga)",
        BUY: "SOTIB OLISH",
        ALREADY_BOUGHT: "SOTIB OLINGAN",
        NOT_ENOUGH_COINS: "Mablag' yetarli emas!",
        LIVES_DESC: "+1 Jon (Xatoliklar uchun)",
        TELESCOPE_DESC: "Yulduzlarni ko'rsatadi (Avtomatik)",
        SHOP_BUY_LIFE_SUCCESS: "✅ +1 Jon sotib olindi!<br>Jami jonlar: ",
        SHOP_BUY_HINT_SUCCESS: "✅ Maslahat sotib olindi!<br>💡 Yashil doira faollashtirildi",
        SHOP_BUY_TELESCOPE_SUCCESS: "✅ Super Teleskop sotib olindi!<br>🔭 Zoom faollashtirildi!",
        SHOP_ALREADY_HAVE_TELESCOPE: "ℹ️ Sizda allaqachon Super Teleskop bor!",
        SHOP_START_GAME_FIRST: "⚠️ Avval o'yinni boshlang!",

        // Game Modes Instructions
        MODE_CLASSIC: "YULDUZLARNI KETMA-KET ULANG (1 → 2 → 3...)",
        MODE_SHAPE: "SHAKLGA MOS YULDUZNI TOPING",
        MODE_TRACE: "YULDUZLAR ORASINI CHIZIB BERING",
        MODE_BRIGHTNESS: "XIRA YULDUZDAN YORQINIGA QARAB BOSING",
        MODE_ODD_ONE: "FARQLI YULDUZNI TOPING!",

        // Radar
        RADAR_SEARCHING: "Yulduzlarni qidiring...",
        RADAR_FOUND: "TOPILDI! (Yulduzga bosing)",

        // Alerts & Messages
        VICTORY: "G'ALABA!",
        LEVEL_COMPLETED: "Bosqich yakunlandi!",
        GAME_OVER: "O'YIN TUGADI",
        LIVES_EMPTY: "Jonlaringiz tugadi!\n\nDo'kondan jon sotib oling.",
        WRONG_ORDER: "Noto'g'ri ketma-ketlik!",
        WRONG_SHAPE: "Noto'g'ri shakl!",
        WRONG_STAR: "Noto'g'ri yulduz!",
        OUT_OF_BOUNDS: "Chiziqdan chiqib ketdingiz!",
        ALREADY_CONNECTED: "Allaqachon ulangan.",
        NEED_SHAPE_START: "",
        NEED_SHAPE_END: " qirrali yulduz kerak.",
        STAR_NOT_FOUND: "Yulduz topilmadi!\n\nNuqtali shaklga yaqinroq olib keling.",
        WRONG_ORDER_DESC: "Noto'g'ri tartib!\n\nOjizidan yorqiniga qarab bosing.\n\n-1 Jon",
        NOT_ODD_ONE: "Bu oddiy yulduz!\n\nO'zgachasini toping.\n\n-1 Jon",
        WRONG_STAR_DESC: "Noto'g'ri yulduz!\n\n-1 Jon",
        TRACE_FAIL: "Chiziqdan chiqib ketdingiz!\n\n-1 Jon",
        ERROR_TITLE: "XATOLIK",

        // Modals
        EXIT_TITLE: "O'YINDAN CHIQISH?",
        EXIT_DESC: "Joriy natijalar saqlanmasligi mumkin.",
        RATING_TITLE: "O'YINNI BAHOLANG!",
        RATED_MSG: "Baholandi: ",
        WIN_TITLE: "TABRIKLAYMIZ!",
        WIN_DESC: "Siz bu bosqichdagi yulduz turkumini topdingiz:",
        NEXT_BTN: "KEYINGISI >>",
        QQ_BTN: "CHIQISH",

        // Win Modal
        CONSTELLATION_NAME: "Yulduz Turkumi",
        FUN_FACT: "Qiziqarli Fakt",
        NEXT_LEVEL: "KEYINGI BOSQICH",

        // Titles
        NEW_TITLE: "YANGI UNVON!",
        TITLE_EARNED: "Siz yangi unvonga ega bo'ldingiz:",

        // Test
        TEST_TITLE: "ASTRONOMIYA SINOVI",
        TEST_PASSED: "SINOVDAN O'TDINGIZ!",
        TEST_FAILED: "SINOVDAN O'TA OLMADINGIZ",
        CORRECT_ANSWER: "Javob to'g'ri! +50 tanga",
        WRONG_ANSWER: "Javob noto'g'ri. Qayta urinib ko'ring.",
        TRY_AGAIN: "Qayta urinish"
    },
    ru: {
        // UI Buttons & Headers
        START_GAME: "НАЧАТЬ",
        SHOP: "МАГАЗИН",
        EXIT: "ВЫХОД",
        BACK: "НАЗАД",
        CONTINUE: "ПРОДОЛЖИТЬ",
        RESTART: "ЗАНОВО",
        TO_MAP: "НА КАРТУ",
        LOGIN_TITLE: "👤 ВВЕДИТЕ ИМЯ",
        LOGIN_BTN: "ВОЙТИ",
        MAP_TITLE: "КАРТА",
        PROFILE_TITLE: "👤 ПРОФИЛЬ",
        CLOSE: "ЗАКРЫТЬ",
        YES: "ДА",
        NO: "НЕТ",

        // HUD
        LEVEL: "УРОВЕНЬ",
        COINS: "Монеты",
        LIVES: "Жизни",
        TITLES: "Титулы",
        SCORE: "Счет",

        // Input & Profile
        ENTER_NAME: "Введите ваше имя...",
        SUBMIT: "ОК",
        PLAYER: "Игрок",
        PLEASE_ENTER_NAME: "Пожалуйста, введите ваше имя!",
        WARNING: "ВНИМАНИЕ",

        // Shop
        SHOP_TITLE: "🛒 МАГАЗИН",
        SHOP_BALANCE: "Баланс:",
        ITEM_LIFE_NAME: "❤️ Экстра Жизнь",
        ITEM_LIFE_DESC: "+1 Жизнь для игры",
        ITEM_HINT_NAME: "💡 Подсказка",
        ITEM_HINT_DESC: "Показывает где звезда",
        ITEM_TELE_NAME: "🔭 Супер Телескоп",
        ITEM_TELE_DESC: "Открывает зум (навсегда)",
        BUY: "КУПИТЬ",
        ALREADY_BOUGHT: "КУПЛЕНО",
        NOT_ENOUGH_COINS: "Недостаточно монет!",
        LIVES_DESC: "+1 Жизнь (Для ошибок)",
        TELESCOPE_DESC: "Показывает звезды (Автоматически)",
        SHOP_BUY_LIFE_SUCCESS: "✅ +1 Жизнь куплена!<br>Всего жизней: ",
        SHOP_BUY_HINT_SUCCESS: "✅ Подсказка куплена!<br>💡 Зеленый круг активирован",
        SHOP_BUY_TELESCOPE_SUCCESS: "✅ Супер Телескоп куплен!<br>🔭 Зум активирован!",
        SHOP_ALREADY_HAVE_TELESCOPE: "ℹ️ У вас уже есть Супер Телескоп!",
        SHOP_START_GAME_FIRST: "⚠️ Сначала начните игру!",

        // Game Modes Instructions
        MODE_CLASSIC: "СОЕДИНЯЙТЕ ПО ПОРЯДКУ (1 → 2 → 3...)",
        MODE_SHAPE: "НАЙДИТЕ ЗВЕЗДУ ПО ФОРМЕ",
        MODE_TRACE: "ПРОВЕДИТЕ ТОЧНУЮ ЛИНИЮ МЕЖДУ ЗВЕЗДАМИ",
        MODE_BRIGHTNESS: "НАЖИМАЙТЕ ОТ ТУСКЛЫХ К ЯРКИМ",
        MODE_ODD_ONE: "НАЙДИТЕ ЛИШНЮЮ ЗВЕЗДУ!",

        // Radar
        RADAR_SEARCHING: "Ищите звезды...",
        RADAR_FOUND: "НАЙДЕНО! (Нажмите на звезду)",

        // Alerts & Messages
        VICTORY: "ПОБЕДА!",
        LEVEL_COMPLETED: "Уровень пройден!",
        GAME_OVER: "ИГРА ОКОНЧЕНА",
        LIVES_EMPTY: "Жизни закончились!\n\nКупите жизни в магазине.",
        WRONG_ORDER: "Неверный порядок!",
        WRONG_SHAPE: "Неверная форма!",
        WRONG_STAR: "Неверная звезда!",
        OUT_OF_BOUNDS: "Вы вышли за линию!",
        ALREADY_CONNECTED: "Уже соединено.",
        NEED_SHAPE_START: "Нужна звезда с ",
        NEED_SHAPE_END: " вершинами.",
        STAR_NOT_FOUND: "Звезда не найдена!\n\nПоднесите ближе к пунктирной форме.",
        WRONG_ORDER_DESC: "Неверный порядок!\n\nНажимайте от тусклых к ярким.\n\n-1 Жизнь",
        NOT_ODD_ONE: "Это обычная звезда!\n\nНайдите лишнюю.\n\n-1 Жизнь",
        WRONG_STAR_DESC: "Неверная звезда!\n\n-1 Жизнь",
        TRACE_FAIL: "Вы вышли за линию!\n\n-1 Жизнь",
        ERROR_TITLE: "ОШИБКА",

        // Modals
        EXIT_TITLE: "ВЫЙТИ ИЗ ИГРЫ?",
        EXIT_DESC: "Текущий прогресс может не сохраниться.",
        RATING_TITLE: "ОЦЕНИТЕ ИГРУ!",
        RATED_MSG: "Оценено: ",
        WIN_TITLE: "ПОЗДРАВЛЯЕМ!",
        WIN_DESC: "Вы нашли созвездие этого уровня:",
        NEXT_BTN: "ДАЛЕЕ >>",
        QQ_BTN: "ВЫХОД",

        // Win Modal
        CONSTELLATION_NAME: "Созвездие",
        FUN_FACT: "Интересный факт",
        NEXT_LEVEL: "СЛЕДУЮЩИЙ УРОВЕНЬ",

        // Titles
        NEW_TITLE: "НОВЫЙ ТИТУЛ!",
        TITLE_EARNED: "Вы получили новый титул:",

        // Test
        TEST_TITLE: "АСТРОНОМИЧЕСКИЙ ТЕСТ",
        TEST_PASSED: "ТЕСТ ПРОЙДЕН!",
        TEST_FAILED: "ТЕСТ НЕ ПРОЙДЕН",
        CORRECT_ANSWER: "Верно! +50 монет",
        WRONG_ANSWER: "Неверно. Попробуйте снова.",
        TRY_AGAIN: "Попробовать снова"
    }
};
