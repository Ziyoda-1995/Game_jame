// ========================================
// DATA.JS - Game Data & Level Generation
// ========================================

const ZIJ_DATA = [
    {
        name: { uz: "KICHIK AYIQ", ru: "МАЛАЯ МЕДВЕДИЦА" },
        desc: { uz: "Qutb yulduzi (Polaris) joylashgan kichik cho'mich.", ru: "Содержит Полярную звезду." },
        funFact: { uz: "Ulug'bek bu yulduz turkumini 1437 yilda o'lchab, Qutb yulduzining aniq joylashuvini aniqladi.", ru: "Улугбек в 1437 году точно измерил положение Полярной звезды." },
        stars: [{ x: 0, y: 0 }, { x: 1.5, y: 0.5 }, { x: 3, y: 1 }, { x: 4, y: 2 }, { x: 5, y: 2 }, { x: 5, y: 0.5 }, { x: 4, y: 0.5 }]
    },
    {
        name: { uz: "KATTA AYIQ", ru: "БОЛЬШАЯ МЕДВЕДИЦА" },
        desc: { uz: "Yetti yulduzdan iborat mashhur katta cho'mich.", ru: "Семь ярких звезд, образующих Ковш." },
        funFact: { uz: "Bu turkum Ulug'bek rasadxonasida kuzatilgan eng yorqin yulduzlardan biri hisoblanadi.", ru: "Это созвездие было одним из самых ярких, наблюдаемых в обсерватории Улугбека." },
        stars: [{ x: -4, y: 3 }, { x: -2, y: 2.5 }, { x: 0, y: 2 }, { x: 1, y: 0 }, { x: 1, y: -2 }, { x: 4, y: -2 }, { x: 4, y: 0 }]
    },
    {
        name: { uz: "KASSIOPEYA", ru: "КАССИОПЕЯ" },
        desc: { uz: "Efiopiya malikasi, osmondagi 'W' harfi.", ru: "Королева Эфиопии, форма 'W'." },
        funFact: { uz: "Zij-i Sultoniy katalogida bu turkumning 5 ta asosiy yulduzi juda aniq tavsiflanган.", ru: "В каталоге Зидж-и Султани точно описаны 5 главных звезд этого созвездия." },
        stars: [{ x: -3, y: 2 }, { x: -1.5, y: -1 }, { x: 0, y: 0.5 }, { x: 1.5, y: -1 }, { x: 3, y: 2 }]
    },
    {
        name: { uz: "SEFEY", ru: "ЦЕФЕЙ" },
        desc: { uz: "Uy tomi shaklidagi qirol yulduzi.", ru: "Созвездие в форме домика." },
        funFact: { uz: "Ulug'bek astronomlari bu turkumni qirol saroyi ramzi sifatida tasvirlaganlar.", ru: "Астрономы Улугбека изображали это созвездие как символ царского дворца." },
        stars: [{ x: -2, y: -2 }, { x: 2, y: -2 }, { x: 2, y: 1 }, { x: 0, y: 3 }, { x: -2, y: 1 }]
    },
    {
        name: { uz: "AJDAR", ru: "ДРАКОН" },
        desc: { uz: "Shimoliy qutb atrofida aylanuvchi uzun ajdar.", ru: "Длинный дракон вокруг полюса." },
        funFact: { uz: "Bu eng uzun yulduz turkumlaridan biri bo'lib, Ulug'bek uni 15 yil davomida kuzatgan.", ru: "Одно из самых длинных созвездий, которое Улугбек наблюдал в течение 15 лет." },
        stars: [{ x: -4, y: -1 }, { x: -2, y: 0 }, { x: 0, y: -2 }, { x: 2, y: -1 }, { x: 3, y: 1 }, { x: 4, y: 3 }, { x: 2, y: 4 }]
    },
    {
        name: { uz: "OQQUSH", ru: "ЛЕБЕДЬ" },
        desc: { uz: "Somon Yo'lida uchayotgan qush (Shimoliy Xoch).", ru: "Лебедь, летящий по Млечному Пути." },
        funFact: { uz: "Deneb yulduzi - bu turkumning eng yorqini, Ulug'bek uni 'Tovuqning dumi' deb atagan.", ru: "Звезда Денеб - самая яркая в созвездии, Улугбек называл её 'Хвост курицы'." },
        stars: [{ x: 0, y: 3 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 0, y: -3 }, { x: -2, y: 1 }, { x: 2, y: 1 }]
    },
    {
        name: { uz: "LIRA", ru: "ЛИРА" },
        desc: { uz: "Vega yulduzi va kichik parallelogram.", ru: "Звезда Вега и параллелограмм." },
        funFact: { uz: "Vega - Ulug'bek katalogida ikkinchi eng yorqin yulduz sifatida qayd etilgan.", ru: "Вега - вторая по яркости звезда в каталоге Улугбека." },
        stars: [{ x: 0, y: 3 }, { x: -1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }]
    },
    {
        name: { uz: "BURGUT", ru: "ОРЕЛ" },
        desc: { uz: "Altair yulduzi joylashgan burgut.", ru: "Орел с яркой звездой Альтаир." },
        funFact: { uz: "Altair yulduzi Samarqand rasadxonasidan har kuni kuzatilgan.", ru: "Звезда Альтаир наблюдалась ежедневно из Самаркандской обсерватории." },
        stars: [{ x: 0, y: 2 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -2 }, { x: -3, y: -1 }, { x: 3, y: -1 }]
    },
    {
        name: { uz: "DELFIN", ru: "ДЕЛЬФИН" },
        desc: { uz: "Kichik va chiroyli delfin shakli.", ru: "Маленькое красивое созвездие." },
        funFact: { uz: "Ulug'bek bu kichik turkumning 4 ta yulduzini juda aniq o'lchagan.", ru: "Улугбек точно измерил 4 звезды этого маленького созвездия." },
        stars: [{ x: -1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }, { x: -2, y: -2 }]
    },
    {
        name: { uz: "PEGAS", ru: "ПЕГАС" },
        desc: { uz: "Katta kvadrat shaklidagi qanotli ot.", ru: "Крылатый конь, Большой Квадрат." },
        funFact: { uz: "Pegas turkumining 'Katta Kvadrati' Ulug'bek rasadxonasida vaqtni o'lchash uchun ishlatilgan.", ru: "'Большой Квадрат' Пегаса использовался для измерения времени в обсерватории." },
        stars: [{ x: -2, y: 2 }, { x: 2, y: 2 }, { x: 2, y: -2 }, { x: -2, y: -2 }, { x: 4, y: 3 }, { x: 5, y: 1 }]
    },
    {
        name: { uz: "ANDROMEDA", ru: "АНДРОМЕДА" },
        desc: { uz: "Pegasga ulangan zanjirband malika.", ru: "Принцесса, прикованная к Пегасу." },
        funFact: { uz: "Bu turkumda birinchi marta Ulug'bek tomonidan 'tumanlik' (galaktika) kuzatilgan.", ru: "В этом созвездии Улугбек впервые наблюдал 'туманность' (галактику)." },
        stars: [{ x: -3, y: -1 }, { x: -1, y: 0 }, { x: 1, y: 1 }, { x: 3, y: 2 }, { x: 2, y: 3 }]
    },
    {
        name: { uz: "UCHBURCHAK", ru: "ТРЕУГОЛЬНИК" },
        desc: { uz: "Kichik va aniq uchburchak.", ru: "Маленький вытянутый треугольник." },
        funFact: { uz: "Ulug'bek bu turkumni geometriya darslarida misollar uchun ishlatgan.", ru: "Улугбек использовал это созвездие для примеров на уроках геометрии." },
        stars: [{ x: -2, y: -1 }, { x: 2, y: -1 }, { x: 0, y: 2 }]
    },
    {
        name: { uz: "ARAVAKASH", ru: "ВОЗНИЧИЙ" },
        desc: { uz: "Kapella yulduzi va beshburchak shakli.", ru: "Звезда Капелла и пятиугольник." },
        funFact: { uz: "Kapella - yilning ko'p qismida ko'rinadigan eng yorqin yulduzlardan biri.", ru: "Капелла - одна из самых ярких звезд, видимых большую часть года." },
        stars: [{ x: 0, y: 3 }, { x: -2, y: 1 }, { x: -1.5, y: -2 }, { x: 1.5, y: -2 }, { x: 2, y: 1 }]
    },
    {
        name: { uz: "PERSEY", ru: "ПЕРСЕЙ" },
        desc: { uz: "Afsonaviy qahramon shakli.", ru: "Герой, победивший Медузу." },
        funFact: { uz: "Bu turkumda Ulug'bek 'o'zgaruvchan yulduz'larni birinchi marta qayd etgan.", ru: "В этом созвездии Улугбек впервые зафиксировал 'переменные звезды'." },
        stars: [{ x: 0, y: 3 }, { x: 0, y: 1 }, { x: -2, y: -2 }, { x: 2, y: -1 }, { x: 3, y: 1 }]
    },
    {
        name: { uz: "HOVON", ru: "ВОЛОПАС" },
        desc: { uz: "Arktur yulduzi va varrak shakli.", ru: "Звезда Арктур, форма воздушного змея." },
        funFact: { uz: "Arktur - bahor osmoni eng yorqin yulduzi, Ulug'bek uni 'Qo'riqchi' deb atagan.", ru: "Арктур - самая яркая звезда весеннего неба, Улугбек называл её 'Страж'." },
        stars: [{ x: 0, y: -3 }, { x: -2, y: 1 }, { x: -1, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 1 }]
    },
    {
        name: { uz: "SHIMOLIY TOJ", ru: "СЕВЕРНАЯ КОРОНА" },
        desc: { uz: "Yarim aylana shaklidagi toj.", ru: "Полукруг из звезд." },
        funFact: { uz: "Bu turkum Ulug'bek saroyi ustida ko'rinadigan eng chiroyli turkumlardan biri edi.", ru: "Это созвездие было одним из красивейших, видимых над дворцом Улугбека." },
        stars: [{ x: -3, y: 1 }, { x: -2, y: 0 }, { x: -1, y: -0.5 }, { x: 0, y: -0.5 }, { x: 1, y: 0 }, { x: 2, y: 1 }, { x: 3, y: 2 }]
    },
    {
        name: { uz: "GERKULES", ru: "ГЕРКУЛЕС" },
        desc: { uz: "Markazida 'Keystone' (trapetsiya) bor pahlavon.", ru: "Герой с трапецией в центре." },
        funFact: { uz: "Gerkules turkumida Ulug'bek 75 ta yulduzni kataloglashtirgan.", ru: "В созвездии Геркулеса Улугбек каталогизировал 75 звезд." },
        stars: [{ x: -1, y: 1 }, { x: 1, y: 1 }, { x: 1, y: -1 }, { x: -1, y: -1 }, { x: -2, y: 3 }, { x: 2, y: 3 }]
    },
    {
        name: { uz: "ILON ELTUVCHI", ru: "ЗМЕЕНОСЕЦ" },
        desc: { uz: "Katta ko'pburchak shakli.", ru: "Большой многоугольник." },
        funFact: { uz: "Bu turkum yozda Samarqand osmonida eng baland ko'tariladi.", ru: "Это созвездие достигает наивысшей точки летом на небе Самарканда." },
        stars: [{ x: 0, y: 3 }, { x: -2, y: 1 }, { x: -1.5, y: -3 }, { x: 1.5, y: -3 }, { x: 2, y: 1 }]
    },
    {
        name: { uz: "ILON", ru: "ЗМЕЯ" },
        desc: { uz: "Ilonning boshi (Serpens Caput).", ru: "Голова змеи." },
        funFact: { uz: "Yagona turkum ikki qismga bo'lingan - boshi va dumi.", ru: "Единственное созвездие, разделенное на две части - голову и хвост." },
        stars: [{ x: 0, y: -2 }, { x: 1, y: 0 }, { x: -1, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 1 }]
    },
    {
        name: { uz: "O'Q", ru: "СТРЕЛА" },
        desc: { uz: "Osmon bo'ylab uchayotgan o'q.", ru: "Летящая стрела." },
        funFact: { uz: "Eng kichik yulduz turkumlaridan biri, lekin Ulug'bek uni juda muhim deb hisoblagan.", ru: "Одно из самых маленьких созвездий, но Улугбек считал его очень важным." },
        stars: [{ x: -3, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: -3, y: 1 }, { x: -3, y: -1 }]
    },
    {
        name: { uz: "HAMAL (QO'Y)", ru: "ОВЕН" },
        desc: { uz: "Oddiy egri chiziq shakli.", ru: "Изогнутая линия." },
        funFact: { uz: "Bahor tengkunligi nuqtasi ilgari shu turkumda joylashgan edi.", ru: "Точка весеннего равноденствия раньше находилась в этом созвездии." },
        stars: [{ x: -3, y: -1 }, { x: 1, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }]
    },
    {
        name: { uz: "SAVR (BUQA)", ru: "ТЕЛЕЦ" },
        desc: { uz: "Aldebaran va 'V' shaklidagi bosh.", ru: "Голова быка в форме 'V'." },
        funFact: { uz: "Aldebaran yulduzi 'Buqaning ko'zi' deb ataladi va eng qadimgi yulduzlardan.", ru: "Звезда Альдебаран называется 'Глаз быка' и является древнейшей." },
        stars: [{ x: 0, y: 0 }, { x: -2, y: 3 }, { x: -2, y: 1 }, { x: 2, y: 3 }, { x: 3, y: 0 }, { x: 0, y: 0 }]
    },
    {
        name: { uz: "JAVZO (EGIZAKLAR)", ru: "БЛИЗНЕЦЫ" },
        desc: { uz: "Kastor va Polluks - ikki parallel chiziq.", ru: "Две параллельные линии." },
        funFact: { uz: "Kastor va Polluks - qadimgi yunon afsonasidagi egizak qahramonlar nomi.", ru: "Кастор и Поллукс - имена близнецов-героев из древнегреческих мифов." },
        stars: [{ x: -2, y: 3 }, { x: -2, y: -3 }, { x: 2, y: 3 }, { x: 2, y: -3 }, { x: 0, y: 0 }]
    },
    {
        name: { uz: "SARATON (QISQICHBAQA)", ru: "РАК" },
        desc: { uz: "Teskari 'Y' shakli.", ru: "Перевернутая 'Y'." },
        funFact: { uz: "Yoz tengkunligi nuqtasi bu turkumda joylashgan edi.", ru: "Точка летнего солнцестояния находилась в этом созвездии." },
        stars: [{ x: 0, y: 0 }, { x: 0, y: -2 }, { x: -2, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }]
    },
    {
        name: { uz: "ASAD (ARSLON)", ru: "ЛЕВ" },
        desc: { uz: "O'roq (so'roq belgisi) va uchburchak.", ru: "Серп и треугольник." },
        funFact: { uz: "Regulus yulduzi - 'Shohlar yulduzi' deb ataladi.", ru: "Звезда Регул называется 'Звездой царей'." },
        stars: [{ x: 2, y: 3 }, { x: 3, y: 2 }, { x: 2, y: 0 }, { x: 0, y: 0 }, { x: -3, y: 1 }, { x: 0, y: -2 }]
    },
    {
        name: { uz: "SUNBULA (PARIZOD)", ru: "ДЕВА" },
        desc: { uz: "Spika yulduzi va 'Y' shakli.", ru: "Звезда Спика, форма 'Y'." },
        funFact: { uz: "Spika - 'Boshoq' ma'nosini anglatadi, dehqonchilik ramzi.", ru: "Спика означает 'Колос', символ земледелия." },
        stars: [{ x: 0, y: -3 }, { x: 0, y: 0 }, { x: -2, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 1 }]
    },
    {
        name: { uz: "MEZON (TAROZI)", ru: "ВЕСЫ" },
        desc: { uz: "To'rtburchak yoki romb shakli.", ru: "Ромб или весы." },
        funFact: { uz: "Kuz tengkunligi nuqtasi bu turkumda joylashgan.", ru: "Точка осеннего равноденствия находится в этом созвездии." },
        stars: [{ x: 0, y: 2 }, { x: -2, y: 0 }, { x: 2, y: 0 }, { x: 0, y: -2 }]
    },
    {
        name: { uz: "AQRAB (CHAYON)", ru: "СКОРПИОН" },
        desc: { uz: "Antares va ilmoq shakli.", ru: "Антарес и хвост крючком." },
        funFact: { uz: "Antares - 'Marsga qarshi turuvchi' ma'nosini anglatadi, qizil rangi uchun.", ru: "Антарес означает 'Противник Марса' из-за красного цвета." },
        stars: [{ x: 3, y: 3 }, { x: 2, y: 2 }, { x: 0, y: 1 }, { x: -2, y: 0 }, { x: -2, y: -2 }, { x: -1, y: -3 }, { x: 1, y: -3 }]
    },
    {
        name: { uz: "QAVS (O'QOTAR)", ru: "СТРЕЛЕЦ" },
        desc: { uz: "Mashhur 'Choynak' shakli.", ru: "Астеризм 'Чайник'." },
        funFact: { uz: "Galaktikamiz markaziga ishora qiladi, Ulug'bek buni sezgan.", ru: "Указывает на центр нашей Галактики, что предчувствовал Улугбек." },
        stars: [{ x: -2, y: -2 }, { x: 2, y: -2 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 0, y: 3 }, { x: 3, y: 0 }]
    },
    {
        name: { uz: "JADIY (TOG' ECHKISI)", ru: "КОЗЕРОГ" },
        desc: { uz: "Katta uchburchak yoki tabassum.", ru: "Большой треугольник." },
        funFact: { uz: "Qish tengkunligi nuqtasi ilgari shu turkumda edi.", ru: "Точка зимнего солнцестояния раньше была в этом созвездии." },
        stars: [{ x: -4, y: 2 }, { x: 0, y: -2 }, { x: 4, y: 2 }, { x: 3, y: 2 }, { x: -3, y: 2 }]
    },
    {
        name: { uz: "DALV (QOVG'A)", ru: "ВОДОЛЕЙ" },
        desc: { uz: "Suv oqimi shaklidagi yulduzlar.", ru: "Поток воды." },
        funFact: { uz: "Qadimda yomg'ir va suv xudosini timsollagan.", ru: "В древности символизировал бога дождя и воды." },
        stars: [{ x: -2, y: 3 }, { x: 0, y: 2 }, { x: 1, y: 0 }, { x: 0, y: -2 }, { x: -1, y: -3 }, { x: 2, y: -1 }]
    },
    {
        name: { uz: "HUT (BALIQLAR)", ru: "РЫБЫ" },
        desc: { uz: "Ikki baliqni bog'lovchi 'V' shakli.", ru: "V-образная лента." },
        funFact: { uz: "Bahor tengkunligi nuqtasi hozirda shu turkumda joylashgan.", ru: "Точка весеннего равноденствия сейчас находится в этом созвездии." },
        stars: [{ x: -3, y: 3 }, { x: 0, y: 0 }, { x: 3, y: 2 }, { x: 4, y: 3 }, { x: -3, y: 2 }]
    },
    {
        name: { uz: "JABBOR (ORION)", ru: "ОРИОН" },
        desc: { uz: "Osmonning eng mashhur uch yulduzli kamari.", ru: "Пояс Ориона." },
        funFact: { uz: "Eng oson taniladigan turkum, Ulug'bek uni 'Osmon qalqoni' deb atagan.", ru: "Самое узнаваемое созвездие, Улугбек называл его 'Щит небес'." },
        stars: [{ x: -2, y: 3 }, { x: 2, y: 3 }, { x: -0.5, y: 0 }, { x: 0, y: 0 }, { x: 0.5, y: 0 }, { x: -2, y: -3 }, { x: 2, y: -3 }]
    },
    {
        name: { uz: "KIT", ru: "КИТ" },
        desc: { uz: "Katta boshli dengiz maxluqi.", ru: "Морское чудовище." },
        funFact: { uz: "Bu turkumda 'Mira' - birinchi topilgan o'zgaruvchan yulduz joylashgan.", ru: "В этом созвездии находится Мира - первая открытая переменная звезда." },
        stars: [{ x: 3, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 0 }, { x: -3, y: -1 }, { x: -4, y: 1 }]
    },
    {
        name: { uz: "QUYON", ru: "ЗАЯЦ" },
        desc: { uz: "Orionning oyog'i ostidagi quyon.", ru: "Заяц под ногами Ориона." },
        funFact: { uz: "Juda qadimiy turkum, misrliklar va yunонlar tomonidan tasvirlangan.", ru: "Очень древнее созвездие, изображенное египтянами и греками." },
        stars: [{ x: -1, y: 1 }, { x: 1, y: 1 }, { x: 2, y: -1 }, { x: -2, y: -1 }, { x: -1, y: -1 }, { x: 1, y: -1 }]
    },
    {
        name: { uz: "KATTA IT", ru: "БОЛЬШОЙ ПЕС" },
        desc: { uz: "Eng yorqin yulduz - Sirius.", ru: "Ярчайшая звезда Сириус." },
        funFact: { uz: "Sirius - butun osmondagi eng yorqin yulduz, Ulug'bek uni 'Itning yulduzi' deb atagan.", ru: "Сириус - ярчайшая звезда всего неба, Улугбек называл её 'Звезда собаки'." },
        stars: [{ x: 0, y: 1 }, { x: -1, y: -1 }, { x: 0, y: -3 }, { x: 2, y: -4 }, { x: -2, y: -4 }]
    },
    {
        name: { uz: "KICHIK IT", ru: "МАЛЫЙ ПЕС" },
        desc: { uz: "Prokyon yulduzi va oddiy chiziq.", ru: "Звезда Процион." },
        funFact: { uz: "Prokyon - 'Itdan oldingi' ma'nosini anglatadi, chunki u Siriusdan oldin chiqadi.", ru: "Процион означает 'Перед собакой', так как восходит раньше Сириуса." },
        stars: [{ x: -2, y: 0 }, { x: 2, y: 0 }]
    },
    {
        name: { uz: "SHUJA (ILON)", ru: "ГИДРА" },
        desc: { uz: "Eng uzun yulduz turkumi.", ru: "Самое длинное созвездие." },
        funFact: { uz: "Osmonning eng katta maydoni egallaydi, Ulug'bek 68 ta yulduzni o'lchagan.", ru: "Занимает самую большую площадь неба, Улугбек измерил 68 звезд." },
        stars: [{ x: 4, y: 0 }, { x: 3, y: 1 }, { x: 1, y: 0 }, { x: -1, y: -1 }, { x: -3, y: 0 }, { x: -5, y: -1 }]
    },
    {
        name: { uz: "JOM (KUBOK)", ru: "ЧАША" },
        desc: { uz: "Yarim aylana kubok shakli.", ru: "Форма чаши." },
        funFact: { uz: "Qadimiy Bobil va Misrda bu turkum muqaddas kubok timsoliэди.", ru: "В древнем Вавилоне и Египте это созвездие символизировало священную чашу." },
        stars: [{ x: -2, y: 2 }, { x: 2, y: 2 }, { x: 1, y: -1 }, { x: -1, y: -1 }]
    },
    {
        name: { uz: "QARG'A", ru: "ВОРОН" },
        desc: { uz: "Trapetsiya shaklidagi to'rt yulduz.", ru: "Четырехугольник." },
        funFact: { uz: "Yunon afsonasida Apollonning qush xizmatkori sifatida tasvirlangan.", ru: "В греческой мифологии изображен как птица-слуга Аполлона." },
        stars: [{ x: -1, y: 2 }, { x: 1, y: 2 }, { x: 2, y: -1 }, { x: -2, y: -1 }]
    }
];

const TITLES = [
    { badge: "📚", name: { uz: "Rasadxona shogirdi", ru: "Ученик обсерватории" }, desc: { uz: "Astronomiya olamiga birinchi qadam", ru: "Первый шаг в мир астрономии" }, level: 5 },
    { badge: "🔭", name: { uz: "Yulduz izlovchi", ru: "Искатель звезд" }, desc: { uz: "Yulduzli osmon xaritasini o'rganuvchi", ru: "Изучающий карту звездного неба" }, level: 10 },
    { badge: "⭐", name: { uz: "Munajjim", ru: "Звездочет" }, desc: { uz: "Yulduzlar siri bilimdoni", ru: "Знаток тайн звезд" }, level: 15 },
    { badge: "🌟", name: { uz: "Yulduz turkumlari ustasi", ru: "Мастер созвездий" }, desc: { uz: "Burj yulduz turkumlari mutaxassisi", ru: "Специалист по зодиакальным созвездиям" }, level: 20 },
    { badge: "💫", name: { uz: "Samoviy navigator", ru: "Небесный навигатор" }, desc: { uz: "Yulduzlar bo'yicha yo'l topuvchi", ru: "Находящий путь по звездам" }, level: 25 },
    { badge: "🌌", name: { uz: "Zij olimi", ru: "Ученый Зиджа" }, desc: { uz: "Ulug'bek Zijini o'rgangan", ru: "Изучивший Зидж Улугбека" }, level: 30 },
    { badge: "👑", name: { uz: "Astronomiya ustasi", ru: "Мастер астрономии" }, desc: { uz: "Buyuk astronomiya ustasi", ru: "Великий мастер астрономии" }, level: 35 },
    { badge: "🏆", name: { uz: "Astronomiya sultoni", ru: "Султан астрономии" }, desc: { uz: "Ulug'bek merosi davomchisi", ru: "Наследник наследия Улугбека" }, level: 40 }
];

const TEST_QUESTIONS = [
    {
        q: { uz: "Mirzo Ulug'bek rasadxonani qaysi shaharda qurgan?", ru: "В каком городе Мирзо Улугбек построил обсерваторию?" },
        options: { uz: ["Samarqand", "Toshkent", "Buxoro", "Xiva"], ru: ["Самарканд", "Ташкент", "Бухара", "Хива"] },
        correct: 0
    },
    {
        q: { uz: "Ulug'bek Zijida nechta yulduz tasvirlangan?", ru: "Сколько звезд описано в каталоге Зидж Улугбека?" },
        options: { uz: ["500", "994", "1018", "1200"], ru: ["500", "994", "1018", "1200"] },
        correct: 2
    },
    {
        q: { uz: "Ulug'bek rasadxonasi qachon qurilgan?", ru: "Когда была построена обсерватория Улугбека?" },
        options: { uz: ["1420", "1428", "1450", "1400"], ru: ["1420", "1428", "1450", "1400"] },
        correct: 1
    },
    {
        q: { uz: "Qutb yulduzi qaysi yulduz turkumida joylashgan?", ru: "В каком созвездии находится Полярная звезда?" },
        options: { uz: ["Katta Ayiq", "Kichik Ayiq", "Kassiopeya", "Ajdar"], ru: ["Большая Медведица", "Малая Медведица", "Кассиопея", "Дракон"] },
        correct: 1
    },
    {
        q: { uz: "Eng yorqin yulduz Sirius qaysi turkumda?", ru: "В каком созвездии находится ярчайшая звезда Сириус?" },
        options: { uz: ["Kichik It", "Katta It", "Burgut", "Lira"], ru: ["Малый Пес", "Большой Пес", "Орел", "Лира"] },
        correct: 1
    },
    {
        q: { uz: "Orion yulduz turkumining eng mashhur qismi nima?", ru: "Как называется самая известная часть созвездия Орион?" },
        options: { uz: ["Kamar", "Qalqon", "Qilich", "Bosh"], ru: ["Пояс", "Щит", "Меч", "Голова"] },
        correct: 0
    },
    {
        q: { uz: "Qaysi yulduz turkumi 'W' harfi shaklida?", ru: "Какое созвездие имеет форму буквы 'W'?" },
        options: { uz: ["Pegas", "Kassiopeya", "Sefey", "Andromeda"], ru: ["Пегас", "Кассиопея", "Цефей", "Андромеда"] },
        correct: 1
    },
    {
        q: { uz: "Vega yulduzi qaysi turkumda joylashgan?", ru: "В каком созвездии находится звезда Вега?" },
        options: { uz: ["Lira", "Oqqush", "Burgut", "Delfin"], ru: ["Лира", "Лебедь", "Орел", "Дельфин"] },
        correct: 0
    },
    {
        q: { uz: "Jami nechta burj yulduz turkumlari bor?", ru: "Сколько всего зодиакальных созвездий?" },
        options: { uz: ["10", "11", "12", "13"], ru: ["10", "11", "12", "13"] },
        correct: 2
    },
    {
        q: { uz: "Ulug'bek o'zining Zijini necha yil davomida yaratgan?", ru: "Сколько лет Улугбек создавал свой Зидж?" },
        options: { uz: ["10 yil", "20 yil", "30 yil", "40 yil"], ru: ["10 лет", "20 лет", "30 лет", "40 лет"] },
        correct: 2
    }
];

// ========================================
// LEVEL GENERATION WITH 8-STEP CYCLE
// ========================================

let LEVELS = [];

function generateFixedLevels() {
    LEVELS = [];

    ZIJ_DATA.forEach((data, index) => {
        // Determine mode based on 8-step repeating pattern
        let mode;
        const modIndex = index % 8;

        switch (modIndex) {
            case 0:
                mode = 'classic';
                break;
            case 1:
                mode = 'shape';
                break;
            case 2:
                mode = 'classic';
                break;
            case 3:
                mode = 'trace';
                break;
            case 4:
                mode = 'classic';
                break;
            case 5:
                mode = 'brightness';
                break;
            case 6:
                mode = 'classic';
                break;
            case 7:
                mode = 'odd_one';
                break;
            default:
                mode = 'classic';
        }

        LEVELS.push({
            name: data.name,
            desc: data.desc,
            stars: data.stars,
            pos: { x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 60, z: -50 },
            mode: mode
        });
    });
}