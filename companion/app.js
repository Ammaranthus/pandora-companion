(() => {
  const KEY = "pandora-mothership-companion-v1";
  const MAX_LOG = 30;

  const CLASSES = [
    {
      id: "marine",
      name: "Морпех",
      trauma: "Когда вы впадаете в панику, каждый союзник рядом делает испытание Страха.",
      wounds: 3,
      bonuses: ["+10 Бой", "+10 Тело", "+20 Страх", "+1 макс. ран"],
      skills: "Военная подготовка, Атлетика",
      skillPick: "1 экспертный ИЛИ 2 обученных",
      blurb: "Боец команды: силён в стычке, но паника бьёт по экипажу.",
    },
    {
      id: "android",
      name: "Андроид",
      trauma: "Испытания Страха союзников рядом идут с помехой.",
      wounds: 3,
      bonuses: ["+20 Интеллект", "−10 к одной характеристике", "+60 Страх", "+1 макс. ран"],
      skills: "Лингвистика, Компьютеры, Математика",
      skillPick: "1 экспертный ИЛИ 2 обученных",
      blurb: "Холодный и точный — пугает экипаж своим бесчеловечием.",
    },
    {
      id: "scientist",
      name: "Учёный",
      trauma: "При провале испытания Рассудка союзники рядом получают +1 стресс.",
      wounds: 2,
      bonuses: ["+10 Интеллект", "+5 к одной характеристике", "+30 Рассудок"],
      skills: "1 мастерский + его экспертный и обученный пререквизит",
      skillPick: "ещё 1 обученный",
      blurb: "Врач, исследователь или тот, кто режет скальпелем — тварей и заражённых.",
    },
    {
      id: "teamster",
      name: "Специалист",
      trauma: "Раз за сессию можете бросить проверку паники с преимуществом.",
      wounds: 2,
      bonuses: ["+5 ко всем характеристикам", "+10 ко всем испытаниям"],
      skills: "Пром. оборудование, Невесомость",
      skillPick: "1 обученный и 1 экспертный",
      blurb: "Синий воротничок космоса: механик, инженер, шахтёр, пилот.",
    },
  ];

  // Дерево навыков 1e: requires = хотя бы один; stat = типичная характеристика; blurb = описание из PSG.
  const SKILL_DEFS = [
    // обученные (+10)
    { name: "Лингвистика", bonus: 10, stat: "int", requires: [], blurb: "Изучение языков — живых, мёртвых и ещё не открытых." },
    { name: "Зоология", bonus: 10, stat: "int", requires: [], blurb: "Изучение животного мира." },
    { name: "Ботаника", bonus: 10, stat: "int", requires: [], blurb: "Изучение растительного мира." },
    { name: "Геология", bonus: 10, stat: "int", requires: [], blurb: "Изучение твёрдых структур планет и их спутников." },
    { name: "Пром. оборудование", bonus: 10, stat: "str", requires: [], blurb: "Безопасная работа с тяжёлой техникой и инструментами: экзоскелеты, погрузчики, буры, лазерные резаки и т.п." },
    { name: "Умелые руки", bonus: 10, stat: "int", requires: [], blurb: "Импровизированный ремонт подручными средствами и материалами." },
    { name: "Химия", bonus: 10, stat: "int", requires: [], blurb: "Наука о веществах, их элементах и соединениях." },
    { name: "Компьютеры", bonus: 10, stat: "int", requires: [], blurb: "Свободное владение компьютерами и сетевыми технологиями." },
    { name: "Невесомость", bonus: 10, stat: "spd", requires: [], blurb: "Работа в вакууме, ориентация в пространстве, использование скафандра." },
    { name: "Математика", bonus: 10, stat: "int", requires: [], blurb: "Наука о числах, количестве и пространстве." },
    { name: "Искусство", bonus: 10, stat: "int", requires: [], blurb: "Творческие способности и воображение разумных видов." },
    { name: "Археология", bonus: 10, stat: "int", requires: [], blurb: "Древние культуры и артефакты." },
    { name: "Теология", bonus: 10, stat: "int", requires: [], blurb: "Изучение божественного и религиозных практик." },
    { name: "Военная подготовка", bonus: 10, stat: "cmb", requires: [], blurb: "Базовая подготовка, доступная всем военнослужащим.", perk: ["Перезарядка — свободное действие.", "Автомат с пометкой 1(3): с навыком — несколько выстрелов до перезарядки (число из таблицы).", "Без навыка один выстрел опустошает магазин."] },
    { name: "Знание окраин", bonus: 10, stat: "int", requires: [], blurb: "Колонии на Окраине, их обычаи и криминальная сторона галактики." },
    { name: "Атлетика", bonus: 10, stat: "spd", requires: [], blurb: "Физическая подготовка, спорт и игры.", perk: ["Ближняя атака: если нет Рукопашного боя и Военной подготовки, даёт бонус навыка (+10) к проверке Боя."] },
    // экспертные (+15)
    { name: "Психология", bonus: 15, stat: "int", requires: ["Лингвистика"], blurb: "Наука о поведении и работе человеческого разума." },
    { name: "Патология", bonus: 15, stat: "int", requires: ["Зоология"], blurb: "Изучение причин и последствий заболеваний." },
    { name: "Полевая медицина", bonus: 15, stat: "int", requires: ["Зоология", "Ботаника"], blurb: "Оказание экстренной медицинской помощи.", perk: ["Импровизированная первая помощь без помехи.", "Без навыка та же проверка идёт с [−]."] },
    { name: "Экология", bonus: 15, stat: "int", requires: ["Зоология", "Ботаника", "Геология"], blurb: "Организмы и их взаимодействие с окружающей средой." },
    { name: "Добыча астероидов", bonus: 15, stat: "str", requires: ["Геология", "Пром. оборудование"], blurb: "Оборудование и методы разработки астероидных месторождений." },
    { name: "Мех. ремонт", bonus: 15, stat: "int", requires: ["Пром. оборудование", "Умелые руки"], blurb: "Восстановление работоспособности сломанных механизмов." },
    { name: "Взрывчатка", bonus: 15, stat: "int", requires: ["Химия", "Военная подготовка"], blurb: "Проектирование и применение взрывчатки: бомбы, гранаты, мины и т.п." },
    { name: "Фармакология", bonus: 15, stat: "int", requires: ["Химия"], blurb: "Наука о лекарствах и медикаментозном лечении." },
    { name: "Хакерство", bonus: 15, stat: "int", requires: ["Компьютеры"], blurb: "Несанкционированный доступ к компьютерным системам и сетям." },
    { name: "Пилотирование", bonus: 15, stat: "spd", requires: ["Невесомость"], blurb: "Управление летательными аппаратами, космическими кораблями и другим транспортом." },
    { name: "Мистицизм", bonus: 15, stat: "int", requires: ["Теология", "Искусство", "Археология"], blurb: "Духовное постижение скрытых знаний." },
    { name: "Тактика", bonus: 15, stat: "cmb", requires: ["Военная подготовка"], blurb: "Боевое планирование, маневры и управление стычкой.", perk: ["Бонус навыка к проверке Скорости на порядок хода.", "Можешь отдать этот бонус одному союзнику."] },
    { name: "Выживание", bonus: 15, stat: "spd", requires: ["Атлетика", "Знание окраин", "Военная подготовка"], blurb: "Добыча пищи, воды и укрытия в условиях дикой природы." },
    { name: "Огнестрел", bonus: 15, stat: "cmb", requires: ["Военная подготовка"], blurb: "Безопасное и эффективное использование стрелкового оружия.", perk: ["Перезарядка — свободное действие.", "Автомат с пометкой 1(3): с навыком — несколько выстрелов до перезарядки (число из таблицы).", "Без навыка один выстрел опустошает магазин."] },
    { name: "Рукопашный бой", bonus: 15, stat: "cmb", requires: ["Военная подготовка", "Атлетика"], blurb: "Ближний бой, уличные драки, боевые искусства." },
    // мастерские (+20)
    { name: "Софонтология", bonus: 20, stat: "int", requires: ["Психология"], blurb: "Изучение поведения и разума нечеловеческих существ." },
    { name: "Экзобиология", bonus: 20, stat: "int", requires: ["Патология", "Экология"], blurb: "Поиск и изучение разумной внеземной жизни." },
    { name: "Хирургия", bonus: 20, stat: "int", requires: ["Полевая медицина", "Патология"], blurb: "Операции на живых и мёртвых биологических существах.", perk: ["Полевая хирургия тяжёлых ран без помехи.", "Без навыка та же проверка идёт с [−]."] },
    { name: "Планетология", bonus: 20, stat: "int", requires: ["Экология", "Добыча астероидов"], blurb: "Наука о планетах и других космических телах." },
    { name: "Робототехника", bonus: 20, stat: "int", requires: ["Мех. ремонт", "Хакерство"], blurb: "Разработка, обслуживание и управление роботами, дронами и андроидами." },
    { name: "Инженерия", bonus: 20, stat: "int", requires: ["Мех. ремонт", "Добыча астероидов"], blurb: "Проектирование, создание и использование механизмов, машин и конструкций." },
    { name: "Кибернетика", bonus: 20, stat: "int", requires: ["Мех. ремонт", "Хакерство"], blurb: "Физические и нейронные интерфейсы между организмами и машинами." },
    { name: "ИИ", bonus: 20, stat: "int", requires: ["Хакерство"], blurb: "Изучение разумного поведения машин." },
    { name: "Гиперпространство", bonus: 20, stat: "int", requires: ["Пилотирование", "Математика"], blurb: "Технологии сверхсветового перемещения." },
    { name: "Ксеноэзотерика", bonus: 20, stat: "int", requires: ["Мистицизм"], blurb: "Тайные верования, мистицизм и религии нечеловеческих существ." },
    { name: "Командование", bonus: 20, stat: "cmb", requires: ["Пилотирование", "Огнестрел"], blurb: "Лидерство, влияние и управление.", perk: ["Союзники рядом получают твой бонус к проверке Скорости на порядок хода."] },
  ];

  const SKILL_PRESETS = {
    trained: SKILL_DEFS.filter((s) => s.bonus === 10).map((s) => s.name),
    expert: SKILL_DEFS.filter((s) => s.bonus === 15).map((s) => s.name),
    master: SKILL_DEFS.filter((s) => s.bonus === 20).map((s) => s.name),
  };

  function skillDefByName(name) {
    return SKILL_DEFS.find((s) => s.name === name) || null;
  }

  function skillPerkLines(name) {
    const def = skillDefByName(name);
    if (!def || !def.perk) return [];
    return Array.isArray(def.perk) ? def.perk : [String(def.perk)];
  }

  function skillBlurb(name) {
    const def = skillDefByName(name);
    return (def && def.blurb) || "Описание навыка не задано.";
  }

  // Полезно до 89: броски 90–99 на проверках/испытаниях всегда провал (PSG 1e).
  const STAT_USEFUL_MAX = 89;

  // Подсказки к характеристикам / испытаниям (PSG 1e) и статам монстра (UCR).
  const STAT_TIPS = {
    str: {
      blurb: "Держать шлюз, тащить раненых, лазать, толкать, прыгать — физика под давлением.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Проверка: d100 ≤ Сила (+ навык). Провал: +1 стресс.",
      ],
    },
    spd: {
      blurb: "Успеть до закрытия ворот, действовать раньше кого-то или чего-то, убежать.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Проверка: d100 ≤ Скорость (+ навык). Провал: +1 стресс.",
        "Порядок хода: успех — до врагов, провал — после.",
      ],
    },
    int: {
      blurb: "Вспомнить подготовку под давлением, решить сложную задачу, изобрести или починить.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Проверка: d100 ≤ Интеллект (+ навык). Провал: +1 стресс.",
      ],
    },
    cmb: {
      blurb: "Сражаться за жизнь.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Проверка атаки: d100 ≤ Бой (+ навык). Провал: +1 стресс.",
      ],
    },
    san: {
      blurb: "Рационализировать нестыковки мира, понять хаос, заметить иллюзии и мимикрию, справиться со стрессом.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Испытание: d100 ≤ Рассудок. Провал: +1 стресс.",
      ],
    },
    fear: {
      blurb: "Сохранять голову при страхе, одиночестве, депрессии и других эмоциональных всплесках.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Испытание: d100 ≤ Страх. Провал: +1 стресс.",
        "Неожиданность: провал — оцепенение до следующего раунда.",
      ],
    },
    body: {
      blurb: "Быстрые рефлексы; сопротивляться голоду, болезням и организмам, что пытаются проникнуть внутрь.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Испытание: d100 ≤ Тело. Провал: +1 стресс.",
      ],
    },
    combat: {
      blurb: "Способность монстра драться и защищаться.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Проверка атаки / боя: d100 ≤ Бой.",
      ],
    },
    speed: {
      blurb: "Скорость и реакция, если задана отдельно от Инстинкта.",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Если Скорость не указана — используйте Инстинкт.",
      ],
    },
    instinct: {
      blurb: "Универсальная характеристика для всего, что не указано иначе (Скорость, Интеллект, испытания Тела и т.п.).",
      perk: [
        `Макс. для успеха: ${STAT_USEFUL_MAX} (броски 90–99 всегда провал).`,
        "Если другой стат не задан — бросайте по Инстинкту.",
      ],
    },
  };

  function tipBubbleHtml(blurb, perkLines) {
    let html = `<p class="tip-blurb">${esc(blurb)}</p>`;
    if (perkLines && perkLines.length) {
      html += `<p class="tip-perk-label">Механика</p><ul class="tip-perk-list">${perkLines.map((line) => `<li>${esc(line)}</li>`).join("")}</ul>`;
    }
    return html;
  }

  function tipBubblePlain(blurb, perkLines) {
    return perkLines && perkLines.length ? `${blurb}. Механика: ${perkLines.join(" ")}` : blurb;
  }

  function skillTipHtml(name) {
    return tipBubbleHtml(skillBlurb(name), skillPerkLines(name));
  }

  function skillTipPlain(name) {
    return tipBubblePlain(skillBlurb(name), skillPerkLines(name));
  }

  function skillTipIcon(name) {
    const plain = skillTipPlain(name);
    return `<span class="skill-tip" tabindex="0" data-skill-tip-html="1" data-skill-name="${esc(name)}" aria-label="${esc(plain)}"><span class="skill-tip-mark" aria-hidden="true">?</span></span>`;
  }

  function statTipHtml(key) {
    const def = STAT_TIPS[key];
    if (!def) return `<p class="tip-blurb">${esc(statLabel(key))}</p>`;
    return tipBubbleHtml(def.blurb, def.perk || []);
  }

  function statTipPlain(key) {
    const def = STAT_TIPS[key];
    if (!def) return statLabel(key);
    return tipBubblePlain(def.blurb, def.perk || []);
  }

  function statTipIcon(key) {
    if (!STAT_TIPS[key]) return "";
    const plain = statTipPlain(key);
    return `<span class="skill-tip" tabindex="0" data-skill-tip-html="1" data-stat-tip="${esc(key)}" aria-label="${esc(plain)}"><span class="skill-tip-mark" aria-hidden="true">?</span></span>`;
  }

  let skillTipLayer = null;
  function getSkillTipLayer() {
    if (!skillTipLayer) {
      skillTipLayer = document.createElement("div");
      skillTipLayer.className = "skill-tip-bubble";
      skillTipLayer.setAttribute("role", "tooltip");
      document.body.appendChild(skillTipLayer);
    }
    return skillTipLayer;
  }

  function placeSkillTip(tip) {
    const name = tip.getAttribute("data-skill-name") || "";
    const statKey = tip.getAttribute("data-stat-tip") || "";
    const rangeId = tip.getAttribute("data-range-tip") || "";
    const rangeIds = tip.getAttribute("data-range-tip-ids") || "";
    const bubble = getSkillTipLayer();
    if (statKey) {
      bubble.innerHTML = statTipHtml(statKey);
    } else if (tip.hasAttribute("data-skill-tip-html") && name) {
      bubble.innerHTML = skillTipHtml(name);
    } else if (rangeIds) {
      bubble.innerHTML = rangesTipHtml(rangeIds.split(","));
    } else if (rangeId) {
      bubble.innerHTML = rangeTipHtml(rangeId);
    } else {
      const text = tip.getAttribute("data-skill-tip") || tip.getAttribute("aria-label") || "";
      if (!text) return;
      bubble.textContent = text;
    }
    bubble.classList.add("is-open");
    const r = tip.getBoundingClientRect();
    const pad = 8;
    const bw = Math.min(300, Math.max(200, bubble.offsetWidth || 240));
    bubble.style.width = `${bw}px`;
    const bh = bubble.offsetHeight || 48;
    let left = r.left + r.width / 2 - bw / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - bw - pad));
    let top = r.top - bh - 8;
    if (top < pad) top = r.bottom + 8;
    bubble.style.left = `${Math.round(left)}px`;
    bubble.style.top = `${Math.round(top)}px`;
  }

  function hideSkillTip() {
    if (!skillTipLayer) return;
    skillTipLayer.classList.remove("is-open");
  }

  function bindSkillTips(root = document) {
    els(".skill-tip[data-skill-name], .skill-tip[data-stat-tip], .skill-tip[data-range-tip], .skill-tip[data-range-tip-ids], [data-skill-tip]", root).forEach((tip) => {
      if (tip.dataset.tipBound) return;
      tip.dataset.tipBound = "1";
      tip.addEventListener("mouseenter", () => placeSkillTip(tip));
      tip.addEventListener("mouseleave", hideSkillTip);
      tip.addEventListener("focus", () => placeSkillTip(tip));
      tip.addEventListener("blur", hideSkillTip);
    });
  }

  function skillUnlocks(name) {
    return SKILL_DEFS.filter((s) => (s.requires || []).includes(name)).map((s) => s.name);
  }

  function hasSkillNamed(sheet, name) {
    return (sheet.skills || []).some((s) => s.name === name);
  }

  function skillPrereqMet(sheet, def) {
    const req = def.requires || [];
    if (!req.length) return true;
    return req.some((n) => hasSkillNamed(sheet, n));
  }

  const CONDITION_PRESETS = [
    "Кровотечение", "Сломанная кость", "Слепота", "Заражение", "Мания утопления",
    "Без шлема", "Гидратная чесотка", "Пустой кровь", "Соль Дыхания",
  ];

  // Домовка: эффекты паники = 2к10 + текущий стресс.
  const PANIC_TABLE = [
    { min: 2, max: 3, title: "Концентрация", text: "Преимущество на все броски в течение следующих 1к10 часов." },
    { min: 4, max: 5, title: "Сильный выброс адреналина", text: "Преимущество на все броски в течение следующих 3к10 минут." },
    { min: 6, max: 7, title: "Незначительный выброс адреналина", text: "Преимущество на все броски в течение следующих 1к10 минут." },
    { min: 8, max: 9, title: "Беспокойство", text: "Получи 1 Стресс." },
    { min: 10, max: 11, title: "Нервный тик", text: "Получи 2 Стресса. Соратники рядом получают 1 Стресс." },
    { min: 12, max: 13, title: "Трусость", text: "Получи 1 Стресс. Следующие 1к10 часов вы должны проходить проверку Страха для начала сражения или бежать." },
    { min: 14, max: 15, title: "Галлюцинации", text: "Следующие 2к10 часов (определяется тайно) у вас есть проблемы в отделении реальности от фантазии." },
    { min: 16, max: 17, title: "Парализующий страх", text: "Получите новую постоянную фобию. Всякий раз, когда вы сталкиваетесь с этой фобией пройдите проверку Страха с Помехой или получите 1к10 Стресса." },
    { min: 18, max: 19, title: "Ошеломлён", text: "Получи 1к10 Стресса." },
    { min: 20, max: 21, title: "Испуг", text: "Издать леденящий кровь вопль. Все броски с Помехой 2к10 минут." },
    { min: 22, max: 22, title: "Паранойя", text: "Следующие 1к10 дней, всякий раз, когда кто-то присоединяется к вашей группе (даже если он отошёл ненадолго), пройди проверку Страха или получи 1 Стресс." },
    { min: 23, max: 23, title: "Жажда смерти", text: "Следующие Хк10 дней (где Х = Стресс), всякий раз, когда вы сталкиваетесь с незнакомцем или известным врагом, вы должны пройти проверку Рассудка или немедленно атаковать его." },
    { min: 24, max: 24, title: "Ступор", text: "Вы неотзываетесь и не двигаетесь следующие Хк10 минут (где Х = Стресс)." },
    { min: 25, max: 25, title: "Сломлен", text: "Следующие Хк10 дней (где Х = Стресс), паникуй всякий раз, когда рядом соратник проваливает Спасбросок." },
    { min: 26, max: 26, title: "Психоз", text: "Немедленно атакуйте ближайшего соратника, пока вы не нанесёте, по крайней мере, 2к10 повреждений или 1 Хит, в зависимости от того, что случится раньше. Если поблизости нет соратника, вы нападаете на окружение." },
    { min: 27, max: 27, title: "Гора проблем", text: "Брось по этой таблице дважды и прими результат." },
    { min: 28, max: 28, title: "Погружение в безумие", text: "Получи две новых фобии. Ваш стресс нельзя снять ниже 5." },
    { min: 29, max: 29, title: "Психологический коллапс", text: "Ваш персонаж становится постоянно, непоправимо безумным. Теперь за вашего персонажа играет Смотритель." },
    { min: 30, max: null, title: "Сердечный приступ", text: "Мгновенная смерть." },
  ];

  function panicRangeLabel(row) {
    if (!row) return "—";
    if (row.max == null) return `${row.min}+`;
    if (row.min === row.max) return String(row.min);
    return `${row.min}–${row.max}`;
  }

  function lookupPanic(total) {
    const n = Number(total) || 0;
    return PANIC_TABLE.find((row) => {
      if (row.max == null) return n >= row.min;
      return n >= row.min && n <= row.max;
    }) || PANIC_TABLE[PANIC_TABLE.length - 1];
  }

  function panicBlurb(row) {
    return row ? `${row.title}. ${row.text}` : "Эффект паники.";
  }

  // Mothership 1e PSG — таблица ран (d10, где 0 = «00»). Текст по mothershiprpg.ru / PSG.
  const WOUND_TYPES = [
    { id: "blunt", name: "Тупой" },
    { id: "bleeding", name: "Кровотечение" },
    { id: "gunshot", name: "Огнестрельное" },
    { id: "fire", name: "Огненный/Взрывной" },
    { id: "gore", name: "Разрывной (Увечья)" },
  ];

  const WOUNDS_TABLE = [
    {
      roll: 0,
      severity: "Поверхностная",
      blunt: "Сбит с ног.",
      bleeding: "Брось всё, что держишь в руках.",
      gunshot: "Зацепило. Сбит с ног.",
      fire: "Волосы обгорели. Получи 1d5 стресса.",
      gore: "Рвота. [−] на следующее действие.",
    },
    {
      roll: 1,
      severity: "Лёгкая",
      blunt: "Сбилось дыхание. [−] пока не восстановишь.",
      bleeding: "Много крови. Все на ближней дистанции получают 1 стресс.",
      gunshot: "Кровотечение +1.",
      fire: "Ужасный шрам. +1 к минимальному стрессу.",
      gore: "Ужасный шрам. +1 к минимальному стрессу.",
    },
    {
      roll: 2,
      severity: "Лёгкая",
      blunt: "Подвернул лодыжку. [−] на проверки Скорости.",
      bleeding: "Кровь залила глаза. [−] пока не протрёшь.",
      gunshot: "Сломано ребро.",
      fire: "Обожжён. [−] на следующее действие.",
      gore: "Конечность изуродована.",
    },
    {
      roll: 3,
      severity: "Лёгкая",
      blunt: "Сотрясение. [−] на умственные задачи.",
      bleeding: "Рваная рана. Кровотечение +1.",
      gunshot: "Конечность раздроблена.",
      fire: "Поражение осколками / сильный ожог.",
      gore: "Выколоты глаза.",
    },
    {
      roll: 4,
      severity: "Лёгкая",
      blunt: "Нога или стопа сломана. [−] на проверки Скорости.",
      bleeding: "Глубокий порез. Кровотечение +2.",
      gunshot: "Внутреннее кровотечение. Кровотечение +2.",
      fire: "Обширные ожоги. −1d10 к Силе.",
      gore: "Вырван кусок плоти. −1d10 к Силе.",
    },
    {
      roll: 5,
      severity: "Средняя",
      blunt: "Рука или кисть сломана. [−] для ручных задач.",
      bleeding: "Пальцы рук/ног отрезаны. Кровотечение +3.",
      gunshot: "Пуля застряла. Требуется операция.",
      fire: "Критические ожоги. −2d10 к испытанию Тела.",
      gore: "Парализован ниже пояса.",
    },
    {
      roll: 6,
      severity: "Средняя",
      blunt: "Сломана ключица. [−] на проверки Силы.",
      bleeding: "Рука/нога отрезаны. Кровотечение +4.",
      gunshot: "Огнестрельное ранение в шею.",
      fire: "Необходима пересадка кожи. −2d10 к испытанию Тела.",
      gore: "Конечность оторвана. Кровотечение +5.",
    },
    {
      roll: 7,
      severity: "Тяжёлая (испытание смерти через 1d10 раундов)",
      blunt: "Перелом позвоночника. [−] на все проверки.",
      bleeding: "Конечность отрезана. Кровотечение +5.",
      gunshot: "Тяжёлая кровопотеря. Кровотечение +4.",
      fire: "Конечность горит. 2d10 урона в ход.",
      gore: "Проткнут. Кровотечение +6.",
    },
    {
      roll: 8,
      severity: "Тяжёлая (испытание смерти через 1d10 раундов)",
      blunt: "Перелом черепа. [−] на все проверки.",
      bleeding: "Разрыв крупной артерии. Кровотечение +6.",
      gunshot: "Пробито лёгкое. Кровотечение +5.",
      fire: "Охвачен огнём. 3d10 урона в ход.",
      gore: "Внутренности вываливаются. Кровотечение +7.",
    },
    {
      roll: 9,
      severity: "Смертельная (испытание смерти)",
      blunt: "Спина или шея сломаны. Испытание смерти.",
      bleeding: "Перерезано горло или пробито сердце. Испытание смерти.",
      gunshot: "Попадание в голову. Испытание смерти.",
      fire: "Объят пламенем взрыва. Испытание смерти.",
      gore: "Голова размозжена. Без испытания смерти. Ты умер.",
    },
  ];

  // Домовная таблица крит. ранений (для крит. попаданий врагов по игрокам).
  // Сначала 1d10 (0–9) — часть тела, затем 1d10 (0–9) — тяжесть.
  const CRIT_PARTS = [
    { id: 0, name: "Л. нога" },
    { id: 1, name: "П. нога" },
    { id: 2, name: "Л. рука" },
    { id: 3, name: "П. рука" },
    { id: 4, name: "Внутр. органы" },
    { id: 5, name: "Торс" },
    { id: 6, name: "Живот" },
    { id: 7, name: "Грудь" },
    { id: 8, name: "Спина" },
    { id: 9, name: "Голова" },
  ];
  const CRIT_SEVERITIES = [
    { id: 0, name: "Царапина" },
    { id: 1, name: "Сотрясение (контузия)" },
    { id: 2, name: "Растяжение" },
    { id: 3, name: "Лёгкое ранение" },
    { id: 4, name: "Перелом" },
    { id: 5, name: "Временное увечье" },
    { id: 6, name: "Тяжёлое ранение" },
    { id: 7, name: "Постоянное увечье" },
    { id: 8, name: "Кровотечение" },
    { id: 9, name: "Смертельное ранение", hint: "смерть в 1к10 мин." },
  ];
  // CRIT_CELLS[severity][part]
  const CRIT_CELLS = [
    [
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Поверхностная рана. Незначительный шрам. +1 урон.",
      "Кровь в глазах. Ослеплён (1 раунд)"
    ],
    [
      "Оступился. Упал. +1 урон.",
      "Оступился. Упал. +1 урон.",
      "Оружие выбито из рук. +1 урон.",
      "Оружие выбито из рук. +1 урон.",
      "Спасбросок Тела или сбит с ног. +1к5 урон.",
      "Спасбросок Тела или сбит с ног. +1к5 урон.",
      "Спасбросок Тела или сбит с ног. +1к5 урон.",
      "Спасбросок Тела или сбит с ног. +1к5 урон.",
      "Спасбросок Тела или сбит с ног. +1к5 урон.",
      "Череп проломлен. Помеха к Бою на 1к10 раундов. +1к5 урона."
    ],
    [
      "Потянул лодыжку. +1к5 урона.",
      "Потянул лодыжку. +1к5 урона.",
      "Мешает поднимать руку. +1к5 урона.",
      "Мешает поднимать руку. +1к5 урона.",
      "Шатает. Следующая атака с Помехой.",
      "Шатает. Следующая атака с Помехой.",
      "Шатает. Следующая атака с Помехой.",
      "Шатает. Следующая атака с Помехой.",
      "Шатает. Следующая атака с Помехой.",
      "Лицо навсегда обезображено. Минимальный стресс: 5."
    ],
    [
      "Выбита коленная чашечка. -1к10 Скорости. +1к10 урона.",
      "Выбита коленная чашечка. -1к10 Скорости. +1к10 урона.",
      "Сильный ушиб. -1к10 Силы. +1к10 урона.",
      "Сильный ушиб. -1к10 Силы. +1к10 урона.",
      "Печень повреждена. +1к10 урона/день.",
      "Удар в промежность. Спасбросок Тела или сбит с ног. +1к5 урона.",
      "Удар в солнечное сплетение. 1 раунд прийти в себя. +1к5 урона.",
      "Получил под дых. Сбил дыхание. Скорость/2 пока не отдышался за 1 раунд.",
      "Получил под дых. Сбил дыхание. Скорость/2 пока не отдышался за 1 раунд.",
      "Двоится в глазах. Бой / 2 до конца столкновения."
    ],
    [
      "1к5 пальцев сломано. +1 урон за каждый палец.",
      "1к5 пальцев сломано. +1 урон за каждый палец.",
      "1к5 пальцев сломано. +1 урон за каждый палец.",
      "1к5 пальцев сломано. +1 урон за каждый палец.",
      "Почка отбита. +1к10 +5 урона.",
      "Вывих плеча. +2к10 урона. +1к5 урона при вправлении.",
      "Удар в живот. Спасбросок Тела или опоражнится кишечник +1к10 +2 урона.",
      "Тошнота. Спасбросок Тела или вырвет. +1к10 урона.",
      "Бёдра пробиты. -3к10 Скорость. +2к10 урона.",
      "Выбито 3к10 зубов. +1 урон за каждый зуб."
    ],
    [
      "Нога сломана. +1к10 урона.",
      "Нога сломана. +1к10 урона.",
      "Рука сломана. +1к10 +5 урона.",
      "Рука сломана. +1к10 +5 урона.",
      "Внутреннее кровотечение. +1к10 урона за раунд в течение 1к10 раундов.",
      "1к5 рёбер сломано. +2 урона за ребро. -1к10 Скорость и Сила",
      "Брюшина глубоко рассечена. +1к10 урона в час. +1к5 урона.",
      "Ключица сломана. -3к10 Сила. +1к10 урона.",
      "1к5 рёбер сломано. +2 урона за ребро. -1к10 Скорость и Сила",
      "Потеря сознания. Бросай по таблице Бессознательности (10.4)."
    ],
    [
      "1к5 пальцев оторвано/искалечено. -2к10 Скорость. +1 урон за каждый палец.",
      "1к5 пальцев оторвано/искалечено. -2к10 Скорость. +1 урон за каждый палец.",
      "1к5 пальцев оторвано/искалечено. +1 урон за каждый палец.",
      "1к5 пальцев оторвано/искалечено. +1 урон за каждый палец.",
      "Общий шок. Тело / 2. +2к10 урона.",
      "Невыносимая боль. Спасбросок Тела сохранит сознание. +5к10 урона.",
      "Живот нещадно избит. +4к10 урона и сбит с ног.",
      "Грудина треснула. +2к10 урона.",
      "Смещение позвонков. -2к10 Бой, Скорость и Сила. +2к10 урона.",
      "Горло повреждено. Не можешь говорить. +3к10 урона."
    ],
    [
      "Ступня оторвана или искалечена. Скорость / 2. +2к10 +5 урона.",
      "Ступня оторвана или искалечена. Скорость / 2. +2к10 +5 урона.",
      "Кисть оторвана или искалечена. Бой / 2. +2к10 +5 урона.",
      "Кисть оторвана или искалечена. Бой / 2. +2к10 +5 урона.",
      "Почки отбиты. 1к10 урона за раунд в течение 1к10+1 раундов.",
      "Плечо пробито насквозь. +2к10 урона.",
      "Вырван кусок плоти. Ужасный шрам. +1к10 урона.",
      "Грудная мышца вырвана. +1к10 - 5 урона.",
      "Позвоночник треснул. Парализован ниже пояса. Скорость 0.",
      "Глаза выколоты. Слепота. +2к10 урона."
    ],
    [
      "Порез бедренной артерии. +4к10 урона.",
      "Порез бедренной артерии. +4к10 урона.",
      "Порез плечевой артерии. +4к10 урона.",
      "Порез плечевой артерии. +4к10 урона.",
      "Обширное внутреннее кровотечение. +6к10 урона в течение 1к10 часов.",
      "Лёгкое пробито. +1к10 урона за раунд, пока не вылечишь.",
      "Кишечник пробит. +2к10 урона.",
      "Проникающее ранение грудины. +2к10 урона в раунд, 1к10 раундов.",
      "Позвоночник раздроблен. Навсегда парализован.",
      "Кровоизлияние в мозг через 1к10 дней. Спасбросок Тела или смерть. Диагностируется при сканировании."
    ],
    [
      "Нога оторвана. Скорость 0. +2к10 урона.",
      "Нога оторвана. Скорость 0. +2к10 урона.",
      "Рука оторвана. +2к10 урона.",
      "Рука оторвана. +2к10 урона.",
      "Кишки размотаны наружу, словно верёвки. +1к10 урона.",
      "Желудок взрывается. Кислота заполняет внутренности. +1к10 урона.",
      "Тело разорвано на две части. Мгновенная смерть.",
      "Сердце пробито. Мгновенная смерть.",
      "Спина переломана пополам. Мгновенная смерть.",
      "Вся голова превращается в месиво и мозги ошмётками разлетаются по всей округе. Мгновенная/необратимая смерть."
    ]
  ];

  function critCell(part, sev) {
    return (CRIT_CELLS[sev] && CRIT_CELLS[sev][part]) || "—";
  }

  function critDiceExpr(n, sides, mod = 0) {
    let e = `${n}d${sides}`;
    if (mod) e += mod > 0 ? `+${mod}` : String(mod);
    return e;
  }

  /** Достаёт из текста крита: бонусный урон, тики, «за палец/ребро», длительность. */
  function parseCritDamageJobs(text) {
    const t = String(text || "").replace(/[−–—]/g, "-");
    const jobs = [];
    const used = [];
    const mark = (a, b) => used.push([a, b]);
    const overlaps = (a, b) => used.some(([x, y]) => a < y && b > x);

    const perRe = /(\d+)\s*[кkd]\s*(\d+)\s+(пальц\w*|зуб\w*|рёбер\w*|ребер\w*)([\s\S]{0,80}?)\+(\d+)\s*урон[а]?\s+за\s+(каждый(?:\s+\w+)?|ребро)/gi;
    let m;
    while ((m = perRe.exec(t))) {
      const start = m.index;
      const end = m.index + m[0].length;
      if (overlaps(start, end)) continue;
      mark(start, end);
      jobs.push({
        kind: "per",
        countExpr: critDiceExpr(+m[1], +m[2]),
        per: +m[5],
        unit: m[3],
      });
    }

    const dmgRe = /\+?\s*(\d+)\s*[кkd]\s*(\d+)(?:\s*([+-])\s*(\d+))?\s*урон[а]?/gi;
    while ((m = dmgRe.exec(t))) {
      const start = m.index;
      const end = m.index + m[0].length;
      if (overlaps(start, end)) continue;
      const after = t.slice(end);
      const ctxM = after.match(/^\s*(за\s+раунд|в\s+раунд|\/\s*день|в\s+час|в\s+течение|при\s+вправлен\w*)/i);
      const ctx = ctxM ? ctxM[1].toLowerCase().replace(/\s+/g, " ") : "";
      if (ctx.startsWith("при вправлен")) {
        mark(start, end + (ctxM ? ctxM[0].length : 0));
        continue;
      }
      const mod = m[3] ? (m[3] === "-" ? -Number(m[4]) : Number(m[4])) : 0;
      const expr = critDiceExpr(+m[1], +m[2], mod);
      let kind = "damage";
      let note = "бонусный урон";
      if (/за раунд|в раунд|\/ ?день|в час/.test(ctx)) {
        kind = "tick";
        note = "тик сейчас";
      } else if (/в течение/.test(ctx)) {
        note = "суммарный урон";
      }
      mark(start, end + (ctxM ? ctxM[0].length : 0));
      jobs.push({ kind, expr, note });
    }

    const flatRe = /\+(\d+)\s*урон[а]?(?!\s*за\s)/gi;
    while ((m = flatRe.exec(t))) {
      const start = m.index;
      const end = m.index + m[0].length;
      if (overlaps(start, end)) continue;
      mark(start, end);
      jobs.push({ kind: "flat", amount: +m[1], note: "бонусный урон" });
    }

    const durRe = /в\s+течение\s+(\d+)\s*[кkd]\s*(\d+)(?:\s*([+-])\s*(\d+))?/gi;
    while ((m = durRe.exec(t))) {
      const mod = m[3] ? (m[3] === "-" ? -Number(m[4]) : Number(m[4])) : 0;
      jobs.push({
        kind: "duration",
        expr: critDiceExpr(+m[1], +m[2], mod),
        note: "длительность",
      });
    }
    return jobs;
  }

  function rollCritExtraDamage(text, who = "крит") {
    const jobs = parseCritDamageJobs(text);
    const lines = [];
    for (const job of jobs) {
      if (job.kind === "per") {
        const count = parseDice(job.countExpr);
        if (!count) continue;
        const total = count.total * job.per;
        pushLog({
          who,
          icon: "💥",
          badge: "УРОН",
          text: `крит · за каждый: ${job.countExpr} → [${count.rolls.join("+")}] = ${count.total} × ${job.per} → итого ${total}`,
          kind: "damage",
          emphasize: String(total),
        });
        lines.push(`за каждый ${count.total}×${job.per} = ${total}`);
      } else if (job.kind === "flat") {
        pushLog({
          who,
          icon: "💥",
          badge: "УРОН",
          text: `крит · ${job.note}: +${job.amount} → итого ${job.amount}`,
          kind: "damage",
          emphasize: String(job.amount),
        });
        lines.push(`+${job.amount}`);
      } else if (job.kind === "duration") {
        const d = parseDice(job.expr);
        if (!d) continue;
        let detail = `${job.expr} → [${d.rolls.join("+")}]`;
        if (d.mod) detail += d.mod > 0 ? `+${d.mod}` : String(d.mod);
        detail += ` = ${d.total}`;
        pushLog({
          who,
          icon: "⏱",
          badge: "ДЛИТ.",
          text: `крит · длительность: ${detail}`,
          kind: "ok",
          emphasize: String(d.total),
        });
        lines.push(`длительность ${d.total}`);
      } else {
        const label = job.kind === "tick" ? `крит · ${job.note}` : `крит · ${job.note}`;
        const r = rollDamage(job.expr, who, label, 0);
        if (r) lines.push(`${job.expr} = ${r.total}`);
      }
    }
    return lines;
  }

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const el = (sel, root = document) => root.querySelector(sel);
  const els = (sel, root = document) => [...root.querySelectorAll(sel)];

  function defaultCharacter() {
    return {
      id: uid(),
      type: "character",
      name: "Новый персонаж",
      surname: "",
      age: "",
      gender: "",
      classId: "teamster",
      classNote: "",
      trauma: CLASSES.find((c) => c.id === "teamster").trauma,
      notes: "",
      str: 30, spd: 30, int: 30, cmb: 30,
      san: 30, fear: 30, body: 30,
      health: 15, healthMax: 15,
      wounds: 0, woundsMax: 2,
      stress: 2, stressMin: 2,
      armor: 0,
      credits: 0,
      skills: [],
      gear: [],
      attacks: [],
      conditions: [],
      crits: [],
    };
  }

  function defaultMonster() {
    return {
      id: uid(),
      type: "monster",
      name: "Новый монстр",
      notes: "",
      combat: 40, speed: 40, instinct: 40,
      health: 10, healthMax: 10,
      wounds: 0, woundsMax: 2,
      armor: 0,
      special: "",
      gear: [],
      attacks: [],
    };
  }

  function seedUtoplennik() {
    return {
      id: "seed-utoplennik",
      type: "monster",
      name: "Утопленник",
      notes: "Паразит до 120 см. Плетёт улей в теле через открытые отверстия. Мания утопления.",
      combat: 35, speed: 50, instinct: 40,
      health: 15, healthMax: 15,
      wounds: 0, woundsMax: 2,
      armor: 5,
      special: "Проникновение: проверка Скорости, при провале — заражение. После вторжения 10 минут на помощь, иначе мания. Инфицированные: 1d10 урона и +1 стресс каждые 10 минут.",
      gear: [],
      attacks: [
        { id: uid(), name: "Бритвенный укус", skill: "combat", damage: "2d6", note: "" },
        { id: uid(), name: "Проникновение паразита", skill: "speed", damage: "", note: "Проверка Скорости цели; провал = заражение" },
      ],
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data && Array.isArray(data.sheets)) return data;
      }
    } catch (_) { /* ignore */ }
    return { sheets: [seedUtoplennik()], view: "list", filter: "all", openId: null, rollMode: "normal", log: [] };
  }

  let state = loadState();
  if (!Array.isArray(state.sheets)) state.sheets = [];
  if (!state.woundType) state.woundType = "blunt";
  if (!state.webhook || typeof state.webhook !== "object") {
    state.webhook = { url: "", enabled: false, color: "#e4b86a", sendAll: true };
  } else {
    state.webhook = {
      url: String(state.webhook.url || ""),
      enabled: !!state.webhook.enabled,
      color: String(state.webhook.color || "#e4b86a"),
      sendAll: state.webhook.sendAll !== false,
    };
  }
  if (!state.sheets.some((s) => s.id === "seed-utoplennik" || s.name === "Утопленник")) {
    state.sheets.unshift(seedUtoplennik());
  }

  // Набор кубов в сайдбаре (не в localStorage).
  const POOL_ORDER = ["d4", "d6", "d10", "d20", "d100"];
  const dicePool = { d4: 0, d6: 0, d10: 0, d20: 0, d100: 0 };
  const POOL_MAX = 20;
  const POOL_SIDES = { d4: 4, d6: 6, d10: 10, d20: 20, d100: 100 };
  function migrateMonsterVitals(s) {
    if (!s || s.type !== "monster") return;
    // Старый формат: hits = макс. ран, hitHp = здоровье на рану.
    if (s.woundsMax == null && s.hits != null) {
      s.woundsMax = Math.max(1, Number(s.hits) || 1);
      s.wounds = Number.isFinite(Number(s.wounds)) ? Number(s.wounds) : 0;
    }
    if (s.healthMax == null && s.hitHp != null) {
      const hp = Math.max(0, Number(s.hitHp) || 0);
      s.healthMax = hp;
      s.health = Number.isFinite(Number(s.health)) ? Number(s.health) : hp;
    }
    if (s.woundsMax == null) s.woundsMax = 2;
    if (s.wounds == null) s.wounds = 0;
    if (s.healthMax == null) s.healthMax = 10;
    if (s.health == null) s.health = s.healthMax;
    s.woundsMax = Math.max(1, Number(s.woundsMax) || 1);
    s.wounds = clamp(Number(s.wounds) || 0, 0, s.woundsMax);
    s.healthMax = Math.max(0, Number(s.healthMax) || 0);
    s.health = clamp(Number(s.health) || 0, 0, s.healthMax || 9999);
  }

  state.sheets.forEach((s) => {
    if (s.type === "monster") {
      migrateMonsterVitals(s);
      return;
    }
    if (s.type !== "character") return;
    if (s.gender == null) {
      const p = String(s.pronouns || "").toLowerCase();
      if (p.includes("он") || p.includes("he")) s.gender = "male";
      else if (p.includes("она") || p.includes("she")) s.gender = "female";
      else s.gender = "";
    }
    (s.skills || []).forEach((sk) => {
      if (sk.name === "Римвайз") sk.name = "Знание окраин";
      if (sk.name === "Жури-риггинг") sk.name = "Умелые руки";
    });
  });

  function save() {
    localStorage.setItem(KEY, JSON.stringify({
      sheets: state.sheets,
      view: state.view,
      filter: state.filter,
      openId: state.openId,
      rollMode: state.rollMode,
      woundType: state.woundType || "blunt",
      webhook: state.webhook || { url: "", enabled: false, color: "#e4b86a", sendAll: true },
      log: state.log.slice(0, MAX_LOG),
    }));
  }

  save();

  function getSheet(id) {
    return state.sheets.find((s) => s.id === id);
  }

  function classById(id) {
    return CLASSES.find((c) => c.id === id) || CLASSES[3];
  }

  // Конкретные метры — домовное правило стола (внутри ориентиров PSG 1e).
  const WEAPON_RANGES = [
    { id: "cqc", name: "Смежная (рукопаш)", m: 1, meters: "1 м", hint: "Смежная: можно коснуться. До 1 м." },
    { id: "close", name: "Ближняя", m: 10, meters: "10 м", hint: "Ближняя: обычное перемещение за ход. До 10 м." },
    { id: "long", name: "Дальняя", m: 40, meters: "40 м", hint: "Дальняя: только бег весь раунд. До 40 м." },
    { id: "extreme", name: "Предельная", m: 100, meters: "100 м+", hint: "Предельная: дальше 100 м — больше одного раунда пешком." },
  ];
  const RANGE_ORDER = WEAPON_RANGES.map((r) => r.id);
  /** Метры за ход (то же, что в полосах выше). */
  const MOVE_M = { touch: 1, step: 10, sprint: 40, extreme: 100 };
  /** Эффективные полосы дальнего оружия — без смежной (она для рукопашного). */
  const RANGED_EFFECTIVE_RANGES = WEAPON_RANGES.filter((r) => r.id !== "cqc");

  function rangeById(id) {
    return WEAPON_RANGES.find((r) => r.id === id);
  }

  function rangeHint(id) {
    return (rangeById(id) || {}).hint || rangeLabel(id);
  }

  function rangeTipHtml(id) {
    const r = rangeById(id);
    if (!r) return `<p class="tip-blurb">Дистанция не задана.</p>`;
    return `<p class="tip-blurb">${esc(r.name)}</p>
      <p class="tip-perk-label">Дистанция стола</p>
      <ul class="tip-perk-list"><li>${esc(r.meters)}</li></ul>
      <p class="tip-blurb" style="margin-top:8px">${esc(r.hint.replace(/^[^:]+:\s*/, ""))}</p>`;
  }

  function rangesTipHtml(ids) {
    const list = normalizeRanges(ids).length
      ? normalizeRanges(ids)
      : RANGED_EFFECTIVE_RANGES.map((r) => r.id);
    return `<p class="tip-blurb">Полосы дистанции</p>
      <ul class="tip-perk-list">${list.map((id) => {
        const r = rangeById(id);
        if (!r) return "";
        return `<li><strong>${esc(r.name)}</strong> — ${esc(r.meters)}</li>`;
      }).join("")}</ul>`;
  }

  function rangeTipIcon(id) {
    const plain = rangeHint(id);
    return `<span class="skill-tip" tabindex="0" data-range-tip="${esc(id)}" aria-label="${esc(plain)}"><span class="skill-tip-mark" aria-hidden="true">?</span></span>`;
  }

  function rangesTipIcon(ids) {
    const list = normalizeRanges(ids);
    const key = list.join(",") || RANGED_EFFECTIVE_RANGES.map((r) => r.id).join(",");
    const plain = list.length
      ? list.map((id) => {
        const r = rangeById(id);
        return r ? `${r.name}: ${r.meters}` : "";
      }).filter(Boolean).join(". ")
      : "Полосы дистанции";
    return `<span class="skill-tip" tabindex="0" data-range-tip-ids="${esc(key)}" aria-label="${esc(plain)}"><span class="skill-tip-mark" aria-hidden="true">?</span></span>`;
  }

  /** Дисциплина автоогня / детальный боезапас: Военная подготовка (по PSG также Огнестрел). */
  function hasGunDiscipline(sheet) {
    if (!sheet || sheet.type !== "character") return true;
    return (sheet.skills || []).some((s) => s.name === "Военная подготовка" || s.name === "Огнестрел");
  }

  function hasMilitaryTraining(sheet) {
    if (!sheet || sheet.type !== "character") return true;
    return (sheet.skills || []).some((s) => s.name === "Военная подготовка");
  }

  /** Бонус навыка к атаке: лучший подходящий по типу оружия. */
  function attackSkillBonus(sheet, atk) {
    if (!sheet || sheet.type !== "character") return { name: "", bonus: 0 };
    const owned = sheet.skills || [];
    const pick = (names) => {
      let best = null;
      for (const name of names) {
        const sk = owned.find((s) => s.name === name);
        if (!sk) continue;
        const bonus = Number(sk.bonus) || 0;
        if (!best || bonus > best.bonus) best = { name: sk.name, bonus };
      }
      return best;
    };
    const kind = atk?.kind === "ranged" ? "ranged" : "melee";
    const order = kind === "ranged"
      ? ["Огнестрел", "Военная подготовка"]
      : ["Рукопашный бой", "Военная подготовка", "Атлетика"];
    return pick(order) || { name: "", bonus: 0 };
  }

  function attackSkillBonusLabel(sheet, atk) {
    const info = attackSkillBonus(sheet, atk);
    if (!info.bonus) return "—";
    return `${info.name} +${info.bonus}`;
  }

  function normalizeRanges(list, fallback) {
    const raw = Array.isArray(list) ? list : (list ? [list] : []);
    const uniq = [];
    for (const id of raw) {
      if (RANGE_ORDER.includes(id) && !uniq.includes(id)) uniq.push(id);
    }
    if (!uniq.length && fallback) {
      const fb = Array.isArray(fallback) ? fallback : [fallback];
      for (const id of fb) {
        if (RANGE_ORDER.includes(id) && !uniq.includes(id)) uniq.push(id);
      }
    }
    uniq.sort((x, y) => rangeIndex(x) - rangeIndex(y));
    return uniq;
  }

  function normalizeAttack(a) {
    if (!a || typeof a !== "object") return a;
    if (!a.kind) a.kind = (a.shots != null || a.automatic) ? "ranged" : "melee";
    if (a.kind === "ranged") {
      const max = Math.max(0, Number(a.shots) || 0);
      a.shots = max;
      if (!Number.isFinite(Number(a.shotsLeft))) a.shotsLeft = max;
      else a.shotsLeft = clamp(Number(a.shotsLeft), 0, max || 999);
      a.automatic = !!a.automatic;
      a.ammoPerShot = Math.max(1, Number(a.ammoPerShot) || 1);
      // Смежная не входит в эффективные полосы огнестрела
      a.ranges = normalizeRanges(a.ranges, a.range || "close").filter((id) => id !== "cqc");
      if (!a.ranges.length) a.ranges = ["close"];
      a.range = a.ranges[a.ranges.length - 1]; // совместимость: «главная» = самая дальняя эфф.
      // Текущая у дальнего — без смежной
      if (!a.currentRange || a.currentRange === "cqc" || !RANGE_ORDER.includes(a.currentRange)) {
        a.currentRange = a.ranges[0];
      }
      a.wound = a.wound || "";
    } else {
      // Рукопаш: эффективная и текущая — смежная
      a.ranges = ["cqc"];
      a.range = "cqc";
      a.currentRange = "cqc";
    }
    return a;
  }

  function rangeLabel(id) {
    return (rangeById(id) || {}).name || id || "—";
  }

  function rangeIndex(id) {
    const i = RANGE_ORDER.indexOf(id);
    return i < 0 ? 1 : i;
  }

  function effectiveRangesLabel(a) {
    const list = normalizeRanges(a?.ranges, a?.range);
    if (!list.length) return "—";
    const labels = list.map(rangeLabel);
    // Смежные полосы схлопываем в «Ближняя–Дальняя»
    let contiguous = list.length > 1;
    for (let i = 1; i < list.length; i++) {
      if (rangeIndex(list[i]) !== rangeIndex(list[i - 1]) + 1) {
        contiguous = false;
        break;
      }
    }
    if (contiguous && list.length > 1) {
      return `${labels[0]}–${labels[labels.length - 1]}`;
    }
    return labels.join(", ");
  }

  function isBeyondEffective(a) {
    if (!a || a.kind !== "ranged") return false;
    const list = normalizeRanges(a.ranges, a.range).filter((id) => id !== "cqc");
    if (!list.length) return false;
    const maxEff = Math.max(...list.map(rangeIndex));
    // Ближе эффективной — нормально; «вне» только если цель дальше самой дальней эфф. полосы
    return rangeIndex(a.currentRange) > maxEff;
  }

  function rangeOptionsHtml(selected, { kind } = {}) {
    const list = kind === "ranged"
      ? RANGED_EFFECTIVE_RANGES
      : kind === "melee"
        ? WEAPON_RANGES.filter((r) => r.id === "cqc")
        : WEAPON_RANGES;
    const ok = list.some((r) => r.id === selected) ? selected : list[0]?.id;
    return list.map((r) =>
      `<option value="${r.id}" ${ok === r.id ? "selected" : ""}>${esc(r.name)}</option>`
    ).join("");
  }

  function effectiveRangeChecksHtml(selected) {
    const set = new Set(normalizeRanges(selected, "close").filter((id) => id !== "cqc"));
    if (!set.size) set.add("close");
    return `<div class="atk-range-checks" id="a-ranges">
      ${RANGED_EFFECTIVE_RANGES.map((r) => `
        <label class="atk-range-check">
          <input type="checkbox" value="${r.id}" ${set.has(r.id) ? "checked" : ""}>
          <span>${esc(r.name)}</span>
          ${rangeTipIcon(r.id)}
        </label>`).join("")}
    </div>`;
  }

  function readEffectiveRanges() {
    return els("#a-ranges input[type=checkbox]:checked").map((c) => c.value);
  }

  function woundLabel(id) {
    return (WOUND_TYPES.find((t) => t.id === id) || {}).name || "";
  }

  function attackAmmoHtml(a, sheet) {
    normalizeAttack(a);
    if (a.kind !== "ranged") {
      return `<span class="atk-stat-val atk-stat-val--muted">—</span>`;
    }
    const max = Number(a.shots) || 0;
    const left = Number(a.shotsLeft) || 0;
    const loaded = left > 0;
    const per = Math.max(1, Number(a.ammoPerShot) || 1);

    if (!a.automatic) {
      return `<span class="atk-stat-val">${left}/${max || "—"}</span>`;
    }

    if (!hasMilitaryTraining(sheet)) {
      return `<span class="atk-mag ${loaded ? "is-loaded" : "is-empty"}">${loaded ? "заряжен" : "пусто"}</span>`;
    }

    return `
      <div class="atk-ammo-stack">
        <span class="atk-mag ${loaded ? "is-loaded" : "is-empty"}">${loaded ? "заряжен" : "пусто"}</span>
        <span class="atk-ammo-count">${left}${max ? `/${max}` : ""}</span>
        <span class="atk-ammo-cost" title="Патронов за выстрел">−${per}</span>
      </div>`;
  }

  function attackTagsHtml(a) {
    normalizeAttack(a);
    const tags = [];
    if (a.kind === "melee") tags.push(["Ближний бой", ""]);
    else {
      tags.push(["Дальний бой", "is-cyan"]);
      tags.push([a.automatic ? "Авто" : "Одиночное", a.automatic ? "is-amber" : ""]);
    }
    if (a.wound) tags.push([woundLabel(a.wound), ""]);
    if (!tags.length) return "";
    return `<div class="atk-tags">${tags.map(([t, cls]) =>
      `<span class="atk-tag ${cls}">${esc(t)}</span>`).join("")}</div>`;
  }

  function currentRangeDropdownHtml(a) {
    const cur = a.currentRange;
    return `<div class="atk-dd" data-atk-dd="${a.id}">
      <button type="button" class="atk-dd-btn" data-atk-dd-toggle="${a.id}" aria-expanded="false">
        <span class="atk-dd-btn-label">${esc(rangeLabel(cur))}</span>
        <span class="atk-dd-caret" aria-hidden="true">▾</span>
      </button>
      <div class="atk-dd-menu" hidden>
        ${RANGED_EFFECTIVE_RANGES.map((r) => `
          <div class="atk-dd-row${r.id === cur ? " is-on" : ""}">
            <button type="button" class="atk-dd-opt" data-atk-current="${a.id}" data-range="${r.id}">${esc(r.name)}</button>
            ${rangeTipIcon(r.id)}
          </div>`).join("")}
      </div>
    </div>`;
  }

  function closeAllRangeDropdowns(exceptId) {
    els(".atk-dd").forEach((dd) => {
      if (exceptId && dd.dataset.atkDd === exceptId) return;
      const menu = dd.querySelector(".atk-dd-menu");
      const btn = dd.querySelector("[data-atk-dd-toggle]");
      if (menu) menu.hidden = true;
      if (btn) btn.setAttribute("aria-expanded", "false");
      dd.classList.remove("is-open");
    });
  }

  function attackRangeHtml(a) {
    normalizeAttack(a);
    if (a.kind === "melee") {
      return `<div class="atk-range">
        <div class="atk-range-block">
          <span class="atk-range-k">Эффективная ${rangeTipIcon("cqc")}</span>
          <span class="atk-range-v">Смежная</span>
        </div>
        <div class="atk-range-block">
          <span class="atk-range-k">Сейчас</span>
          <span class="atk-range-v">Смежная</span>
        </div>
      </div>`;
    }
    const beyond = isBeyondEffective(a);
    return `<div class="atk-range${beyond ? " is-beyond" : ""}">
      <div class="atk-range-block">
        <span class="atk-range-k">Эффективная ${rangesTipIcon(a.ranges)}</span>
        <span class="atk-range-v">${esc(effectiveRangesLabel(a))}</span>
      </div>
      <div class="atk-range-block atk-range-block--cur">
        <span class="atk-range-k">Сейчас</span>
        ${currentRangeDropdownHtml(a)}
      </div>
      ${beyond ? `<span class="atk-range-warn" title="Цель дальше эффективных полос">Не эффективная дистанция</span>` : ""}
    </div>`;
  }

  function attackCardHtml(a, sheet, { showCheckLabel = false } = {}) {
    normalizeAttack(a);
    const skillBonus = attackSkillBonus(sheet, a);
    const skillText = esc(statLabel(a.skill));
    const bonusText = skillBonus.bonus
      ? `+${skillBonus.bonus}`
      : "—";
    const freeReload = a.kind === "ranged" && hasGunDiscipline(sheet);
    const beyond = isBeyondEffective(a);
    const attackTip = a.kind === "ranged"
      ? (beyond
        ? "Значимое действие: цель вне эффективных полос — Варден решает штраф/помеху."
        : "Значимое действие: атака дальним оружием (проверка + навык, расход боезапаса).")
      : "Значимое действие: атака в ближнем бою (проверка + навык).";
    const reloadTip = freeReload
      ? "Свободное действие: перезарядка (Военная подготовка / Огнестрел), если патроны под рукой."
      : "Значимое действие: перезарядка магазина.";
    return `
      <article class="atk-card${beyond ? " is-beyond" : ""}">
        <div class="atk-card-body">
          <div class="atk-card-top">
            <div class="atk-card-title">
              <h4 class="atk-name">${esc(a.name)}</h4>
              ${a.note ? `<p class="atk-note">${esc(a.note)}</p>` : ""}
              ${attackTagsHtml(a)}
            </div>
            <div class="atk-card-tools">
              <button type="button" class="atk-icon-btn" data-atk-edit="${a.id}" title="Изменить">✎</button>
              <button type="button" class="atk-icon-btn is-danger" data-atk-del="${a.id}" title="Удалить">×</button>
            </div>
          </div>
          <div class="atk-stats${showCheckLabel ? "" : " atk-stats--char"}">
            <div class="atk-stat">
              <span class="atk-stat-k">Проверка</span>
              <span class="atk-stat-val">${skillText}</span>
            </div>
            ${showCheckLabel ? "" : `
            <div class="atk-stat">
              <span class="atk-stat-k">Бонус навыка</span>
              <span class="atk-stat-val" title="${esc(skillBonus.name || "нет подходящего навыка")}">${esc(bonusText)}${skillBonus.name ? ` <span class="atk-stat-sub">${esc(skillBonus.name)}</span>` : ""}</span>
            </div>`}
            <div class="atk-stat">
              <span class="atk-stat-k">Урон</span>
              <span class="atk-stat-val">${esc(a.damage || "—")}</span>
            </div>
            ${a.kind === "ranged" ? `
            <div class="atk-stat">
              <span class="atk-stat-k">Боезапас</span>
              <div class="atk-stat-val atk-stat-val--ammo">${attackAmmoHtml(a, sheet)}</div>
            </div>` : ""}
          </div>
          ${attackRangeHtml(a)}
        </div>
        <div class="atk-card-actions">
          <button type="button" class="btn primary atk-go" data-atk="${a.id}" title="${esc(attackTip)}">
            Атака
            <span class="atk-go-type">значимое</span>
          </button>
          ${a.kind === "ranged" ? `
          <button type="button" class="btn atk-reload" data-atk-reload="${a.id}" title="${esc(reloadTip)}">
            Зарядить
            <span class="atk-go-type ${freeReload ? "is-free" : "is-major"}">${freeReload ? "свободное" : "значимое"}</span>
          </button>` : ""}
        </div>
      </article>`;
  }

  function attacksListHtml(sheet, opts = {}) {
    const list = sheet.attacks || [];
    if (!list.length) return `<p class="hint atk-empty">Нет атак</p>`;
    return `<div class="atk-list">${list.map((a) => attackCardHtml(a, sheet, opts)).join("")}</div>`;
  }

  // ——— Dice ———
  function rollDie(sides) {
    return 1 + Math.floor(Math.random() * sides);
  }

  function rollD100() {
    const a = rollDie(10) % 10;
    const b = rollDie(10) % 10;
    const value = a === 0 && b === 0 ? 100 : a * 10 + b;
    return { value, tens: a, ones: b, double: a === b };
  }

  /** Для сравнения roll-under: 00 (value 100) — лучший исход, как 0. */
  function d100Rank(r) {
    return r.tens === 0 && r.ones === 0 ? 0 : r.value;
  }

  function rollD100Mode(mode = state.rollMode) {
    if (mode === "adv" || mode === "dis") {
      const r1 = rollD100();
      const r2 = rollD100();
      const a = d100Rank(r1);
      const b = d100Rank(r2);
      const pick = mode === "adv"
        ? (a <= b ? r1 : r2)
        : (a >= b ? r1 : r2);
      return { ...pick, mode, all: [r1.value, r2.value] };
    }
    return { ...rollD100(), mode: "normal", all: null };
  }

  function parseDice(expr) {
    const clean = String(expr || "").trim().toLowerCase().replace(/\s+/g, "");
    if (!clean) return null;
    const m = clean.match(/^(\d*)d(\d+)([+-]\d+)?$/i);
    if (!m) return null;
    const n = m[1] === "" ? 1 : clamp(parseInt(m[1], 10), 1, 40);
    const sides = clamp(parseInt(m[2], 10), 2, 1000);
    const mod = m[3] ? parseInt(m[3], 10) : 0;
    const rolls = [];
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const v = rollDie(sides);
      rolls.push(v);
      sum += v;
    }
    return { expr: clean, rolls, mod, total: sum + mod };
  }

  function sheetFullName(sheet) {
    if (!sheet) return "";
    return [sheet.name, sheet.surname].filter(Boolean).join(" ").trim();
  }

  function findSheetByWho(who, whoId) {
    if (whoId) {
      const byId = getSheet(whoId);
      if (byId) return byId;
    }
    const label = String(who || "").trim();
    if (!label) return null;
    const open = state.openId ? getSheet(state.openId) : null;
    if (open) {
      const full = sheetFullName(open);
      if (label === open.name || label === full) return open;
    }
    return state.sheets.find((s) => {
      const full = sheetFullName(s);
      return label === s.name || label === full;
    }) || null;
  }

  function isDiscordWebhookUrl(url) {
    return /^https:\/\/(discord\.com|discordapp\.com)\/api\/webhooks\/\d+\/[\w-]+/i.test(String(url || "").trim());
  }

  /** Прокси Cloudflare Pages Function — только на *.pages.dev (на GitHub Pages FormData идёт напрямую). */
  function useDiscordProxy() {
    try {
      return /\.pages\.dev$/i.test(location.hostname || "");
    } catch (_) {
      return false;
    }
  }

  async function postDiscordWebhook(webhookUrl, { username, embeds, avatarBlob }) {
    const url = String(webhookUrl || "").trim();
    const payload = JSON.stringify({ username, embeds });
    // FormData / multipart — «простой» CORS-запрос: Discord получает сообщение
    // даже без Access-Control-Allow-Origin (в отличие от application/json).
    if (useDiscordProxy()) {
      const form = new FormData();
      form.append("url", url);
      form.append("payload_json", payload);
      if (avatarBlob) form.append("files[0]", avatarBlob, "avatar.jpg");
      return fetch("/api/discord", { method: "POST", body: form });
    }
    const form = new FormData();
    form.append("payload_json", payload);
    if (avatarBlob) form.append("files[0]", avatarBlob, "avatar.jpg");
    return fetch(url, { method: "POST", body: form });
  }

  function webhookColorForKind(kind) {
    const map = {
      "crit-ok": 0x8fbf7a,
      "crit-bad": 0xc45b5b,
      ok: 0x8fbf7a,
      bad: 0xc45b5b,
      "panic-ok": 0x8fbf7a,
      "panic-fail": 0xc45b5b,
      damage: 0xe4b86a,
      "armor-break": 0xc45b5b,
    };
    if (map[kind] != null) return map[kind];
    const hex = String((state.webhook && state.webhook.color) || "#e4b86a").replace("#", "");
    const n = parseInt(hex.slice(0, 6), 16);
    return Number.isFinite(n) ? n : 0xe4b86a;
  }

  function shouldRelayLog(entry) {
    const wh = state.webhook;
    if (!wh || !wh.enabled || !isDiscordWebhookUrl(wh.url)) return false;
    if (wh.sendAll) return true;
    // Только броски с листа персонажа/монстра
    return !!findSheetByWho(entry.who, entry.whoId);
  }

  function dataUrlToBlob(dataUrl) {
    const parts = String(dataUrl || "").split(",");
    if (parts.length < 2) return null;
    const meta = parts[0];
    const b64 = parts[1];
    const mime = (meta.match(/data:([^;]+)/) || [])[1] || "image/jpeg";
    try {
      const bin = atob(b64);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: mime });
    } catch (_) {
      return null;
    }
  }

  function discordOutcomeInfo(entry, detailText) {
    const kind = entry.kind || "";
    const blob = `${detailText || ""} ${entry.text || ""} ${entry.badge || ""}`;
    const low = blob.toLowerCase();
    // Не считаем «успехом» служебные записи (боезапас, расход и т.п.) —
    // только явный исход в тексте или крит-kind.
    if (kind === "crit-ok" || /крит\.?\s*успех|★\s*крит/i.test(blob)) {
      return { key: "crit-ok", title: "✦ КРИТ. УСПЕХ", line: "✦ **КРИТ. УСПЕХ**" };
    }
    if (kind === "crit-bad" || /крит\.?\s*провал|☠\s*крит/i.test(blob)) {
      return { key: "crit-bad", title: "☠ КРИТ. ПРОВАЛ", line: "☠ **КРИТ. ПРОВАЛ**" };
    }
    if (kind === "panic-ok") {
      return { key: "panic-ok", title: "✅ УСПЕХ", line: "✅ **УСПЕХ**" };
    }
    if (kind === "panic-fail") {
      return { key: "panic-fail", title: "❌ ПРОВАЛ", line: "❌ **ПРОВАЛ**" };
    }
    if (kind === "damage") {
      return { key: "damage", title: "💥 УРОН", line: "💥 **УРОН**" };
    }
    if (kind === "armor-break") {
      return { key: "armor-break", title: "🛡 БРОНЯ СЛОМАНА", line: "🛡 **БРОНЯ СЛОМАНА**" };
    }
    const isCheckLine = /против\s+\d+/i.test(blob) || /—\s*(★\s*)?крит|—\s*успех|—\s*провал/i.test(blob);
    if (isCheckLine && /успех/i.test(low) && !/провал/i.test(low)) {
      return { key: "ok", title: "✅ УСПЕХ", line: "✅ **УСПЕХ**" };
    }
    if (isCheckLine && /провал/i.test(low)) {
      return { key: "bad", title: "❌ ПРОВАЛ", line: "❌ **ПРОВАЛ**" };
    }
    if (entry.badge && (kind === "crit-ok" || kind === "crit-bad" || kind === "panic-ok" || kind === "panic-fail")) {
      return { key: kind, title: String(entry.badge), line: `**${entry.badge}**` };
    }
    return null;
  }

  /** Текст embed в духе Long Story Short: имя → бросок → результат → детали → куб. */
  function formatDiscordRollEmbed(entry, sheet) {
    const who = (sheet ? sheetFullName(sheet) || sheet.name : entry.who) || "Companion";
    const raw = String(entry.text || "").trim();
    const roll = entry.emphasize != null && entry.emphasize !== ""
      ? String(entry.emphasize)
      : "";

    let action = "Бросок";
    let detail = raw;
    const m = raw.match(/^([^:：]+)[:：]\s*(.+)$/s);
    if (m) {
      action = m[1].trim() || action;
      detail = m[2].trim();
    } else if (entry.badge) {
      action = String(entry.badge);
    }

    // Убираем исход из строки деталей — он будет отдельной яркой строкой / title.
    let detailClean = detail
      .replace(/\s*[—–-]\s*★\s*крит\.?\s*успех/gi, "")
      .replace(/\s*[—–-]\s*☠\s*крит\.?\s*провал/gi, "")
      .replace(/\s*[—–-]\s*крит\.?\s*успех/gi, "")
      .replace(/\s*[—–-]\s*крит\.?\s*провал/gi, "")
      .replace(/\s*[—–-]\s*успех/gi, "")
      .replace(/\s*[—–-]\s*провал/gi, "")
      .replace(/\s*\(крит\.?\s*успех!?\)/gi, "")
      .replace(/\s*\(крит\.?\s*провал!?\)/gi, "")
      .trim();

    const outcome = discordOutcomeInfo(entry, detail);

    // Снос брони: главная строка — «Цель получает N и теряет броню»
    if (entry.kind === "armor-break") {
      const punch = (entry.emphasize && String(entry.emphasize))
        || (raw.match(/Цель получает \d+ и теряет броню/i) || [])[0]
        || "Цель теряет броню";
      const cmp = (raw.match(/\(урон\s+\d+\s*>\s*броня\s+\d+\)/i)
        || raw.match(/урон\s+\d+\s*>\s*брон[яи]\s+\d+/i)
        || [])[0];
      const lines = [`**${who}**`, `**${punch}**`];
      if (cmp) lines.push(`(${cmp.replace(/^\(|\)$/g, "")})`);
      return {
        title: outcome ? outcome.title : "🛡 БРОНЯ СЛОМАНА",
        description: lines.join("\n").slice(0, 2000),
        colorKey: "armor-break",
      };
    }

    let diceLine = "d100";
    if (entry.kind === "panic-ok" || entry.kind === "panic-fail" || /\bd20\b/i.test(raw)) {
      diceLine = "d20";
    } else if (entry.kind === "damage") {
      const dm = raw.match(/(\d*d\d+(?:[+-]\d+)?)/i);
      diceLine = dm ? dm[1] : "урон";
    } else if (/\bd100\b/i.test(raw) || roll !== "") {
      diceLine = "d100";
    } else if (/\b(\d*d\d+)\b/i.test(raw)) {
      diceLine = raw.match(/\b(\d*d\d+)\b/i)[1];
    }

    const lines = [
      `**${who}**`,
      roll ? `**${action} — ${roll}**` : `**${action}**`,
    ];
    if (detailClean) lines.push(`(${detailClean})`);
    else if (roll) lines.push(`(${roll})`);
    if (roll || /\bd\d+\b/i.test(raw)) lines.push(`(${diceLine})`);

    return {
      title: outcome ? outcome.title : null,
      description: lines.join("\n").slice(0, 2000),
      colorKey: outcome ? outcome.key : entry.kind,
    };
  }

  async function relayLogToWebhook(entry) {
    if (!shouldRelayLog(entry)) return;
    const sheet = findSheetByWho(entry.who, entry.whoId);
    const who = String((sheet ? sheetFullName(sheet) || sheet.name : entry.who) || "Companion");
    const username = who.slice(0, 80) || "Companion";
    const formatted = formatDiscordRollEmbed(entry, sheet);
    const embed = {
      description: formatted.description,
      color: webhookColorForKind(formatted.colorKey || entry.kind),
    };
    if (formatted.title) embed.title = formatted.title;

    const url = String(state.webhook.url).trim();
    const avatarBlob = sheet && hasAvatar(sheet) ? dataUrlToBlob(sheet.avatar) : null;
    if (avatarBlob) embed.thumbnail = { url: "attachment://avatar.jpg" };

    try {
      const res = await postDiscordWebhook(url, { username, embeds: [embed], avatarBlob });
      if (!res.ok) {
        console.warn("Webhook error", res.status);
      }
    } catch (err) {
      console.warn("Webhook failed", err);
    }
  }

  function pushLog(entry) {
    const sheet = findSheetByWho(entry.who, entry.whoId);
    const next = {
      id: uid(),
      t: Date.now(),
      ...entry,
    };
    if (sheet) next.whoId = sheet.id;
    else delete next.whoId;
    // Не пишем dataURL в лог — аватар берём с листа при отрисовке.
    delete next.avatar;
    state.log.unshift(next);
    state.log = state.log.slice(0, MAX_LOG);
    save();
    renderLog();
    if (entry.relay !== false) relayLogToWebhook(next);
  }

  function openWebhookModal() {
    const wh = state.webhook || { url: "", enabled: false, color: "#e4b86a", sendAll: true };
    openModal(`
      <h3>Discord webhook</h3>
      <p class="hint" style="margin-top:0">Как в Long Story Short: создайте вебхук в Discord (Настройки сервера → Интеграции) и вставьте URL. Броски из компаньона будут уходить в канал.</p>
      <div class="field">
        <label>URL вебхука</label>
        <input id="wh-url" type="url" placeholder="https://discord.com/api/webhooks/…" value="${esc(wh.url || "")}" autocomplete="off" spellcheck="false">
      </div>
      <div class="field">
        <label>Цвет embed по умолчанию</label>
        <input id="wh-color" type="color" value="${esc(/^#[0-9a-fA-F]{6}$/.test(wh.color) ? wh.color : "#e4b86a")}">
      </div>
      <label class="wh-check"><input id="wh-enabled" type="checkbox" ${wh.enabled ? "checked" : ""}> Пересылать броски</label>
      <label class="wh-check"><input id="wh-all" type="checkbox" ${wh.sendAll !== false ? "checked" : ""}> Включая кубы из сайдбара / справку</label>
      <p class="hint">URL — секрет: кто его знает, может писать в ваш канал.</p>
      <div class="modal-actions">
        <button type="button" class="btn ghost" data-modal-cancel>Отмена</button>
        <button type="button" class="btn" id="wh-test">Тест</button>
        <button type="button" class="btn primary" id="wh-save">Сохранить</button>
      </div>
    `);
    const readForm = () => ({
      url: (el("#wh-url").value || "").trim(),
      color: el("#wh-color").value || "#e4b86a",
      enabled: !!el("#wh-enabled").checked,
      sendAll: !!el("#wh-all").checked,
    });
    el("#wh-save").onclick = () => {
      const next = readForm();
      if (next.url && !isDiscordWebhookUrl(next.url)) {
        alert("Похоже, это не URL Discord webhook.");
        return;
      }
      state.webhook = next;
      save();
      closeModal();
      render();
    };
    el("#wh-test").onclick = async () => {
      const next = readForm();
      if (!isDiscordWebhookUrl(next.url)) {
        alert("Сначала вставьте корректный URL Discord webhook.");
        return;
      }
      try {
        const res = await postDiscordWebhook(next.url, {
          username: "Mothership Companion",
          embeds: [{
            title: "Тест webhook",
            description: "Если вы это видите — пересылка бросков работает.",
            color: 0xe4b86a,
            footer: { text: "Mothership Companion · Pandora" },
          }],
        });
        if (!res.ok) alert(`Discord ответил ошибкой: ${res.status}`);
        else alert("Тест отправлен в Discord.");
      } catch (err) {
        alert("Не удалось отправить: " + (err.message || err));
      }
    };
  }

  function underCheck(label, target, who) {
    const r = rollD100Mode();
    const is00 = r.tens === 0 && r.ones === 0;
    // PSG 1e: 00 всегда крит. успех; 90–99 всегда провал; 99 всегда крит. провал.
    let success;
    if (is00) success = true;
    else if (r.value >= 90) success = false;
    else success = r.value <= target;
    const crit = !!r.double;
    const kind = success ? (crit ? "crit-ok" : "ok") : (crit ? "crit-bad" : "bad");
    const shown = is00 ? "00" : String(r.value);
    const outcome = crit
      ? (success ? "★ крит. успех" : "☠ крит. провал")
      : (success ? "успех" : "провал");
    let text = `${label}: ${shown} против ${target} — ${outcome}`;
    if (r.all) {
      const shownAll = r.all.map((v) => (v === 100 ? "00" : String(v)));
      text += ` [${shownAll.join(", ")} · ${r.mode === "adv" ? "преим." : "помеха"}]`;
    }
    pushLog({
      who,
      text,
      kind,
      icon: crit ? (success ? "★" : "☠") : "",
      badge: crit ? (success ? "КРИТ. УСПЕХ" : "КРИТ. ПРОВАЛ") : "",
      emphasize: shown,
      critMark: crit ? (success ? "ok" : "bad") : "",
    });
    return { ...r, success, crit, target };
  }

  function rollDamage(expr, who, label, armor = 0) {
    const parsed = parseDice(expr);
    if (!parsed) {
      pushLog({ who, text: `${label}: не удалось разобрать урон «${expr}»`, kind: "bad" });
      return null;
    }
    const armorVal = Number(armor) || 0;
    const after = Math.max(0, parsed.total - armorVal);
    // Mothership 1e: если урон за удар больше рейтинга брони — броня уничтожена
    const armorBroken = armorVal > 0 && parsed.total > armorVal;
    let detail = `${label}: ${parsed.expr} → [${parsed.rolls.join("+")}]`;
    if (parsed.mod) detail += (parsed.mod > 0 ? `+${parsed.mod}` : `${parsed.mod}`);
    detail += ` = ${parsed.total}`;
    if (armorVal) detail += ` − броня ${armorVal}`;
    pushLog({
      who,
      icon: "💥",
      badge: "УРОН",
      text: `${detail} → итого ${after}`,
      kind: "damage",
      emphasize: String(after),
    });
    if (armorBroken) {
      const punch = `Цель получает ${after} и теряет броню`;
      pushLog({
        who,
        icon: "🛡💥",
        badge: "БРОНЯ СЛОМАНА",
        text: `${punch} (урон ${parsed.total} > броня ${armorVal})`,
        kind: "armor-break",
        emphasize: punch,
      });
    }
    return { ...parsed, after, armorBroken };
  }

  // ——— Render helpers ———
  function esc(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function looksLikeHtml(s) {
    return /<\/?[a-z][\s\S]*>/i.test(String(s || ""));
  }

  function sanitizeRich(html) {
    const wrap = document.createElement("div");
    wrap.innerHTML = String(html || "");
    const allowed = new Set(["B", "STRONG", "I", "EM", "U", "BR", "DIV", "P", "SPAN"]);

    function clean(node) {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) return;
        if (child.nodeType !== Node.ELEMENT_NODE) {
          child.remove();
          return;
        }
        if (!allowed.has(child.tagName)) {
          while (child.firstChild) node.insertBefore(child.firstChild, child);
          child.remove();
          return;
        }
        if (child.tagName === "SPAN") {
          const diceRaw = (child.getAttribute("data-dice") || child.textContent || "").replace(/\s+/g, "").toLowerCase();
          [...child.attributes].forEach((a) => child.removeAttribute(a.name));
          if (parseDice(diceRaw)) {
            child.className = "dice-chip";
            child.setAttribute("data-dice", diceRaw);
            child.setAttribute("contenteditable", "false");
            if (!child.textContent.trim()) child.textContent = diceRaw;
          } else {
            while (child.firstChild) node.insertBefore(child.firstChild, child);
            child.remove();
            return;
          }
        } else {
          [...child.attributes].forEach((a) => child.removeAttribute(a.name));
        }
        clean(child);
      });
    }

    clean(wrap);
    return wrap.innerHTML;
  }

  function toEditorHtml(value) {
    const s = String(value || "");
    if (!s) return "";
    if (looksLikeHtml(s)) return sanitizeRich(s);
    return esc(s).replace(/\n/g, "<br>");
  }

  function richField(field, value, opts = {}) {
    const size = opts.size || "";
    const ph = opts.placeholder || "";
    return `
      <div class="rich-wrap" data-rich-wrap="${field}">
        <div class="rich-toolbar" role="toolbar" aria-label="Формат текста">
          <button type="button" class="rich-btn" data-rich-cmd="bold" title="Жирный"><b>Ж</b></button>
          <button type="button" class="rich-btn" data-rich-cmd="italic" title="Курсив"><i>К</i></button>
          <button type="button" class="rich-btn" data-rich-cmd="underline" title="Подчёркнутый"><u>Ч</u></button>
          <button type="button" class="rich-btn rich-btn-dice" data-rich-cmd="dice" title="Выделите 1d10 / 2d6+1 и нажмите">🎲</button>
        </div>
        <div
          class="note-area rich-editor ${size}"
          contenteditable="true"
          data-rich="${field}"
          data-placeholder="${esc(ph)}"
          spellcheck="true"
        >${toEditorHtml(value)}</div>
      </div>`;
  }

  function wrapSelectionAsDice(editor) {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      alert("Сначала выделите выражение вроде 1d10 или 2d6+1");
      return false;
    }
    if (!editor.contains(sel.anchorNode) || !editor.contains(sel.focusNode)) {
      alert("Выделите текст внутри этого поля");
      return false;
    }
    const text = sel.toString().trim();
    const expr = text.replace(/\s+/g, "").toLowerCase();
    if (!parseDice(expr)) {
      alert("Нужно выражение куба: 1d10, 2d6, 2d10+1…");
      return false;
    }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const span = document.createElement("span");
    span.className = "dice-chip";
    span.dataset.dice = expr;
    span.contentEditable = "false";
    span.textContent = text.replace(/\s+/g, "");
    range.insertNode(span);
    sel.removeAllRanges();
    const after = document.createRange();
    after.setStartAfter(span);
    after.collapse(true);
    sel.addRange(after);
    return true;
  }

  function rollNoteDice(expr, who) {
    const parsed = parseDice(expr);
    if (!parsed) {
      pushLog({ who, text: `Не разобрать бросок «${expr}»`, kind: "bad" });
      return;
    }
    let detail = `${parsed.expr} → [${parsed.rolls.join("+")}]`;
    if (parsed.mod) detail += parsed.mod > 0 ? `+${parsed.mod}` : `${parsed.mod}`;
    detail += ` = ${parsed.total}`;
    pushLog({
      who,
      icon: "🎲",
      badge: "БРОСОК",
      text: detail,
      kind: "damage",
      emphasize: String(parsed.total),
    });
  }

  function persistRichEditor(editor) {
    const sheet = getSheet(state.openId);
    if (!sheet || !editor) return;
    const field = editor.dataset.rich;
    if (!field) return;
    sheet[field] = sanitizeRich(editor.innerHTML);
    save();
  }

  function formatLogText(e) {
    const raw = String(e.text || "");
    const critCls = e.kind === "crit-ok" || e.critMark === "ok"
      ? " log-emphasis--crit-ok"
      : e.kind === "crit-bad" || e.critMark === "bad"
        ? " log-emphasis--crit-bad"
        : "";

    const paintOutcome = (s) => s
      .replace(/★ крит\. успех/g, `<span class="log-crit-tag log-crit-tag--ok">★ крит. успех</span>`)
      .replace(/☠ крит\. провал/g, `<span class="log-crit-tag log-crit-tag--bad">☠ крит. провал</span>`);

    if (e.emphasize == null || e.emphasize === "") {
      return paintOutcome(esc(raw));
    }
    const needle = String(e.emphasize);
    const idx = raw.indexOf(needle);
    if (idx < 0) return paintOutcome(esc(raw));
    return (
      esc(raw.slice(0, idx)) +
      `<span class="log-emphasis${critCls}">${esc(needle)}</span>` +
      paintOutcome(esc(raw.slice(idx + needle.length)))
    );
  }

  function logAvatarHtml(e) {
    const sheet = findSheetByWho(e.who, e.whoId);
    if (!sheet || !hasAvatar(sheet)) {
      return `<span class="log-avatar log-avatar--empty" aria-hidden="true"></span>`;
    }
    const { x, y } = avatarFocusOf(sheet);
    return `<img class="log-avatar" src="${sheet.avatar}" alt="" draggable="false" style="object-position:${x}% ${y}%">`;
  }

  function renderLog() {
    const box = el("#roll-log");
    if (!box) return;
    box.innerHTML = state.log.map((e) => `
      <div class="log-item ${e.kind || ""}${["armor-break", "damage", "panic-fail", "panic-ok", "crit-ok", "crit-bad"].includes(e.kind) ? " is-alert" : ""}">
        <div class="log-who-row">
          ${logAvatarHtml(e)}
          <div class="who">${esc(e.who || "стол")} · ${new Date(e.t).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
        </div>
        <div class="log-body">
          ${e.icon ? `<span class="log-icon${
            e.kind === "crit-ok" ? " log-icon--crit-ok"
            : e.kind === "crit-bad" ? " log-icon--crit-bad"
            : e.kind === "ok" ? " log-icon--ok"
            : e.kind === "bad" ? " log-icon--bad"
            : ""
          }" aria-hidden="true">${e.icon}</span>` : ""}
          <div class="log-text">
            ${e.badge ? `<span class="log-badge${
              e.kind === "damage" ? " log-badge-damage"
              : e.kind === "armor-break" ? " log-badge-armor"
              : e.kind === "panic-ok" || e.kind === "crit-ok" ? " log-badge-ok"
              : e.kind === "panic-fail" || e.kind === "crit-bad" ? " log-badge-panic"
              : ""
            }${e.kind === "crit-ok" ? " log-badge--crit-ok" : ""}${e.kind === "crit-bad" ? " log-badge--crit-bad" : ""}">${esc(e.badge)}</span>` : ""}
            <span>${formatLogText(e)}</span>
          </div>
        </div>
      </div>
    `).join("");
  }

  function renderTop() {
    const box = el("#top-actions");
    const refBtns = `
        <button type="button" class="btn" data-act="turn-ref">⏱ Ход</button>
        <button type="button" class="btn" data-act="panic-ref">😱 Паника</button>
        <button type="button" class="btn" data-act="wounds-ref">🩸 Раны</button>
        <button type="button" class="btn" data-act="crit-ref">☠ Криты</button>
        <button type="button" class="btn ${state.webhook && state.webhook.enabled ? "primary" : "ghost"}" data-act="webhook" title="Discord webhook">Webhook</button>`;
    if (state.view === "list") {
      box.innerHTML = `
        <button type="button" class="btn primary" data-act="new-char">+ Персонаж</button>
        <button type="button" class="btn" data-act="new-mon">+ Монстр</button>
        ${refBtns}
        <button type="button" class="btn ghost" data-act="export">Экспорт</button>
        <button type="button" class="btn ghost" data-act="import">Импорт</button>
      `;
    } else if (state.view === "panic" || state.view === "wounds" || state.view === "crit" || state.view === "turn") {
      box.innerHTML = `
        <button type="button" class="btn" data-act="back">← К списку</button>
        ${refBtns}
      `;
    } else {
      box.innerHTML = `
        <button type="button" class="btn" data-act="back">← К списку</button>
        ${refBtns}
        <button type="button" class="btn ghost" data-act="export-one">Экспорт листа</button>
        <button type="button" class="btn danger" data-act="delete">Удалить</button>
      `;
    }
  }

  function renderTurnRef() {
    el("#main").innerHTML = `
      <div class="sheet turn-ref">
        <div class="mosh">
          <section class="mosh-section turn-ref-section">
            <header class="turn-hero">
              <p class="sec-title">Памятка игрока · ход</p>
              <p class="turn-hero-lead">Mothership 1e · раунд ≈ 10 сек. Обычный ход: <strong>ходьба до ${MOVE_M.step} м</strong> + <strong>одно значимое действие</strong>. Заявки часто идут почти одновременно.</p>
              <div class="turn-hero-pills">
                <span class="turn-pill">~10 сек</span>
                <span class="turn-pill">ходьба ${MOVE_M.step} м</span>
                <span class="turn-pill turn-pill--accent">1 значимое</span>
              </div>
            </header>

            <div class="turn-grid">
              <div class="turn-block turn-block--major">
                <div class="turn-block-head">
                  <p class="block-label">Значимые действия</p>
                  <span class="turn-chip turn-chip--amber">1 / ход</span>
                </div>
                <p class="turn-lede">Одно за обычный ход (вместе с ходьбой до ${MOVE_M.step} м).</p>
                <ul class="turn-list">
                  <li>Атаковать кого-то или что-то</li>
                  <li>Перезарядить оружие <span class="turn-note">(без Военной подготовки / Огнестрела)</span></li>
                  <li>Перевязать рану / остановить кровотечение</li>
                  <li>Проверить жизненные показатели медсканером</li>
                  <li>Снова переместиться <span class="turn-note">(ещё до ${MOVE_M.step} м вместо другого действия)</span></li>
                  <li>Бросить что-то кому-то или в кого-то</li>
                  <li>Открыть шлюз / управлять механизмом</li>
                  <li>Воспользоваться терминалом</li>
                  <li>Управлять транспортом или кораблём / стрелять из его оружия</li>
                </ul>
              </div>
              <div class="turn-block turn-block--free">
                <div class="turn-block-head">
                  <p class="block-label">Свободные действия</p>
                  <span class="turn-chip turn-chip--cyan">свободно</span>
                </div>
                <p class="turn-lede">Не тратят значимое действие — если Смотритель не скажет иначе.</p>
                <ul class="turn-list">
                  <li>Коротко сказать / крикнуть</li>
                  <li>Оглядеться, задать вопрос Смотрителю</li>
                  <li>Укрыться <span class="turn-note">(часто вместе с перемещением)</span></li>
                  <li>Выхватить уже доступное оружие / предмет под рукой</li>
                  <li>Перезарядить оружие <span class="turn-note">с Военной подготовкой или Огнестрелом, если патроны под рукой</span></li>
                </ul>
              </div>
            </div>

            <div class="turn-block turn-block--wide turn-block--move">
              <div class="turn-block-head">
                <p class="block-label">Дальность ходьбы / бега</p>
              </div>
              <div class="turn-move">
                <div class="turn-move-row">
                  <span class="turn-move-k">Ходьба + действие</span>
                  <span class="turn-move-v">до <strong>${MOVE_M.step} м</strong></span>
                  <span class="turn-move-d">и одно значимое действие</span>
                </div>
                <div class="turn-move-row">
                  <span class="turn-move-k">Двойная ходьба</span>
                  <span class="turn-move-v">до <strong>${MOVE_M.step * 2} м</strong></span>
                  <span class="turn-move-d">ходьба + «снова переместиться» вместо действия</span>
                </div>
                <div class="turn-move-row is-sprint">
                  <span class="turn-move-k">Только бег</span>
                  <span class="turn-move-v">до <strong>${MOVE_M.sprint} м</strong></span>
                  <span class="turn-move-d">в раунде ничего, кроме бегства</span>
                </div>
              </div>
            </div>

            <div class="turn-block turn-block--wide turn-block--ranges">
              <div class="turn-block-head">
                <p class="block-label">Дальность дистанций</p>
              </div>
              <div class="turn-ranges">
                ${WEAPON_RANGES.map((r) => `
                  <div class="turn-range">
                    <span class="turn-range-name">${esc(r.name.replace(" (рукопаш)", ""))}</span>
                    <span class="turn-range-m">${esc(r.meters)}</span>
                    <span class="turn-range-hint">${esc(r.hint.replace(/^[^:]+:\s*/, ""))}</span>
                  </div>`).join("")}
              </div>
            </div>

            <div class="turn-block turn-block--wide turn-block--cover">
              <div class="turn-block-head">
                <p class="block-label">Укрытие</p>
              </div>
              <p class="turn-lede">Защита среды (как броня): обычно только от дальних атак. Урон ≥ ПБ укрытия — укрытие разрушено. Тяжёлое ещё даёт Снижение урона (СУ) до проверки ПБ.</p>
              <div class="turn-ranges turn-ranges--cover">
                <div class="turn-range turn-range--cover">
                  <span class="turn-range-name">Незначительное</span>
                  <span class="turn-range-m">ПБ 5</span>
                  <span class="turn-range-hint">Мебель, двери, щит из тела и т.п.</span>
                </div>
                <div class="turn-range turn-range--cover">
                  <span class="turn-range-name">Лёгкое</span>
                  <span class="turn-range-m">ПБ 10</span>
                  <span class="turn-range-hint">Деревья, переборки, металлическая мебель</span>
                </div>
                <div class="turn-range turn-range--cover is-heavy">
                  <span class="turn-range-name">Тяжёлое</span>
                  <span class="turn-range-m">СУ 5 · ПБ 20</span>
                  <span class="turn-range-hint">Шлюзы, бетон, корпуса кораблей</span>
                </div>
              </div>
              <ul class="turn-list turn-list--flat turn-list--rules">
                <li>Стреляя из укрытия, ты <strong>вне укрытия</strong> до начала своего следующего хода.</li>
                <li>Укрыться — обычно свободное действие (часто вместе с перемещением).</li>
              </ul>
            </div>

            <div class="turn-block turn-block--wide turn-block--crit">
              <div class="turn-block-head">
                <p class="block-label">Критические удачи и провалы</p>
              </div>
              <p class="turn-lede">На проверке характеристики или испытании «дубль» на d100 (00, 11, 22… 99) — крит.</p>
              <div class="turn-crit-grid">
                <div class="turn-crit turn-crit--ok">
                  <span class="turn-crit-k">Крит. удача</span>
                  <span class="turn-crit-v">успех + что-то особенно хорошее (решает Смотритель).</span>
                </div>
                <div class="turn-crit turn-crit--bad">
                  <span class="turn-crit-k">Крит. провал</span>
                  <span class="turn-crit-v">провал + осложнение, и сразу проверка паники (d20 &gt; стресс); при провале — таблица 2к10+стресс.</span>
                </div>
              </div>
              <ul class="turn-list turn-list--flat turn-list--rules">
                <li><strong>00</strong> всегда крит. удача; <strong>99</strong> всегда крит. провал.</li>
                <li>Обычный провал без дубля: +1 стресс, без паники.</li>
              </ul>
            </div>

            <div class="turn-block turn-block--wide turn-block--memo">
              <div class="turn-block-head">
                <p class="block-label">Полезно помнить</p>
              </div>
              <ul class="turn-list turn-list--flat turn-list--memo">
                <li><strong>Атака:</strong> проверка Боя + <em>подходящий</em> навык (напр. Огнестрел, Рукопашный бой, Военная подготовка) → урон (− ПБ). Провал: +1 стресс. Крит. провал: ещё проверка паники.</li>
                <li><strong>Неожиданность:</strong> испытание Страха — провал = оцепенение до следующего раунда.</li>
                <li><strong>Порядок:</strong> обычно без инициативы. Строгий порядок — проверка Скорости: успех до врагов, провал после.</li>
                <li><strong>Цель хода:</strong> обхитрить, убежать, выжить.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function defaultPanicStress() {
    const open = state.openId ? getSheet(state.openId) : null;
    if (open && open.type === "character") return Math.max(0, Number(open.stress) || 0);
    if (Number.isFinite(Number(state.panicStress))) return Math.max(0, Number(state.panicStress));
    return 2;
  }

  function rollPanicDice(stress) {
    const a = rollDie(10);
    const b = rollDie(10);
    const s = Math.max(0, Number(stress) || 0);
    const total = a + b + s;
    return { a, b, stress: s, total, row: lookupPanic(total) };
  }

  function rollPanicSideEffects(row, stress, who) {
    const lines = [];
    if (!row) return lines;
    const full = `${row.title}. ${row.text}`;
    const t = full.replace(/[−–—]/g, "-");

    const xDur = t.match(/[ХXхx]\s*к\s*10\s+(дней|минут|часов)/i);
    if (xDur) {
      const n = Math.max(1, Math.min(40, Number(stress) || 1));
      const d = parseDice(`${n}d10`);
      if (d) {
        pushLog({
          who,
          icon: "⏱",
          badge: "ДЛИТ.",
          text: `паника · ${n}к10 ${xDur[1]} (Х=стресс ${stress}): [${d.rolls.join("+")}] = ${d.total}`,
          kind: "ok",
          emphasize: String(d.total),
        });
        lines.push(`${n}к10 ${xDur[1]} = ${d.total}`);
      }
    }

    const durRe = /(\d+)\s*[кkd]\s*(\d+)\s+(часов|минут|дней)/gi;
    let m;
    while ((m = durRe.exec(t))) {
      const expr = critDiceExpr(+m[1], +m[2]);
      const d = parseDice(expr);
      if (!d) continue;
      pushLog({
        who,
        icon: "⏱",
        badge: "ДЛИТ.",
        text: `паника · ${m[1]}к${m[2]} ${m[3]}: [${d.rolls.join("+")}] = ${d.total}`,
        kind: "ok",
        emphasize: String(d.total),
      });
      lines.push(`${m[1]}к${m[2]} ${m[3]} = ${d.total}`);
    }

    // Только немедленный «Получи NкM Стресса» в начале эффекта, не условный в тексте фобии.
    const stressGain = row.text.match(/^\s*получи(?:те)?\s+(\d+)\s*[кkd]\s*(\d+)\s+стресс/i);
    if (stressGain) {
      const expr = critDiceExpr(+stressGain[1], +stressGain[2]);
      const d = parseDice(expr);
      if (d) {
        pushLog({
          who,
          icon: "😰",
          badge: "СТРЕСС",
          text: `паника · +${expr} стресса → ${d.total}`,
          kind: "damage",
          emphasize: String(d.total),
        });
        lines.push(`+${d.total} стресс`);
      }
    }

    if (/2\s*[кkd]\s*10\s+поврежд/i.test(t)) {
      const r = rollDamage("2d10", who, "паника · порог психоза", 0);
      if (r) lines.push(`порог 2к10 = ${r.total}`);
    }

    return lines;
  }

  function resolvePanicResult(result, opts = {}, depth = 0) {
    const who = opts.who || "паника";
    const row = result.row;
    const side = [];
    state.panicHit = {
      min: row.min,
      total: result.total,
      a: result.a,
      b: result.b,
      stress: result.stress,
    };
    state.panicStress = result.stress;
    pushLog({
      who,
      icon: "😱",
      badge: "ПАНИКА",
      text: `2к10+стресс: ${result.a}+${result.b}+${result.stress}=${result.total} · ${panicRangeLabel(row)} · ${panicBlurb(row)}`,
      kind: "panic-fail",
      emphasize: String(result.total),
    });
    side.push(...rollPanicSideEffects(row, result.stress, who));

    if (row && row.min === 27 && depth < 3) {
      pushLog({
        who,
        icon: "🔁",
        badge: "×2",
        text: "Гора проблем — два дополнительных броска",
        kind: "ok",
        emphasize: "×2",
      });
      const first = resolvePanicResult(rollPanicDice(result.stress), opts, depth + 1);
      const second = resolvePanicResult(rollPanicDice(result.stress), opts, depth + 1);
      state.panicHit = {
        min: 27,
        total: result.total,
        a: result.a,
        b: result.b,
        stress: result.stress,
        extras: [first, second].map((r) => r && r.row && r.row.min).filter((n) => n != null),
      };
      return result;
    }

    if (side.length) state.panicHit = { ...state.panicHit, damageLines: side };
    return result;
  }

  function logPanicTableDemo(min, opts = {}) {
    const row = PANIC_TABLE.find((r) => r.min === Number(min)) || lookupPanic(Number(min));
    state.panicHit = { min: row.min, total: row.min, demo: true };
    pushLog({
      who: opts.who || "паника · вручную",
      icon: "😱",
      badge: "ПАНИКА",
      text: `${panicRangeLabel(row)} · ${panicBlurb(row)}`,
      kind: "panic-fail",
      emphasize: panicRangeLabel(row),
    });
  }

  function renderPanicRef() {
    const hit = state.panicHit;
    const hitRow = hit ? PANIC_TABLE.find((r) => r.min === hit.min) : null;
    const stress = defaultPanicStress();
    el("#main").innerHTML = `
      <div class="sheet panic-ref">
        <div class="mosh">
          <section class="mosh-section">
            <p class="sec-title">Справка мастера · эффекты паники (2к10 + стресс)</p>
            <p class="hint">По рулбуку проверка на листе: <strong>d20 &gt; стресса</strong> = успех (паники нет). При провале бросай здесь: <strong>2к10 + текущий стресс</strong> → строка таблицы.</p>
            <div class="filters panic-actions" style="margin:10px 0">
              <label class="panic-stress-field">Стресс
                <input type="number" min="0" max="99" id="panic-stress" value="${stress}" data-panic-stress>
              </label>
              <button type="button" class="btn primary" data-panic-roll>Бросить 2к10 + стресс</button>
              <button type="button" class="btn" data-panic-clear ${hit ? "" : "disabled"}>Сбросить подсветку</button>
            </div>
            ${hitRow ? `
              <div class="panic-result">
                <div class="panic-result-dice">
                  ${hit.demo
                    ? `<em>строка</em> ${esc(panicRangeLabel(hitRow))}`
                    : `<em>2к10+стресс</em> ${hit.a}+${hit.b}+${hit.stress}=${hit.total}`}
                  <span class="panic-result-arrow">→</span>
                  <span>${esc(panicRangeLabel(hitRow))} · ${esc(hitRow.title)}</span>
                </div>
                <p class="panic-result-text">${esc(hitRow.text)}</p>
                ${(hit.damageLines && hit.damageLines.length) ? `
                  <p class="crit-result-dmg"><em>броски</em> ${hit.damageLines.map(esc).join(" · ")}</p>
                ` : ""}
              </div>` : ""}
            <table class="panic-table">
              <thead>
                <tr><th>Бросок</th><th>Панический эффект</th></tr>
              </thead>
              <tbody>
                ${PANIC_TABLE.map((row) => {
                  const isHit = hit && hit.min === row.min;
                  return `
                  <tr class="${isHit ? "is-panic-hit" : ""}">
                    <td class="panic-roll">${esc(panicRangeLabel(row))}</td>
                    <td>
                      <button type="button" class="panic-cell" data-panic-demo="${row.min}">
                        <div class="panic-title">${esc(row.title)}</div>
                        <div class="panic-text">${esc(row.text)}</div>
                      </button>
                    </td>
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    `;
  }

  function renderWoundsRef() {
    const type = state.woundType || "blunt";
    const typeName = (WOUND_TYPES.find((t) => t.id === type) || WOUND_TYPES[0]).name;
    el("#main").innerHTML = `
      <div class="sheet wounds-ref">
        <div class="mosh">
          <section class="mosh-section">
            <p class="sec-title">Справка мастера · раны (Mothership 1e)</p>
            <p class="hint">Когда <strong>здоровье</strong> падает до 0 — получи <strong>рану</strong> и брось <strong>1d10</strong> (0–9) по колонке типа урона. Затем восстанови здоровье до максимума и вычти перенос урона. Некоторые оружия бьют сразу в две колонки (напр. кровотечение + обширные). Кровотечение суммируется: +N = N урона каждый раунд, игнорирует броню и снижение урона. Тяжёлые раны — испытание смерти через 1d10 раундов.</p>
            <div class="filters" style="margin:10px 0">
              ${WOUND_TYPES.map((t) => `
                <button type="button" data-wound-type="${t.id}" class="${type === t.id ? "is-on" : ""}">${esc(t.name)}</button>
              `).join("")}
              <button type="button" class="btn primary" data-wound-roll>Бросить d10 · ${esc(typeName)}</button>
            </div>
            <div class="wounds-scroll">
              <table class="wounds-table">
                <thead>
                  <tr>
                    <th>d10</th>
                    <th>Тяжесть</th>
                    ${WOUND_TYPES.map((t) => `<th class="${t.id === type ? "is-focus" : ""}">${esc(t.name)}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${WOUNDS_TABLE.map((row) => `
                    <tr>
                      <td class="panic-roll">${String(row.roll).padStart(2, "0")}</td>
                      <td class="wound-sev">${esc(row.severity)}</td>
                      ${WOUND_TYPES.map((t) => `
                        <td class="${t.id === type ? "is-focus" : ""}">
                          <button type="button" class="wound-cell" data-wound-demo="${row.roll}" data-wound-col="${t.id}">
                            ${esc(row[t.id])}
                          </button>
                        </td>`).join("")}
                    </tr>`).join("")}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function formatCritResult(part, sev) {
    const p = CRIT_PARTS[part];
    const s = CRIT_SEVERITIES[sev];
    const text = critCell(part, sev);
    const sevLabel = s.hint ? `${s.name} (${s.hint})` : s.name;
    return {
      part,
      sev,
      partName: p.name,
      sevName: sevLabel,
      text,
      line: `часть ${String(part).padStart(2, "0")} ${p.name} → ранение ${String(sev).padStart(2, "0")} ${sevLabel}: ${text}`,
    };
  }

  function logCritResult(part, sev, opts = {}) {
    const who = opts.who || "крит";
    const r = formatCritResult(part, sev);
    pushLog({
      who,
      icon: "☠",
      badge: "КРИТ",
      text: r.line,
      kind: "damage",
      emphasize: `${String(part).padStart(2, "0")}→${String(sev).padStart(2, "0")}`,
    });
    const damageLines = rollCritExtraDamage(r.text, who);
    state.critHit = { part, sev, damageLines };
    r.damageLines = damageLines;
    return r;
  }

  function renderCritRef() {
    const hit = state.critHit;
    const hitResult = hit ? formatCritResult(hit.part, hit.sev) : null;
    el("#main").innerHTML = `
      <div class="sheet crit-ref">
        <div class="mosh">
          <section class="mosh-section">
            <p class="sec-title">Справка мастера · критические ранения (домовка)</p>
            <p class="hint">При критическом попадании врага по игроку: сначала <strong>1d10</strong> (0–9) — <strong>часть тела</strong>, затем <strong>1d10</strong> (0–9) — <strong>тяжесть</strong>.</p>
            <div class="filters crit-actions" style="margin:10px 0">
              <button type="button" class="btn primary" data-crit-roll>Бросить крит · часть → ранение</button>
              <button type="button" class="btn" data-crit-clear ${hit ? "" : "disabled"}>Сбросить подсветку</button>
            </div>
            ${hitResult ? `
              <div class="crit-result">
                <div class="crit-result-dice">
                  <span><em>часть</em> ${String(hitResult.part).padStart(2, "0")} · ${esc(hitResult.partName)}</span>
                  <span class="crit-result-arrow">→</span>
                  <span><em>ранение</em> ${String(hitResult.sev).padStart(2, "0")} · ${esc(hitResult.sevName)}</span>
                </div>
                <p class="crit-result-text">${esc(hitResult.text)}</p>
                ${(hit.damageLines && hit.damageLines.length) ? `
                  <p class="crit-result-dmg"><em>урон</em> ${hit.damageLines.map(esc).join(" · ")}</p>
                ` : ""}
              </div>` : ""}
            <div class="wounds-scroll crit-scroll">
              <table class="wounds-table crit-table">
                <thead>
                  <tr>
                    <th>d10</th>
                    <th>Тяжесть</th>
                    ${CRIT_PARTS.map((p) => `
                      <th>${String(p.id)}<br>${esc(p.name)}</th>
                    `).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${CRIT_SEVERITIES.map((s) => `
                    <tr>
                      <td class="panic-roll">${String(s.id).padStart(2, "0")}</td>
                      <td class="wound-sev">${esc(s.name)}${s.hint ? `<span class="crit-sev-hint">${esc(s.hint)}</span>` : ""}</td>
                      ${CRIT_PARTS.map((p) => {
                        const isHit = hit && hit.part === p.id && hit.sev === s.id;
                        return `
                        <td class="${isHit ? "is-crit-hit" : ""}">
                          <button type="button" class="wound-cell crit-cell" data-crit-part="${p.id}" data-crit-sev="${s.id}">
                            ${esc(critCell(p.id, s.id))}
                          </button>
                        </td>`;
                      }).join("")}
                    </tr>`).join("")}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function renderList() {
    const filter = state.filter || "all";
    let sheets = state.sheets;
    if (filter === "character") sheets = sheets.filter((s) => s.type === "character");
    if (filter === "monster") sheets = sheets.filter((s) => s.type === "monster");
    const nChar = state.sheets.filter((s) => s.type === "character").length;
    const nMon = state.sheets.filter((s) => s.type === "monster").length;
    const whOn = !!(state.webhook && state.webhook.enabled && isDiscordWebhookUrl(state.webhook.url));

    el("#main").innerHTML = `
      <div class="list-view">
        <header class="list-head">
          <div>
            <p class="sec-title">Листы экипажа</p>
            <p class="list-head-sub">${nChar} персонаж${nChar === 1 ? "" : nChar >= 2 && nChar <= 4 ? "а" : "ей"} · ${nMon} монстр${nMon === 1 ? "" : nMon >= 2 && nMon <= 4 ? "а" : "ов"} · webhook: <span class="${whOn ? "wh-on" : "wh-off"}">${whOn ? "вкл" : "выкл"}</span></p>
          </div>
          <div class="filters list-filters">
            <button type="button" data-filter="all" class="${filter === "all" ? "is-on" : ""}">Все</button>
            <button type="button" data-filter="character" class="${filter === "character" ? "is-on" : ""}">Персонажи</button>
            <button type="button" data-filter="monster" class="${filter === "monster" ? "is-on" : ""}">Монстры</button>
          </div>
        </header>
        ${sheets.length ? `<div class="card-grid">${sheets.map(cardHtml).join("")}</div>` : `<p class="empty">Листов пока нет. Создайте персонажа или монстра.</p>`}
      </div>
    `;
  }

  function cardMeter(cur, max, cls = "") {
    const m = Math.max(1, Number(max) || 1);
    const c = clamp(Number(cur) || 0, 0, m);
    const pct = Math.round((c / m) * 100);
    return `<span class="card-meter ${cls}" style="--pct:${pct}%" title="${c}/${m}"><span class="card-meter-fill"></span></span>`;
  }

  const AVATAR_MAX_SIDE = 320;
  const AVATAR_JPEG_QUALITY = 0.82;

  function hasAvatar(sheet) {
    return !!(sheet && typeof sheet.avatar === "string" && sheet.avatar.startsWith("data:image/"));
  }

  function avatarFocusOf(sheet) {
    const f = sheet && sheet.avatarFocus;
    const x = f && Number.isFinite(Number(f.x)) ? clamp(Number(f.x), 0, 100) : 50;
    const y = f && Number.isFinite(Number(f.y)) ? clamp(Number(f.y), 0, 100) : 50;
    return { x, y };
  }

  function avatarPosStyle(sheet) {
    const { x, y } = avatarFocusOf(sheet);
    return `object-position:${x}% ${y}%`;
  }

  function avatarImgHtml(sheet, cls = "") {
    if (!hasAvatar(sheet)) {
      return `<span class="avatar-fallback ${cls}" aria-hidden="true">${sheet?.type === "monster" ? "◈" : "◎"}</span>`;
    }
    return `<img class="avatar-img ${cls}" src="${sheet.avatar}" alt="" draggable="false" style="${avatarPosStyle(sheet)}">`;
  }

  function avatarEditorHtml(sheet) {
    return `
      <div class="avatar-editor">
        <div class="avatar-preview${hasAvatar(sheet) ? " is-pan" : ""}" ${hasAvatar(sheet) ? `data-avatar-pan title="Перетащите, чтобы выбрать кадр"` : ""}>
          ${avatarImgHtml(sheet, "avatar-img--lg")}
        </div>
        <div class="avatar-actions">
          <button type="button" class="btn small" data-avatar-pick>Выбрать фото</button>
          ${hasAvatar(sheet) ? `
            <button type="button" class="btn small" data-avatar-frame>Кадр</button>
            <button type="button" class="btn small ghost" data-avatar-clear>Убрать</button>
          ` : ""}
          <p class="hint avatar-hint">${hasAvatar(sheet)
            ? "Перетащите превью или откройте «Кадр», чтобы выбрать видимую часть"
            : "Картинка с компьютера · сжимается для сохранения"}</p>
        </div>
      </div>`;
  }

  function openAvatarFrameModal(sheet) {
    if (!hasAvatar(sheet)) return;
    const focus = { ...avatarFocusOf(sheet) };
    openModal(`
      <h3>Кадр аватарки</h3>
      <p class="hint" style="margin-top:0">Перетащите изображение — в рамке останется то, что будет на листе и в списке.</p>
      <div class="avatar-frame-stage" data-avatar-pan data-avatar-frame-live>
        <img class="avatar-img avatar-img--frame" src="${sheet.avatar}" alt="" draggable="false" style="object-position:${focus.x}% ${focus.y}%">
        <span class="avatar-cross" aria-hidden="true"></span>
      </div>
      <div class="avatar-frame-sliders">
        <label class="avatar-slider-field">Горизонт
          <input type="range" min="0" max="100" value="${focus.x}" data-avatar-axis="x">
        </label>
        <label class="avatar-slider-field">Вертикаль
          <input type="range" min="0" max="100" value="${focus.y}" data-avatar-axis="y">
        </label>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn ghost" data-modal-cancel>Отмена</button>
        <button type="button" class="btn primary" id="avatar-frame-go">Сохранить кадр</button>
      </div>
    `);
    const modal = el(".modal") || document;
    const img = modal.querySelector(".avatar-img--frame");
    const sx = modal.querySelector('[data-avatar-axis="x"]');
    const sy = modal.querySelector('[data-avatar-axis="y"]');
    const syncUi = () => {
      if (img) img.style.objectPosition = `${focus.x}% ${focus.y}%`;
      if (sx) sx.value = String(Math.round(focus.x));
      if (sy) sy.value = String(Math.round(focus.y));
    };
    const setFocus = (x, y, fromSlider) => {
      focus.x = clamp(x, 0, 100);
      focus.y = clamp(y, 0, 100);
      syncUi();
      if (!fromSlider) return;
    };
    sx.onchange = sx.oninput = () => setFocus(Number(sx.value), focus.y, true);
    sy.onchange = sy.oninput = () => setFocus(focus.x, Number(sy.value), true);
    bindAvatarPan(modal, {
      getFocus: () => focus,
      setFocus: (x, y) => setFocus(x, y, false),
    });
    el("#avatar-frame-go").onclick = () => {
      sheet.avatarFocus = { x: Math.round(focus.x), y: Math.round(focus.y) };
      save();
      closeModal();
      render();
    };
  }

  function bindAvatarPan(root = document, api) {
    els("[data-avatar-pan]", root).forEach((box) => {
      if (box.dataset.panBound) return;
      box.dataset.panBound = "1";
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      const applyDelta = (dx, dy) => {
        const sheet = api ? null : getSheet(state.openId);
        const cur = api ? api.getFocus() : avatarFocusOf(sheet || {});
        // Тянем картинку: фокус едет в обратную сторону.
        const nextX = cur.x - (dx / Math.max(box.clientWidth, 1)) * 100;
        const nextY = cur.y - (dy / Math.max(box.clientHeight, 1)) * 100;
        if (api) {
          api.setFocus(nextX, nextY);
          return;
        }
        if (!sheet || !hasAvatar(sheet)) return;
        sheet.avatarFocus = {
          x: Math.round(clamp(nextX, 0, 100)),
          y: Math.round(clamp(nextY, 0, 100)),
        };
        const img = box.querySelector(".avatar-img");
        if (img) img.style.objectPosition = `${sheet.avatarFocus.x}% ${sheet.avatarFocus.y}%`;
      };
      box.addEventListener("pointerdown", (ev) => {
        if (ev.button != null && ev.button !== 0) return;
        dragging = true;
        lastX = ev.clientX;
        lastY = ev.clientY;
        box.classList.add("is-dragging");
        try { box.setPointerCapture(ev.pointerId); } catch (_) { /* ignore */ }
        ev.preventDefault();
      });
      box.addEventListener("pointermove", (ev) => {
        if (!dragging) return;
        applyDelta(ev.clientX - lastX, ev.clientY - lastY);
        lastX = ev.clientX;
        lastY = ev.clientY;
      });
      const endDrag = (ev) => {
        if (!dragging) return;
        dragging = false;
        box.classList.remove("is-dragging");
        try { box.releasePointerCapture(ev.pointerId); } catch (_) { /* ignore */ }
        if (!api) save();
      };
      box.addEventListener("pointerup", endDrag);
      box.addEventListener("pointercancel", endDrag);
    });
  }

  function readAvatarFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !String(file.type || "").startsWith("image/")) {
        reject(new Error("Нужен файл изображения"));
        return;
      }
      if (file.size > 12 * 1024 * 1024) {
        reject(new Error("Файл слишком большой (макс. ~12 МБ)"));
        return;
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(1, AVATAR_MAX_SIDE / Math.max(img.width, img.height, 1));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/jpeg", AVATAR_JPEG_QUALITY);
          URL.revokeObjectURL(url);
          resolve(dataUrl);
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(err);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Не удалось прочитать изображение"));
      };
      img.src = url;
    });
  }

  function cardHtml(s) {
    if (s.type === "character") {
      const cls = classById(s.classId);
      const fullName = [s.name, s.surname].filter(Boolean).join(" ");
      const ageBit = s.age !== "" && s.age != null ? `${esc(String(s.age))} лет` : "";
      const genderBit = s.gender === "male" ? "♂" : s.gender === "female" ? "♀" : "";
      const skillsN = (s.skills || []).length;
      const condN = (s.conditions || []).length;
      const atkN = (s.attacks || []).length;
      const stress = Number(s.stress) || 0;
      const stressCls = stressGlitchClass(stress);
      const woundCls = woundPulseClass(s.wounds, s.woundsMax);
      const healthCls = healthCrackClass(s.health, s.healthMax);
      const subBits = [esc(cls.name), ageBit, genderBit].filter(Boolean).join(" · ");
      return `
        <button type="button" class="card card--char" data-open="${s.id}">
          <div class="card-head">
            <div class="card-avatar">${avatarImgHtml(s, "avatar-img--card")}</div>
            <div class="card-head-text">
              <div class="card-top">
                <span class="card-type">Персонаж</span>
                <span class="card-class">${esc(cls.name)}</span>
              </div>
              <h2 class="card-title">${esc(fullName || "Без имени")}</h2>
              ${subBits ? `<p class="card-sub">${subBits}</p>` : ""}
            </div>
          </div>
          <div class="card-vitals">
            <div class="card-vital ${healthCls}">
              <span class="card-vital-k">Здоровье</span>
              <span class="card-vital-v">${Number(s.health) || 0}<span class="card-vital-max">/${Number(s.healthMax) || 0}</span></span>
              ${cardMeter(s.health, s.healthMax, "is-health")}
            </div>
            <div class="card-vital ${woundCls}">
              <span class="card-vital-k">Раны</span>
              <span class="card-vital-v">${Number(s.wounds) || 0}<span class="card-vital-max">/${Number(s.woundsMax) || 0}</span></span>
              ${cardMeter(s.wounds, s.woundsMax, "is-wounds")}
            </div>
            <div class="card-vital ${stressCls}">
              <span class="card-vital-k">Стресс</span>
              <span class="card-vital-v">${stress}<span class="card-vital-max">/${Math.max(20, stress)}</span></span>
              ${cardMeter(stress, 20, "is-stress")}
            </div>
          </div>
          <div class="card-stats">
            <span><em>Сил</em> ${Number(s.str) || 0}</span>
            <span><em>Скор</em> ${Number(s.spd) || 0}</span>
            <span><em>Инт</em> ${Number(s.int) || 0}</span>
            <span><em>Бой</em> ${Number(s.cmb) || 0}</span>
          </div>
          <div class="card-foot">
            <span class="card-chip">ПБ ${Number(s.armor) || 0}</span>
            <span class="card-chip">Навыки ${skillsN}</span>
            <span class="card-chip">Атаки ${atkN}</span>
            ${condN ? `<span class="card-chip is-warn">Сост. ${condN}</span>` : `<span class="card-chip is-mute">Сост. 0</span>`}
            <span class="card-chip is-mute">${Number(s.credits) || 0} cr</span>
          </div>
        </button>`;
    }

    migrateMonsterVitals(s);
    return `
      <button type="button" class="card card--mon monster" data-open="${s.id}">
        <div class="card-head">
          <div class="card-avatar">${avatarImgHtml(s, "avatar-img--card")}</div>
          <div class="card-head-text">
            <div class="card-top">
              <span class="card-type">Монстр</span>
              <span class="card-class is-mon">угроза</span>
            </div>
            <h2 class="card-title">${esc(s.name || "Без имени")}</h2>
          </div>
        </div>
        <div class="card-stats card-stats--mon">
          <span><em>Бой</em> ${Number(s.combat) || 0}</span>
          <span><em>Скор</em> ${Number(s.speed) || 0}</span>
          <span><em>Инст</em> ${Number(s.instinct) || 0}</span>
        </div>
        <div class="card-vitals">
          <div class="card-vital ${healthCrackClass(s.health, s.healthMax)}">
            <span class="card-vital-k">Здоровье</span>
            <span class="card-vital-v">${Number(s.health) || 0}<span class="card-vital-max">/${Number(s.healthMax) || 0}</span></span>
            ${cardMeter(s.health, s.healthMax, "is-health")}
          </div>
          <div class="card-vital ${woundPulseClass(s.wounds, s.woundsMax)}">
            <span class="card-vital-k">Раны</span>
            <span class="card-vital-v">${Number(s.wounds) || 0}<span class="card-vital-max">/${Number(s.woundsMax) || 0}</span></span>
            ${cardMeter(s.wounds, s.woundsMax, "is-wounds")}
          </div>
          <div class="card-vital">
            <span class="card-vital-k">Броня</span>
            <span class="card-vital-v">${Number(s.armor) || 0}<span class="card-vital-max"> ПБ</span></span>
          </div>
        </div>
      </button>`;
  }

  function woundPips(max, currentHurt) {
    const n = clamp(max || 0, 1, 20);
    let html = "";
    for (let i = 1; i <= n; i++) {
      const isHurt = i <= currentHurt;
      html += `<button type="button" class="wound-pip is-max ${isHurt ? "is-hurt" : ""}" data-wound-pip="${i}">${i}</button>`;
    }
    return html;
  }

  /** Оставшийся запас слотов ран: 100% → зелёный, 50% → жёлтый, <50% → красный. */
  function woundPulseClass(wounds, woundsMax) {
    const max = Math.max(1, Number(woundsMax) || 1);
    const hurt = Math.max(0, Number(wounds) || 0);
    const remaining = Math.max(0, (max - hurt) / max);
    if (remaining > 0.5) return "wound-pulse--ok";
    if (remaining >= 0.5) return "wound-pulse--warn";
    return "wound-pulse--crit";
  }

  /** Трещины по оставшемуся здоровью. */
  function healthCrackClass(health, healthMax) {
    const max = Math.max(1, Number(healthMax) || 1);
    const cur = Math.max(0, Number(health) || 0);
    const ratio = cur / max;
    if (ratio > 0.5) return "health-crack--ok";
    if (ratio >= 0.5) return "health-crack--warn";
    return "health-crack--crit";
  }

  /** Глитч по абсолютному стрессу. */
  function stressGlitchClass(stress) {
    const s = Math.max(0, Number(stress) || 0);
    if (s <= 5) return "stress-glitch--low";
    if (s <= 12) return "stress-glitch--mid";
    return "stress-glitch--high";
  }

  function armorShatterClass(armor) {
    return Number(armor) === 0 ? "armor-shatter--broken" : "";
  }

  function skillDefaultStat(name) {
    const def = skillDefByName(name);
    if (def && def.stat) return def.stat;
    const n = String(name || "").toLowerCase();
    if (/огнестрел|рукопаш|тактик|военн|команд/.test(n)) return "cmb";
    if (/атлетик|невесомост|выживан|пилот/.test(n)) return "spd";
    if (/взрывчат|пром\.|умелые руки|мех\.|робот|инжен|кибер/.test(n)) return "str";
    return "int";
  }

  function skillStatKey(sk) {
    return sk.stat || skillDefaultStat(sk.name);
  }

  const SKILL_STAT_OPTIONS = [
    ["int", "Интеллект"],
    ["cmb", "Бой"],
    ["spd", "Скорость"],
    ["str", "Сила"],
    ["san", "Рассудок"],
    ["fear", "Страх"],
    ["body", "Тело"],
  ];

  function openSkillStatPicker(sheet, skillId) {
    const sk = (sheet.skills || []).find((s) => s.id === skillId);
    if (!sk) return;
    const cur = skillStatKey(sk);
    openModal(`
      <h3>Характеристика · ${esc(sk.name)}</h3>
      <p class="hint">Выберите, по какой характеристике идёт проверка</p>
      <div class="stat-pick-list">
        ${SKILL_STAT_OPTIONS.map(([key, label]) => {
          const val = charStatTarget(sheet, key);
          const on = key === cur ? " is-on" : "";
          return `<button type="button" class="stat-pick${on}" data-stat-pick="${key}">
            <span class="stat-pick-name">${esc(label)}</span>
            <span class="stat-pick-val">${val}</span>
          </button>`;
        }).join("")}
      </div>
      <div class="modal-actions">
        <button type="button" class="btn ghost" data-modal-cancel>Отмена</button>
      </div>
    `);
    el(".stat-pick-list").onclick = (ev) => {
      const btn = ev.target.closest("[data-stat-pick]");
      if (!btn) return;
      sk.stat = btn.dataset.statPick;
      save();
      closeModal();
      render();
    };
  }

  function rollSkillCheck(sheet, skillId) {
    const sk = (sheet.skills || []).find((s) => s.id === skillId);
    if (!sk) return;
    const key = skillStatKey(sk);
    const bonus = Number(sk.bonus) || 0;
    const target = charStatTarget(sheet, key) + bonus;
    underCheck(`${statLabel(key)} + ${sk.name} (+${bonus})`, target, sheet.name);
  }

  function skillMetaHtml(key, base, bonus, target) {
    return `проверка: <span class="skill-meta-stat">${esc(statLabel(key))}</span> ${base}+${bonus} = ${target}`;
  }

  function refreshSkillTargets(sheet) {
    if (!sheet || sheet.type !== "character") return;
    els("[data-skill-roll]").forEach((btn) => {
      const sk = (sheet.skills || []).find((s) => s.id === btn.dataset.skillRoll);
      if (!sk) return;
      const key = skillStatKey(sk);
      const base = charStatTarget(sheet, key);
      const bonus = Number(sk.bonus) || 0;
      const target = base + bonus;
      const meta = btn.querySelector(".skill-meta");
      if (meta) meta.innerHTML = skillMetaHtml(key, base, bonus, target);
      btn.title = `d100 ≤ ${target}`;
    });
  }

  function skillCols(sheet) {
    const groups = { 10: [], 15: [], 20: [] };
    for (const sk of sheet.skills || []) {
      const b = sk.bonus || 10;
      (groups[b] || groups[10]).push(sk);
    }
    const owned = new Set((sheet.skills || []).map((s) => s.name));
    const nextHints = (bonus) => {
      const pool = SKILL_DEFS.filter((d) => d.bonus === bonus && !owned.has(d.name));
      const ready = pool.filter((d) => skillPrereqMet(sheet, d));
      if (!ready.length) {
        if (bonus === 10) return "Базовый уровень — без требований.";
        if (bonus === 15) return "Чтобы взять: нужен подходящий обученный навык.";
        return "Чтобы взять: нужен подходящий экспертный навык.";
      }
      return `Доступно сейчас: ${ready.slice(0, 4).map((d) => d.name).join(", ")}${ready.length > 4 ? "…" : ""}`;
    };
    const col = (title, bonus, arr, gateHint) => `
      <div class="skill-col" data-bonus="${bonus}">
        <h4>${title} (+${bonus})</h4>
        <p class="skill-gate">${esc(gateHint)}</p>
        ${arr.map((sk) => {
          const key = skillStatKey(sk);
          const base = charStatTarget(sheet, key);
          const target = base + (Number(sk.bonus) || 0);
          const unlocks = skillUnlocks(sk.name).filter((n) => !owned.has(n));
          const tip = unlocks.length
            ? `Открывает: ${unlocks.join(", ")}`
            : "Дальше по ветке ничего не открывает";
          return `
          <div class="skill-item">
            <button type="button" class="skill-roll" data-skill-roll="${sk.id}" title="d100 ≤ ${target}. ${tip}">
              <span class="skill-name">${esc(sk.name)}${skillTipIcon(sk.name)}</span>
              <span class="skill-meta">${skillMetaHtml(key, base, sk.bonus, target)}</span>
              <span class="skill-unlock">${unlocks.length ? `→ ${esc(unlocks.slice(0, 3).join(", "))}${unlocks.length > 3 ? "…" : ""}` : "ветка закрыта"}</span>
            </button>
            <button type="button" class="skill-stat" data-skill-stat="${sk.id}" title="Сменить характеристику">⇄</button>
            <button type="button" class="skill-del" title="Удалить" data-skill-del="${sk.id}">×</button>
          </div>`;
        }).join("") || `<p class="hint">пусто</p>`}
        <button type="button" class="btn small" data-skill-add="${bonus}" style="margin-top:8px">+ навык</button>
      </div>`;
    return `
      <div class="skills-wrap">
        ${col("Обученные", 10, groups[10], nextHints(10))}
        ${col("Экспертные", 15, groups[15], nextHints(15))}
        ${col("Мастерские", 20, groups[20], nextHints(20))}
      </div>
      <p class="hint">Клик — бросок · ⇄ характеристика · → что открывает</p>`;
  }

  function renderCharacter(sheet) {
    const cls = classById(sheet.classId);
    el("#main").innerHTML = `
      <div class="sheet sheet-wide">
        <div class="sheet-cols">
          <div class="mosh">
            <section class="mosh-section">
              <p class="sec-title">Личные данные</p>
              ${avatarEditorHtml(sheet)}
              <div class="details-grid">
                <div class="field"><label>Имя</label><input class="sheet-input" data-f="name" name="char-given-name" autocomplete="off" spellcheck="false" value="${esc(sheet.name)}"></div>
                <div class="field"><label>Фамилия</label><input class="sheet-input" data-f="surname" name="char-family-name" autocomplete="off" spellcheck="false" value="${esc(sheet.surname || "")}"></div>
                <div class="field"><label>Возраст</label><input class="sheet-input" data-f="age" type="number" min="0" inputmode="numeric" autocomplete="off" value="${sheet.age !== "" && sheet.age != null ? esc(String(sheet.age)) : ""}"></div>
                <div class="field"><label>Пол</label>
                  <select data-f="gender" autocomplete="off">
                    <option value="" ${!sheet.gender ? "selected" : ""}>—</option>
                    <option value="male" ${sheet.gender === "male" ? "selected" : ""}>Мужской</option>
                    <option value="female" ${sheet.gender === "female" ? "selected" : ""}>Женский</option>
                  </select>
                </div>
              </div>
            </section>

            <section class="mosh-section">
              <p class="sec-title">1. Характеристики</p>
              <div class="stats-row">
                ${statCell("str", "Сила", sheet.str)}
                ${statCell("spd", "Скорость", sheet.spd)}
                ${statCell("int", "Интеллект", sheet.int)}
                ${statCell("cmb", "Бой", sheet.cmb)}
              </div>
            </section>

            <section class="mosh-section">
              <p class="sec-title">2. Испытания</p>
              <div class="saves-row">
                ${saveCell("san", "Рассудок", sheet.san)}
                ${saveCell("fear", "Страх", sheet.fear)}
                ${saveCell("body", "Тело", sheet.body)}
              </div>
            </section>

            <section class="mosh-section">
              <p class="sec-title">3–5. Здоровье, раны, стресс</p>
              <div class="vitals">
                <div class="vital-card vital-card--health ${healthCrackClass(sheet.health, sheet.healthMax)}">
                  <span class="health-crack-layer" aria-hidden="true"></span>
                  <p class="block-label">Здоровье</p>
                  <div class="vital-pair">
                    <input class="vital-num" type="number" data-f="health" value="${sheet.health}" title="текущее здоровье" aria-label="Здоровье сейчас">
                    <span class="vital-sep">/</span>
                    <input class="vital-num vital-num--sec" type="number" data-f="healthMax" value="${sheet.healthMax}" title="максимум" aria-label="Здоровье макс">
                  </div>
                </div>

                <div class="vital-card vital-card--wounds ${woundPulseClass(sheet.wounds, sheet.woundsMax)}">
                  <p class="block-label">Раны</p>
                  <div class="vital-pair">
                    <input class="vital-num" type="number" data-f="wounds" value="${sheet.wounds}" title="текущие раны" aria-label="Раны сейчас">
                    <span class="vital-sep">/</span>
                    <input class="vital-num vital-num--sec" type="number" data-f="woundsMax" value="${sheet.woundsMax}" title="максимум ран" aria-label="Раны макс">
                  </div>
                </div>

                <div class="vital-card vital-card--stress ${stressGlitchClass(sheet.stress)}">
                  <span class="stress-glitch-layer" aria-hidden="true"></span>
                  <p class="block-label">Стресс <span class="vital-meta">(Мин. ${Number.isFinite(Number(sheet.stressMin)) ? Number(sheet.stressMin) : 2})</span></p>
                  <div class="vital-pair vital-pair--solo">
                    <input class="vital-num stress-glitch-num" id="stress-display" type="number" data-f="stress" value="${Number(sheet.stress) || 0}" title="текущий стресс" aria-label="Стресс">
                  </div>
                  <button type="button" class="btn small vital-panic" data-panic title="1e: d20 > стресса = успех (паники нет)">Проверка паники</button>
                </div>

                <div class="vital-card vital-card--armor ${armorShatterClass(sheet.armor)}">
                  <p class="block-label">Броня <span class="vital-meta">ПБ</span></p>
                  <div class="vital-pair vital-pair--solo">
                    <span class="armor-num-wrap">
                      <input class="vital-num" type="number" data-f="armor" value="${sheet.armor}" title="рейтинг брони (ПБ)" aria-label="Броня">
                    </span>
                  </div>
                </div>

                <div class="vital-card vital-card--credits">
                  <p class="block-label">Кредиты</p>
                  <div class="vital-pair vital-pair--solo">
                    <input class="vital-num vital-num--wide" type="number" data-f="credits" value="${sheet.credits}" aria-label="Кредиты">
                  </div>
                  <div class="cred-ops">
                    <button type="button" class="btn small" data-cred="-100">−100</button>
                    <button type="button" class="btn small" data-cred="-10">−10</button>
                    <button type="button" class="btn small" data-cred="10">+10</button>
                    <button type="button" class="btn small" data-cred="100">+100</button>
                  </div>
                </div>
              </div>
            </section>

            <section class="mosh-section class-panel">
              <div class="class-panel-head">
                <p class="sec-title">6. Класс</p>
                <div class="class-pick" role="group" aria-label="Класс персонажа">
                  ${CLASSES.map((c) => `
                    <button type="button" class="class-badge${c.id === cls.id ? " is-on" : ""}" data-class-pick="${c.id}" title="${esc(c.blurb || c.name)}">${esc(c.name)}</button>
                  `).join("")}
                </div>
              </div>
              ${cls.blurb ? `<p class="class-blurb">${esc(cls.blurb)}</p>` : ""}
              <div class="class-grid">
                <div class="class-card">
                  <p class="block-label">Бонусы при создании</p>
                  <div class="class-chips">
                    ${(cls.bonuses || []).map((b) => `<span class="class-chip">${esc(b)}</span>`).join("") || `<span class="hint">—</span>`}
                  </div>
                </div>
                <div class="class-card">
                  <p class="block-label">Навыки класса</p>
                  <div class="class-chips">
                    ${String(cls.skills || "").split(",").map((s) => s.trim()).filter(Boolean).map((s) => `<span class="class-chip class-chip--skill">${esc(s)}</span>`).join("") || `<span class="hint">—</span>`}
                  </div>
                </div>
                <div class="class-card">
                  <p class="block-label">Доп. навыки</p>
                  <div class="class-chips">
                    ${cls.skillPick
                      ? String(cls.skillPick)
                          .split(/\s*ИЛИ\s*/i)
                          .map((part) => part.trim())
                          .filter(Boolean)
                          .map((part) => `<span class="class-chip class-chip--skill">${esc(part)}</span>`)
                          .join(`<span class="class-chip-or">ИЛИ</span>`)
                      : `<span class="hint">—</span>`}
                  </div>
                </div>
                <div class="class-card">
                  <p class="block-label">Макс. ран</p>
                  <div class="class-chips">
                    <span class="class-chip class-chip--skill">${cls.wounds}</span>
                  </div>
                </div>
              </div>
              <div class="class-trauma">
                <p class="block-label">Травматическая реакция</p>
                <p class="class-trauma-text">${esc(cls.trauma)}</p>
              </div>
            </section>

            <section class="mosh-section atk-section">
              <p class="sec-title">Оружие и атаки</p>
              ${attacksListHtml(sheet)}
              <button type="button" class="btn small" data-atk-add style="margin-top:10px">+ атака</button>
            </section>
          </div>

          <div class="mosh">
            <section class="mosh-section">
              <p class="sec-title">7. Навыки</p>
              ${skillCols(sheet)}
            </section>

            <section class="mosh-section">
              <p class="sec-title">8. Снаряжение</p>
              <table class="gear-table">
                <thead><tr><th>Предмет</th><th>Кол.</th><th></th><th></th></tr></thead>
                <tbody>
                  ${(sheet.gear || []).map((g) => `
                    <tr>
                      <td class="${g.equipped ? "equipped" : ""}">${esc(g.name)}${g.note ? ` <span class="hint">· ${esc(g.note)}</span>` : ""}</td>
                      <td>${g.qty}</td>
                      <td>
                        <button type="button" class="btn small" data-gear-use="${g.id}">−1</button>
                        <button type="button" class="btn small" data-gear-eq="${g.id}">${g.equipped ? "снято" : "экип."}</button>
                      </td>
                      <td><button type="button" class="btn small danger" data-gear-del="${g.id}">×</button></td>
                    </tr>`).join("") || `<tr><td colspan="4" class="hint">Пусто</td></tr>`}
                </tbody>
              </table>
              <button type="button" class="btn small" data-gear-add style="margin-top:8px">+ предмет</button>
            </section>

            <section class="mosh-section">
              <p class="sec-title">Состояния и раны</p>
              <p class="block-label">Состояния</p>
              <div class="row-btns">
                ${CONDITION_PRESETS.map((c) => `<button type="button" class="chip-btn" data-cond-preset="${esc(c)}">${esc(c)}</button>`).join("")}
                <button type="button" class="btn small" data-cond-custom>+ своё</button>
              </div>
              <div class="tag-list">
                ${(sheet.conditions || []).map((c, i) => `
                  <span class="tag">${esc(c)} <button type="button" data-cond-del="${i}">×</button></span>`).join("") || `<span class="hint">нет состояний</span>`}
              </div>
              <p class="block-label" style="margin-top:12px">Эффекты ран</p>
              <div class="tag-list">
                ${(sheet.crits || []).map((c, i) => `
                  <span class="tag">${esc(c)} <button type="button" data-crit-del="${i}">×</button></span>`).join("") || `<span class="hint">нет</span>`}
              </div>
              <button type="button" class="btn small" data-crit-add style="margin-top:8px">+ эффект раны</button>
            </section>

            <section class="mosh-section">
              <p class="sec-title">Заметки</p>
              ${richField("notes", sheet.notes || "", { size: "short", placeholder: "Заметки…" })}
            </section>
          </div>
        </div>
      </div>
    `;
  }

  function statCell(key, label, value) {
    return `
      <button type="button" class="stat-cell" data-stat="${key}">
        <span class="lbl"><span class="lbl-text">${label}</span>${statTipIcon(key)}</span>
        <input class="val" data-f="${key}" value="${value}" onclick="event.stopPropagation()">
        <span class="stat-max" title="Броски 90–99 всегда провал">макс. ${STAT_USEFUL_MAX}</span>
        <span class="roll-hint roll-hint--check">бросок</span>
      </button>`;
  }

  function saveCell(key, label, value) {
    return `
      <button type="button" class="save-cell" data-save="${key}">
        <span class="lbl"><span class="lbl-text">${label}</span>${statTipIcon(key)}</span>
        <input class="val" data-f="${key}" value="${value}" onclick="event.stopPropagation()">
        <span class="stat-max" title="Броски 90–99 всегда провал">макс. ${STAT_USEFUL_MAX}</span>
        <span class="roll-hint roll-hint--save">испытание</span>
      </button>`;
  }

  function statLabel(key) {
    return ({
      str: "Сила", spd: "Скорость", int: "Интеллект", cmb: "Бой",
      san: "Рассудок", fear: "Страх", body: "Тело",
      combat: "Бой", speed: "Скорость", instinct: "Инстинкт",
    })[key] || key;
  }

  function renderMonster(sheet) {
    migrateMonsterVitals(sheet);
    el("#main").innerHTML = `
      <div class="sheet sheet-wide">
        <div class="sheet-cols">
          <div class="mosh">
            <section class="mosh-section">
              <p class="sec-title">Монстр</p>
              ${avatarEditorHtml(sheet)}
              <div class="field"><label>Имя</label><input data-f="name" value="${esc(sheet.name)}"></div>
              <div class="stats-row" style="margin-top:10px">
                ${monStat("combat", "Бой", sheet.combat)}
                ${monStat("speed", "Скорость", sheet.speed)}
                ${monStat("instinct", "Инстинкт", sheet.instinct)}
              </div>
            </section>
            <section class="mosh-section">
              <p class="sec-title">Здоровье, раны, броня</p>
              <div class="vitals vitals--mon">
                <div class="vital-card vital-card--health ${healthCrackClass(sheet.health, sheet.healthMax)}">
                  <span class="health-crack-layer" aria-hidden="true"></span>
                  <p class="block-label">Здоровье</p>
                  <div class="vital-pair">
                    <input class="vital-num" type="number" data-f="health" value="${sheet.health}" title="текущее здоровье" aria-label="Здоровье сейчас">
                    <span class="vital-sep">/</span>
                    <input class="vital-num vital-num--sec" type="number" data-f="healthMax" value="${sheet.healthMax}" title="максимум на рану" aria-label="Здоровье макс">
                  </div>
                </div>
                <div class="vital-card vital-card--wounds ${woundPulseClass(sheet.wounds, sheet.woundsMax)}">
                  <p class="block-label">Раны</p>
                  <div class="vital-pair">
                    <input class="vital-num" type="number" data-f="wounds" value="${sheet.wounds}" title="текущие раны" aria-label="Раны сейчас">
                    <span class="vital-sep">/</span>
                    <input class="vital-num vital-num--sec" type="number" data-f="woundsMax" value="${sheet.woundsMax}" title="максимум ран" aria-label="Раны макс">
                  </div>
                </div>
                <div class="vital-card vital-card--armor ${armorShatterClass(sheet.armor)}">
                  <p class="block-label">Броня <span class="vital-meta">ПБ</span></p>
                  <div class="vital-pair vital-pair--solo">
                    <span class="armor-num-wrap">
                      <input class="vital-num" type="number" data-f="armor" value="${sheet.armor}" title="рейтинг брони (ПБ)" aria-label="Броня">
                    </span>
                  </div>
                </div>
              </div>
            </section>
            <section class="mosh-section atk-section">
              <p class="sec-title">Атаки</p>
              ${attacksListHtml(sheet, { showCheckLabel: true })}
              <button type="button" class="btn small" data-atk-add style="margin-top:10px">+ атака</button>
            </section>
          </div>
          <div class="mosh">
            <section class="mosh-section">
              <p class="sec-title">Особые правила</p>
              ${richField("special", sheet.special || "", { size: "tall", placeholder: "Заражение, способности, особые проверки…" })}
            </section>
            <section class="mosh-section">
              <p class="sec-title">Заметки</p>
              ${richField("notes", sheet.notes || "", { placeholder: "Заметки Смотрителя…" })}
            </section>
          </div>
        </div>
      </div>
    `;
  }

  function monStat(key, label, value) {
    return `
      <button type="button" class="stat-cell" data-mon-stat="${key}">
        <span class="lbl"><span class="lbl-text">${label}</span>${statTipIcon(key)}</span>
        <input class="val" data-f="${key}" value="${value}" onclick="event.stopPropagation()">
        <span class="stat-max" title="Броски 90–99 всегда провал">макс. ${STAT_USEFUL_MAX}</span>
        <span class="roll-hint roll-hint--check">бросок</span>
      </button>`;
  }

  function render() {
    renderTop();
    renderLog();
    els("#mode-seg button").forEach((b) => {
      b.classList.toggle("is-on", b.dataset.mode === state.rollMode);
    });
    if (state.view === "turn") {
      renderTurnRef();
    } else if (state.view === "panic") {
      renderPanicRef();
    } else if (state.view === "wounds") {
      renderWoundsRef();
    } else if (state.view === "crit") {
      renderCritRef();
    } else if (state.view === "sheet" && state.openId) {
      const sheet = getSheet(state.openId);
      if (!sheet) {
        state.view = "list";
        state.openId = null;
        save();
        renderList();
        return;
      }
      if (sheet.type === "character") renderCharacter(sheet);
      else renderMonster(sheet);
    } else {
      renderList();
    }
    bindSkillTips(el("#main") || document);
    bindAvatarPan(el("#main") || document);
  }

  function openModal(html) {
    const root = el("#modal-root");
    root.innerHTML = `<div class="modal-back"><div class="modal">${html}</div></div>`;
  }

  function closeModal() {
    el("#modal-root").innerHTML = "";
  }

  function patchSheet(mutator) {
    const sheet = getSheet(state.openId);
    if (!sheet) return;
    mutator(sheet);
    save();
    render();
  }

  function charStatTarget(sheet, key) {
    return Number(sheet[key]) || 0;
  }

  // ——— Events ———
  function bind() {
    el("#mode-seg").addEventListener("click", (e) => {
      const b = e.target.closest("[data-mode]");
      if (!b) return;
      state.rollMode = b.dataset.mode;
      save();
      render();
    });

    function poolTotal() {
      return POOL_ORDER.reduce((s, k) => s + (dicePool[k] || 0), 0);
    }

    function clearDicePool() {
      POOL_ORDER.forEach((k) => { dicePool[k] = 0; });
    }

    function renderDicePool() {
      const parts = POOL_ORDER.filter((k) => dicePool[k]).map((k) => `${dicePool[k]}×${k}`);
      const sum = el("#pool-summary");
      if (sum) sum.textContent = parts.length ? parts.join(" + ") : "набор пуст";
      els("#pool-btns [data-pool]").forEach((b) => {
        const key = b.dataset.pool;
        const n = dicePool[key] || 0;
        b.textContent = n ? `${key} ×${n}` : key;
        b.classList.toggle("is-on", n > 0);
      });
      const rollBtn = el("#pool-roll");
      if (rollBtn) rollBtn.disabled = poolTotal() === 0;
    }

    function addToPool(kind, n = 1) {
      if (!Object.prototype.hasOwnProperty.call(dicePool, kind)) return;
      dicePool[kind] = clamp((dicePool[kind] || 0) + n, 0, POOL_MAX);
      renderDicePool();
    }

    function rollDicePool() {
      if (poolTotal() === 0) return;
      const chunks = [];
      let grand = 0;
      let anyCrit = false;
      const label = POOL_ORDER.filter((k) => dicePool[k]).map((k) => `${dicePool[k]}×${k}`).join(" + ");
      for (const kind of POOL_ORDER) {
        const n = dicePool[kind] || 0;
        if (!n) continue;
        if (kind === "d100") {
          for (let i = 0; i < n; i++) {
            const r = rollD100Mode();
            let bit = `d100=${r.value}`;
            if (r.all) bit += ` [${r.all.join(", ")}]`;
            if (r.double) {
              bit += " дубль";
              anyCrit = true;
            }
            chunks.push(bit);
            grand += r.value;
          }
        } else {
          const sides = POOL_SIDES[kind];
          const parsed = parseDice(`${n}d${sides}`);
          chunks.push(`${n}${kind} [${parsed.rolls.join("+")}] = ${parsed.total}`);
          grand += parsed.total;
        }
      }
      pushLog({
        who: "кубы",
        text: `${label}: ${chunks.join(" · ")}${poolTotal() > 1 ? ` · сумма ${grand}` : ""}`,
        kind: anyCrit ? "crit" : "ok",
      });
      clearDicePool();
      renderDicePool();
    }

    el("#dice-rail").addEventListener("click", (e) => {
      if (e.target.closest("#pool-clear")) {
        clearDicePool();
        renderDicePool();
        return;
      }
      if (e.target.closest("#pool-roll")) {
        rollDicePool();
        return;
      }
      const q = e.target.closest("[data-pool]");
      if (q) {
        addToPool(q.dataset.pool, e.shiftKey ? -1 : 1);
        return;
      }
    });

    el("#custom-dice").addEventListener("submit", (e) => {
      e.preventDefault();
      const expr = new FormData(e.target).get("expr");
      const parsed = parseDice(expr);
      if (!parsed) {
        pushLog({ who: "кубы", text: `Не разобрал: ${expr}`, kind: "bad" });
        return;
      }
      pushLog({
        who: "кубы",
        text: `${parsed.expr} → [${parsed.rolls.join("+")}]${parsed.mod ? (parsed.mod > 0 ? `+${parsed.mod}` : parsed.mod) : ""} = ${parsed.total}`,
        kind: "ok",
      });
    });

    renderDicePool();

    el("#top-actions").addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const act = b.dataset.act;
      if (act === "new-char") {
        const c = defaultCharacter();
        state.sheets.unshift(c);
        state.view = "sheet";
        state.openId = c.id;
        save();
        render();
      } else if (act === "new-mon") {
        const m = defaultMonster();
        state.sheets.unshift(m);
        state.view = "sheet";
        state.openId = m.id;
        save();
        render();
      } else if (act === "back") {
        state.view = "list";
        state.openId = null;
        save();
        render();
      } else if (act === "turn-ref") {
        state.view = "turn";
        save();
        render();
      } else if (act === "panic-ref") {
        state.view = "panic";
        save();
        render();
      } else if (act === "wounds-ref") {
        state.view = "wounds";
        save();
        render();
      } else if (act === "crit-ref") {
        state.view = "crit";
        save();
        render();
      } else if (act === "delete") {
        if (!state.openId) return;
        if (!confirm("Удалить этот лист?")) return;
        state.sheets = state.sheets.filter((s) => s.id !== state.openId);
        state.view = "list";
        state.openId = null;
        save();
        render();
      } else if (act === "export") {
        downloadJson(state.sheets, "mothership-companion.json");
      } else if (act === "export-one") {
        const s = getSheet(state.openId);
        if (s) downloadJson(s, `${s.name || "sheet"}.json`);
      } else if (act === "import") {
        el("#import-file").click();
      } else if (act === "webhook") {
        openWebhookModal();
      }
    });

    el("#import-file").addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = "";
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (Array.isArray(data)) {
          state.sheets = data.concat(state.sheets);
        } else if (data && Array.isArray(data.sheets)) {
          state.sheets = data.sheets.concat(state.sheets);
        } else if (data && data.type) {
          data.id = uid();
          state.sheets.unshift(data);
        } else {
          alert("Неизвестный формат JSON");
          return;
        }
        save();
        render();
      } catch (err) {
        alert("Ошибка импорта: " + err.message);
      }
    });

    el("#avatar-file").addEventListener("change", async (e) => {
      const file = e.target.files && e.target.files[0];
      e.target.value = "";
      const sheet = getSheet(state.openId);
      if (!file || !sheet) return;
      try {
        const dataUrl = await readAvatarFile(file);
        const prev = sheet.avatar;
        const prevFocus = sheet.avatarFocus;
        sheet.avatar = dataUrl;
        sheet.avatarFocus = { x: 50, y: 50 };
        try {
          save();
        } catch (quotaErr) {
          sheet.avatar = prev;
          sheet.avatarFocus = prevFocus;
          throw new Error("Не хватает места в хранилище браузера. Выберите меньшую картинку.");
        }
        render();
        openAvatarFrameModal(sheet);
      } catch (err) {
        alert(err.message || "Не удалось загрузить картинку");
      }
    });

    el("#main").addEventListener("click", onMainClick);
    el("#main").addEventListener("change", onMainChange);
    el("#main").addEventListener("input", onMainInput);
    el("#main").addEventListener("mousedown", (e) => {
      const btn = e.target.closest("[data-rich-cmd]");
      if (btn) e.preventDefault(); // не сбрасывать выделение в редакторе
    });
    el("#main").addEventListener("blur", (e) => {
      if (e.target && e.target.matches && e.target.matches("[data-rich]")) persistRichEditor(e.target);
    }, true);

    el("#modal-root").addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-back")) closeModal();
      const cancel = e.target.closest("[data-modal-cancel]");
      if (cancel) closeModal();
    });
  }

  function downloadJson(data, name) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function onMainClick(e) {
    const filterBtn = e.target.closest("[data-filter]");
    if (filterBtn) {
      state.filter = filterBtn.dataset.filter;
      save();
      render();
      return;
    }

    const open = e.target.closest("[data-open]");
    if (open) {
      state.view = "sheet";
      state.openId = open.dataset.open;
      save();
      render();
      return;
    }

    if (e.target.closest("[data-avatar-pick]")) {
      e.preventDefault();
      e.stopPropagation();
      const input = el("#avatar-file");
      if (input) input.click();
      return;
    }
    if (e.target.closest("[data-avatar-frame]")) {
      e.preventDefault();
      e.stopPropagation();
      const sheetFrame = getSheet(state.openId);
      if (sheetFrame) openAvatarFrameModal(sheetFrame);
      return;
    }
    if (e.target.closest("[data-avatar-clear]")) {
      e.preventDefault();
      e.stopPropagation();
      const sheetAv = getSheet(state.openId);
      if (!sheetAv) return;
      delete sheetAv.avatar;
      delete sheetAv.avatarFocus;
      save();
      render();
      return;
    }

    if (e.target.closest("[data-panic-roll]")) {
      const input = el("#panic-stress");
      const stress = input ? Math.max(0, Number(input.value) || 0) : defaultPanicStress();
      state.panicStress = stress;
      resolvePanicResult(rollPanicDice(stress), { who: "паника" });
      if (state.view === "panic") render();
      return;
    }

    if (e.target.closest("[data-panic-clear]")) {
      state.panicHit = null;
      if (state.view === "panic") render();
      return;
    }

    const panicDemo = e.target.closest("[data-panic-demo]");
    if (panicDemo) {
      logPanicTableDemo(Number(panicDemo.dataset.panicDemo), { who: "паника · вручную" });
      if (state.view === "panic") render();
      return;
    }

    const woundTypeBtn = e.target.closest("[data-wound-type]");
    if (woundTypeBtn) {
      state.woundType = woundTypeBtn.dataset.woundType;
      save();
      render();
      return;
    }

    if (e.target.closest("[data-wound-roll]")) {
      const type = state.woundType || "blunt";
      const typeName = (WOUND_TYPES.find((t) => t.id === type) || WOUND_TYPES[0]).name;
      const face = rollDie(10) % 10; // 1–10 → 1..9, 0
      const row = WOUNDS_TABLE.find((r) => r.roll === face);
      pushLog({
        who: "раны",
        icon: "🩸",
        badge: "РАНА",
        text: `d10=${String(face).padStart(2, "0")} · ${typeName} · ${row.severity}: ${row[type]}`,
        kind: "damage",
        emphasize: String(face).padStart(2, "0"),
      });
      return;
    }

    const woundDemo = e.target.closest("[data-wound-demo]");
    if (woundDemo) {
      const face = Number(woundDemo.dataset.woundDemo);
      const col = woundDemo.dataset.woundCol || state.woundType || "blunt";
      const typeName = (WOUND_TYPES.find((t) => t.id === col) || WOUND_TYPES[0]).name;
      const row = WOUNDS_TABLE.find((r) => r.roll === face);
      if (row) {
        pushLog({
          who: "раны",
          icon: "🩸",
          badge: "РАНА",
          text: `d10=${String(face).padStart(2, "0")} · ${typeName} · ${row.severity}: ${row[col]}`,
          kind: "damage",
          emphasize: String(face).padStart(2, "0"),
        });
      }
      return;
    }

    if (e.target.closest("[data-crit-roll]")) {
      const part = rollDie(10) % 10;
      const sev = rollDie(10) % 10;
      logCritResult(part, sev);
      if (state.view === "crit") render();
      return;
    }

    if (e.target.closest("[data-crit-clear]")) {
      state.critHit = null;
      if (state.view === "crit") render();
      return;
    }

    const critCellBtn = e.target.closest("[data-crit-part][data-crit-sev]");
    if (critCellBtn) {
      const part = Number(critCellBtn.dataset.critPart);
      const sev = Number(critCellBtn.dataset.critSev);
      logCritResult(part, sev, { who: "крит · вручную" });
      if (state.view === "crit") render();
      return;
    }

    const diceChip = e.target.closest(".dice-chip[data-dice]");
    if (diceChip) {
      e.preventDefault();
      e.stopPropagation();
      const sheet = getSheet(state.openId);
      rollNoteDice(diceChip.dataset.dice, sheet ? sheet.name : "стол");
      return;
    }

    const richCmd = e.target.closest("[data-rich-cmd]");
    if (richCmd) {
      e.preventDefault();
      const wrap = richCmd.closest(".rich-wrap");
      const editor = wrap && wrap.querySelector("[data-rich]");
      if (!editor) return;
      editor.focus();
      const cmd = richCmd.dataset.richCmd;
      if (cmd === "dice") {
        wrapSelectionAsDice(editor);
      } else {
        document.execCommand(cmd, false, null);
      }
      persistRichEditor(editor);
      return;
    }

    const sheet = getSheet(state.openId);
    if (!sheet) return;

    if (e.target.closest(".skill-tip, [data-skill-tip]")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const stat = e.target.closest("[data-stat]");
    if (stat && sheet.type === "character") {
      if (e.target.matches("input")) return;
      const key = stat.dataset.stat;
      underCheck(statLabel(key), charStatTarget(sheet, key), sheet.name);
      return;
    }

    const saveBtn = e.target.closest("[data-save]");
    if (saveBtn && sheet.type === "character") {
      if (e.target.matches("input")) return;
      const key = saveBtn.dataset.save;
      underCheck(statLabel(key), charStatTarget(sheet, key), sheet.name);
      return;
    }

    const monStatBtn = e.target.closest("[data-mon-stat]");
    if (monStatBtn && sheet.type === "monster") {
      if (e.target.matches("input")) return;
      const key = monStatBtn.dataset.monStat;
      underCheck(statLabel(key), Number(sheet[key]) || 0, sheet.name);
      return;
    }

    if (e.target.closest("[data-panic]") && sheet.type === "character") {
      doPanic(sheet);
      return;
    }
    if (e.target.closest("[data-stress-add]") && sheet.type === "character") {
      adjustStress(sheet, 1);
      return;
    }
    if (e.target.closest("[data-stress-sub]") && sheet.type === "character") {
      adjustStress(sheet, -1);
      return;
    }
    if (e.target.closest("[data-rest-d5]") && sheet.type === "character") {
      const v = rollDie(5);
      adjustStress(sheet, -v, `Снят стресс 1d5 → ${v}`);
      return;
    }
    if (e.target.closest("[data-rest-2d10]") && sheet.type === "character") {
      const a = rollDie(10);
      const b = rollDie(10);
      pushLog({ who: sheet.name, text: `2d10 → ${a}+${b}=${a + b}`, kind: "ok" });
      return;
    }

    const hp = e.target.closest("[data-hp]");
    if (hp && sheet.type === "character") {
      sheet.health = clamp((sheet.health || 0) + Number(hp.dataset.hp), 0, 999);
      save();
      render();
      return;
    }
    const cred = e.target.closest("[data-cred]");
    if (cred && sheet.type === "character") {
      sheet.credits = Math.max(0, (sheet.credits || 0) + Number(cred.dataset.cred));
      save();
      render();
      return;
    }
    const pip = e.target.closest("[data-wound-pip]");
    if (pip && sheet.type === "character") {
      const n = Number(pip.dataset.woundPip);
      // Повторный клик по текущему максимуму снимает эту рану (1 → 0).
      sheet.wounds = Number(sheet.wounds) === n ? n - 1 : n;
      save();
      render();
      return;
    }

    if (e.target.closest("[data-check]") && sheet.type === "character") {
      openCheckModal(sheet);
      return;
    }

    const classPick = e.target.closest("[data-class-pick]");
    if (classPick && sheet.type === "character") {
      const id = classPick.dataset.classPick;
      if (id && id !== sheet.classId) {
        sheet.classId = id;
        const next = classById(id);
        sheet.trauma = next.trauma;
        sheet.woundsMax = next.wounds;
        sheet.wounds = Math.min(Number(sheet.wounds) || 0, sheet.woundsMax);
        save();
        render();
      }
      return;
    }

    if (e.target.closest(".skill-tip, [data-skill-tip]")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const ddToggle = e.target.closest("[data-atk-dd-toggle]");
    if (ddToggle) {
      e.preventDefault();
      e.stopPropagation();
      const id = ddToggle.dataset.atkDdToggle;
      const dd = e.target.closest(".atk-dd") || el(`.atk-dd[data-atk-dd="${id}"]`);
      if (!dd) return;
      const menu = dd.querySelector(".atk-dd-menu");
      const willOpen = !!(menu && menu.hidden);
      closeAllRangeDropdowns(willOpen ? id : null);
      if (menu) {
        menu.hidden = !willOpen;
        dd.classList.toggle("is-open", willOpen);
        ddToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
        if (willOpen) bindSkillTips(dd);
      }
      return;
    }

    const atkCurrent = e.target.closest("[data-atk-current]");
    if (atkCurrent && atkCurrent.dataset.range) {
      e.preventDefault();
      e.stopPropagation();
      const atk = (sheet.attacks || []).find((a) => a.id === atkCurrent.dataset.atkCurrent);
      if (atk) {
        atk.currentRange = atkCurrent.dataset.range;
        normalizeAttack(atk);
        save();
        render();
      }
      return;
    }

    if (!e.target.closest(".atk-dd")) closeAllRangeDropdowns();

    const skillRoll = e.target.closest("[data-skill-roll]");
    if (skillRoll && sheet.type === "character") {
      rollSkillCheck(sheet, skillRoll.dataset.skillRoll);
      return;
    }
    const skillStat = e.target.closest("[data-skill-stat]");
    if (skillStat && sheet.type === "character") {
      openSkillStatPicker(sheet, skillStat.dataset.skillStat);
      return;
    }
    const skillDel = e.target.closest("[data-skill-del]");
    if (skillDel) {
      sheet.skills = (sheet.skills || []).filter((s) => s.id !== skillDel.dataset.skillDel);
      save();
      render();
      return;
    }
    const skillAdd = e.target.closest("[data-skill-add]");
    if (skillAdd) {
      openSkillModal(sheet, Number(skillAdd.dataset.skillAdd));
      return;
    }

    if (e.target.closest("[data-gear-add]")) {
      openGearModal(sheet);
      return;
    }
    const gearUse = e.target.closest("[data-gear-use]");
    if (gearUse) {
      const g = (sheet.gear || []).find((x) => x.id === gearUse.dataset.gearUse);
      if (g) {
        g.qty = Math.max(0, (g.qty || 0) - 1);
        pushLog({ who: sheet.name, text: `Расход: ${g.name} → ${g.qty}`, kind: "" });
        save();
        render();
      }
      return;
    }
    const gearEq = e.target.closest("[data-gear-eq]");
    if (gearEq) {
      const g = (sheet.gear || []).find((x) => x.id === gearEq.dataset.gearEq);
      if (g) {
        g.equipped = !g.equipped;
        save();
        render();
      }
      return;
    }
    const gearDel = e.target.closest("[data-gear-del]");
    if (gearDel) {
      sheet.gear = (sheet.gear || []).filter((x) => x.id !== gearDel.dataset.gearDel);
      save();
      render();
      return;
    }

    if (e.target.closest("[data-atk-add]")) {
      openAttackModal(sheet);
      return;
    }
    const atkEdit = e.target.closest("[data-atk-edit]");
    if (atkEdit) {
      openAttackModal(sheet, atkEdit.dataset.atkEdit);
      return;
    }
    const atkDel = e.target.closest("[data-atk-del]");
    if (atkDel) {
      sheet.attacks = (sheet.attacks || []).filter((x) => x.id !== atkDel.dataset.atkDel);
      save();
      render();
      return;
    }
    const atkReload = e.target.closest("[data-atk-reload]");
    if (atkReload) {
      reloadAttack(sheet, atkReload.dataset.atkReload);
      return;
    }
    const atk = e.target.closest("[data-atk]");
    if (atk) {
      doAttack(sheet, atk.dataset.atk);
      return;
    }

    const condPreset = e.target.closest("[data-cond-preset]");
    if (condPreset && sheet.type === "character") {
      sheet.conditions = sheet.conditions || [];
      sheet.conditions.push(condPreset.dataset.condPreset);
      save();
      render();
      return;
    }
    if (e.target.closest("[data-cond-custom]") && sheet.type === "character") {
      const name = prompt("Состояние:");
      if (name) {
        sheet.conditions = sheet.conditions || [];
        sheet.conditions.push(name);
        save();
        render();
      }
      return;
    }
    const condDel = e.target.closest("[data-cond-del]");
    if (condDel && sheet.type === "character") {
      sheet.conditions.splice(Number(condDel.dataset.condDel), 1);
      save();
      render();
      return;
    }
    if (e.target.closest("[data-crit-add]") && sheet.type === "character") {
      const name = prompt("Эффект раны / травма:");
      if (name) {
        sheet.crits = sheet.crits || [];
        sheet.crits.push(name);
        save();
        render();
      }
      return;
    }
    const critDel = e.target.closest("[data-crit-del]");
    if (critDel && sheet.type === "character") {
      sheet.crits.splice(Number(critDel.dataset.critDel), 1);
      save();
      render();
      return;
    }
  }

  function adjustStress(sheet, delta, label) {
    const min = Number(sheet.stressMin);
    const floor = Number.isFinite(min) ? min : 2;
    const cur = Number(sheet.stress);
    const base = Number.isFinite(cur) ? cur : floor;
    sheet.stress = Math.max(floor, base + (Number(delta) || 0));
    save();
    render();
    const sign = delta > 0 ? `+${delta}` : `${delta}`;
    pushLog({
      who: sheet.name,
      text: label ? `${label}. Стресс сейчас ${sheet.stress}` : `Стресс ${sign} → ${sheet.stress}`,
      kind: delta > 0 ? "bad" : "ok",
    });
  }

  function onMainChange(e) {
    const sheet = getSheet(state.openId);
    if (!sheet) return;
    const f = e.target.dataset.f;
    if (!f) return;
    let val = e.target.value;
    if (e.target.type === "number") val = Number(val);
    if (["stress", "stressMin", "health", "healthMax", "wounds", "woundsMax", "armor", "credits",
      "str", "spd", "int", "cmb", "san", "fear", "body", "hits", "hitHp", "combat", "speed", "instinct"].includes(f)) {
      val = Number(val);
      if (!Number.isFinite(val)) val = 0;
    }
    if (f === "stress" && sheet.type === "character") {
      const min = Number(sheet.stressMin);
      const floor = Number.isFinite(min) ? min : 2;
      sheet.stress = Math.max(floor, val);
      save();
      render();
      return;
    }
    if (f === "stressMin" && sheet.type === "character") {
      sheet.stressMin = Math.max(0, val);
      sheet.stress = Math.max(sheet.stressMin, Number(sheet.stress) || 0);
      save();
      render();
      return;
    }
    if (f === "wounds" || f === "woundsMax") {
      if (f === "woundsMax") {
        sheet.woundsMax = Math.max(1, val);
        sheet.wounds = Math.min(Number(sheet.wounds) || 0, sheet.woundsMax);
      } else {
        const max = Math.max(1, Number(sheet.woundsMax) || 1);
        sheet.wounds = clamp(val, 0, max);
      }
      save();
      render();
      return;
    }
    if (f === "health" || f === "healthMax") {
      sheet[f] = Math.max(0, val);
      if (f === "healthMax") {
        sheet.health = Math.min(Number(sheet.health) || 0, sheet.healthMax);
      }
      save();
      render();
      return;
    }
    if (f === "armor") {
      sheet.armor = Math.max(0, val);
      save();
      render();
      return;
    }
    sheet[f] = val;
    save();
    if (["str", "spd", "int", "cmb", "san", "fear", "body"].includes(f)) {
      refreshSkillTargets(sheet);
    }
  }

  function onMainInput(e) {
    const sheet = getSheet(state.openId);
    if (!sheet) return;
    if (e.target.matches && e.target.matches("[data-rich]")) {
      persistRichEditor(e.target);
      return;
    }
    const f = e.target.dataset.f;
    if (!f) return;
    if (["name", "surname", "classNote"].includes(f)) {
      sheet[f] = e.target.value;
      save();
      return;
    }
    if (f === "age") {
      const raw = e.target.value;
      if (raw === "") {
        sheet.age = "";
      } else {
        const n = Number(raw);
        sheet.age = Number.isFinite(n) ? Math.max(0, n) : "";
      }
      save();
      return;
    }
    if (["str", "spd", "int", "cmb", "san", "fear", "body"].includes(f)) {
      const n = Number(e.target.value);
      sheet[f] = Number.isFinite(n) ? n : 0;
      save();
      refreshSkillTargets(sheet);
    }
  }

  function applyPanicSideEffects(sheet, roll) {
    const min = Number(sheet.stressMin);
    const floor = Number.isFinite(min) ? min : 2;
    let note = "";
    if (roll === 2 || roll === 3) {
      sheet.stress = Math.max(floor, (Number(sheet.stress) || 0) + 1);
      note = `стресс → ${sheet.stress}`;
    }
    if (roll === 4 || roll === 18 || roll === 19) {
      sheet.stressMin = floor + 1;
      sheet.stress = Math.max(sheet.stressMin, Number(sheet.stress) || 0);
      note = [note, `мин. стресса → ${sheet.stressMin}`].filter(Boolean).join(", ");
    }
    if (roll === 14) {
      sheet.stressMin = floor + 2;
      sheet.stress = Math.max(sheet.stressMin, Number(sheet.stress) || 0);
      note = `мин. стресса → ${sheet.stressMin}`;
    }
    if (roll === 19) {
      sheet.woundsMax = Math.max(1, (Number(sheet.woundsMax) || 1) - 1);
      note = [note, `макс. ран → ${sheet.woundsMax}`].filter(Boolean).join(", ");
    }
    if (note) {
      save();
      render();
    }
    return note;
  }

  function doPanic(sheet) {
    const roll = rollDie(20);
    const stress = Math.max(0, Number(sheet.stress) || 0);
    // Mothership 1e: d20 > Stress = keep it together; ≤ Stress = Panic (таблицу — отдельно).
    if (roll > stress) {
      pushLog({
        who: sheet.name,
        icon: "✅",
        badge: "УСПЕХ",
        text: `Проверка паники: d20=${roll} > стресс ${stress} — успех`,
        kind: "panic-ok",
        emphasize: String(roll),
      });
    } else {
      pushLog({
        who: sheet.name,
        icon: "❌",
        badge: "ПРОВАЛ",
        text: `Проверка паники: d20=${roll} ≤ стресс ${stress} — провал`,
        kind: "panic-fail",
        emphasize: String(roll),
      });
    }
  }

  function reloadAttack(sheet, atkId) {
    const atk = (sheet.attacks || []).find((a) => a.id === atkId);
    if (!atk) return;
    normalizeAttack(atk);
    if (atk.kind !== "ranged") return;
    const max = Math.max(0, Number(atk.shots) || 0);
    const free = hasGunDiscipline(sheet);
    atk.shotsLeft = max;
    save();
    pushLog({
      who: sheet.name,
      text: free
        ? `«${atk.name}»: перезарядка (свободное действие — Военная подготовка / Огнестрел). Боезапас ${atk.shotsLeft}/${max}.`
        : `«${atk.name}»: перезарядка (значимое действие). Боезапас ${atk.shotsLeft}/${max}.`,
      kind: "ok",
      relay: false,
    });
    render();
  }

  function consumeAttackAmmo(sheet, atk) {
    normalizeAttack(atk);
    if (atk.kind !== "ranged") return { ok: true, note: "" };
    const max = Math.max(0, Number(atk.shots) || 0);
    let left = Number(atk.shotsLeft);
    if (!Number.isFinite(left)) left = max;
    if (left <= 0) {
      return { ok: false, note: `«${atk.name}»: магазин пуст — нужна перезарядка.` };
    }

    // Авто без Военной подготовки: весь магазин уходит за выстрел
    if (atk.automatic && !hasMilitaryTraining(sheet)) {
      atk.shotsLeft = 0;
      return {
        ok: true,
        note: `Авто без Военной подготовки: магазин опустошён. Нужна перезарядка.`,
      };
    }

    const per = atk.automatic ? Math.max(1, Number(atk.ammoPerShot) || 1) : 1;
    if (left < per) {
      return { ok: false, note: `«${atk.name}»: не хватает патронов (нужно ${per}, есть ${left}).` };
    }
    atk.shotsLeft = left - per;
    if (!atk.automatic) {
      return { ok: true, note: `Боезапас ${atk.shotsLeft}/${max || "—"}.` };
    }
    return {
      ok: true,
      note: `−${per} патр. · осталось ${atk.shotsLeft}${max ? `/${max}` : ""}.`,
    };
  }

  function doAttack(sheet, atkId) {
    const atk = (sheet.attacks || []).find((a) => a.id === atkId);
    if (!atk) return;
    normalizeAttack(atk);
    const ammo = consumeAttackAmmo(sheet, atk);
    if (!ammo.ok) {
      pushLog({ who: sheet.name, text: ammo.note, kind: "bad", relay: false });
      save();
      render();
      return;
    }
    let target = 0;
    let skillBonus = { name: "", bonus: 0 };
    if (sheet.type === "character") {
      const map = { str: "str", spd: "spd", int: "int", cmb: "cmb", combat: "cmb", speed: "spd", strength: "str", intellect: "int" };
      const key = map[atk.skill] || atk.skill || "cmb";
      skillBonus = attackSkillBonus(sheet, atk);
      target = (Number(sheet[key]) || 0) + skillBonus.bonus;
    } else {
      target = Number(sheet[atk.skill] || sheet.combat) || 0;
    }
    const skillBit = skillBonus.bonus
      ? ` · ${statLabel(sheet.type === "character" ? (atk.skill || "cmb") : "combat")} ${target - skillBonus.bonus}+${skillBonus.bonus} (${skillBonus.name})`
      : "";
    const hit = underCheck(`Атака «${atk.name}»${skillBit}`, target, sheet.name);
    // Боезапас только в локальный лог — в Discord не слать (иначе выглядит как «успех»).
    if (ammo.note) {
      pushLog({
        who: sheet.name,
        text: `«${atk.name}»: ${ammo.note}`,
        kind: atk.automatic && !hasMilitaryTraining(sheet) ? "bad" : "",
        relay: false,
      });
    }
    if (hit.success && atk.damage) {
      const armor = Number(prompt("Броня цели (0 если нет):", "0")) || 0;
      const woundBit = atk.wound ? ` · ${woundLabel(atk.wound)}` : "";
      rollDamage(atk.damage, sheet.name, `Урон «${atk.name}»${woundBit}`, armor);
    } else if (hit.success && !atk.damage) {
      pushLog({ who: sheet.name, text: `«${atk.name}»: успех без строки урона. ${atk.note || ""}`, kind: "ok" });
    }
    save();
    render();
  }

  function openCheckModal(sheet, skillId) {
    const skills = sheet.skills || [];
    openModal(`
      <h3>Проверка</h3>
      <div class="field"><label>Характеристика</label>
        <select id="chk-stat">
          <option value="str">Сила</option>
          <option value="spd">Скорость</option>
          <option value="int">Интеллект</option>
          <option value="cmb">Бой</option>
          <option value="san">Рассудок</option>
          <option value="fear">Страх</option>
          <option value="body">Тело</option>
        </select>
      </div>
      <div class="field"><label>Навык</label>
        <select id="chk-skill">
          <option value="">— без навыка —</option>
          ${skills.map((s) => `<option value="${s.id}" ${s.id === skillId ? "selected" : ""}>${esc(s.name)} (+${s.bonus})</option>`).join("")}
        </select>
      </div>
      <p class="hint">Режим куба сейчас: ${state.rollMode === "adv" ? "преимущество" : state.rollMode === "dis" ? "помеха" : "обычно"}</p>
      <div class="modal-actions">
        <button type="button" class="btn ghost" data-modal-cancel>Отмена</button>
        <button type="button" class="btn primary" id="chk-go">Бросок</button>
      </div>
    `);
    el("#chk-go").onclick = () => {
      const key = el("#chk-stat").value;
      const sid = el("#chk-skill").value;
      let target = charStatTarget(sheet, key);
      let label = statLabel(key);
      if (sid) {
        const sk = skills.find((s) => s.id === sid);
        if (sk) {
          target += Number(sk.bonus) || 0;
          label += ` + ${sk.name} (+${sk.bonus})`;
        }
      }
      underCheck(label, target, sheet.name);
      closeModal();
    };
  }

  function openSkillModal(sheet, bonus) {
    const defs = SKILL_DEFS.filter((s) => s.bonus === bonus);
    const owned = new Set((sheet.skills || []).map((s) => s.name));
    let selected = "";
    const rows = defs.map((d) => {
      const has = owned.has(d.name);
      const ok = skillPrereqMet(sheet, d);
      const state = has ? "owned" : ok ? "open" : "locked";
      const stateLabel = has ? "есть" : ok ? "доступно" : "нужен навык";
      const req = (d.requires || []).length ? (d.requires || []).join(" или ") : "—";
      return `
        <button type="button" class="skill-pick is-${state}" data-skill-pick="${esc(d.name)}" ${has ? "disabled" : ""}>
          <span class="skill-pick-name">${esc(d.name)} ${skillTipIcon(d.name)}</span>
          <span class="skill-pick-stat">${esc(statLabel(d.stat))}</span>
          <span class="skill-pick-state">${esc(stateLabel)}</span>
          <span class="skill-pick-req">${esc(req)}</span>
        </button>`;
    }).join("");
    openModal(`
      <div class="modal-wide">
        <h3>Добавить навык (+${bonus})</h3>
        <p class="hint">${bonus >= 20
          ? "Мастерский: сначала возьмите экспертный навык из требования."
          : bonus >= 15
            ? "Экспертный: сначала возьмите обученный навык из требования."
            : "Обученный навык берётся свободно."}</p>
        <p id="sk-hint" class="skill-pick-prompt">Выберите навык из списка</p>
        <div class="skill-pick-head">
          <span>Навык</span>
          <span>Характеристика</span>
          <span>Статус</span>
          <span>Требование</span>
        </div>
        <div class="skill-pick-list" id="sk-list">${rows}</div>
        <div class="grid-2">
          <div class="field"><label>Своё имя</label><input id="sk-name" placeholder="если нет в списке"></div>
          <div class="field"><label>Характеристика</label>
            <select id="sk-stat">
              <option value="int">Интеллект</option>
              <option value="cmb">Бой</option>
              <option value="spd">Скорость</option>
              <option value="str">Сила</option>
              <option value="san">Рассудок</option>
              <option value="fear">Страх</option>
              <option value="body">Тело</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn ghost" data-modal-cancel>Отмена</button>
          <button type="button" class="btn primary" id="sk-go">Добавить</button>
        </div>
      </div>
    `);
    const hint = el("#sk-hint");
    const selectSkill = (name) => {
      selected = name;
      els(".skill-pick").forEach((b) => b.classList.toggle("is-on", b.dataset.skillPick === name));
      const def = skillDefByName(name);
      if (def) {
        el("#sk-stat").value = def.stat;
        el("#sk-name").value = "";
        const ok = skillPrereqMet(sheet, def);
        const about = def.blurb ? ` — ${esc(def.blurb)}` : "";
        hint.innerHTML = ok
          ? `Выбрано: <strong>${esc(def.name)}</strong> · проверка: <strong>${esc(statLabel(def.stat))}</strong>${about}`
          : `Выбрано: <strong>${esc(def.name)}</strong> — закрыт, нужно: <strong>${esc((def.requires || []).join(" или "))}</strong>${about}`;
        hint.classList.toggle("is-locked", !ok && (def.requires || []).length > 0);
      }
    };
    bindSkillTips(el(".modal") || document);
    el("#sk-list").onclick = (ev) => {
      if (ev.target.closest(".skill-tip, [data-skill-tip]")) {
        ev.preventDefault();
        ev.stopPropagation();
        return;
      }
      const btn = ev.target.closest("[data-skill-pick]");
      if (!btn || btn.disabled) return;
      selectSkill(btn.dataset.skillPick);
    };
    el("#sk-name").oninput = () => {
      const name = el("#sk-name").value.trim();
      selected = "";
      els(".skill-pick").forEach((b) => b.classList.remove("is-on"));
      if (name) {
        el("#sk-stat").value = skillDefaultStat(name);
        hint.innerHTML = `Свой навык «${esc(name)}» — проверка: <strong>${esc(statLabel(skillDefaultStat(name)))}</strong>`;
        hint.classList.remove("is-locked");
      } else {
        hint.textContent = "Выберите навык из списка";
      }
    };
    el("#sk-go").onclick = () => {
      const name = (el("#sk-name").value || selected || "").trim();
      if (!name) return;
      const def = skillDefByName(name);
      if (def && (def.requires || []).length && !skillPrereqMet(sheet, def)) {
        if (!confirm(`Нет требования (${def.requires.join(" / ")}). Всё равно добавить?`)) return;
      }
      sheet.skills = sheet.skills || [];
      sheet.skills.push({ id: uid(), name, bonus, stat: el("#sk-stat").value || skillDefaultStat(name) });
      save();
      closeModal();
      render();
    };
  }

  function openGearModal(sheet) {
    openModal(`
      <h3>Снаряжение</h3>
      <div class="field"><label>Название</label><input id="g-name" placeholder="Антифиляр-С"></div>
      <div class="grid-2">
        <div class="field"><label>Количество</label><input id="g-qty" type="number" value="1"></div>
        <div class="field"><label>Заметка</label><input id="g-note" placeholder="расходник"></div>
      </div>
      <label class="hint"><input id="g-eq" type="checkbox"> экипировано</label>
      <div class="modal-actions">
        <button type="button" class="btn ghost" data-modal-cancel>Отмена</button>
        <button type="button" class="btn primary" id="g-go">Добавить</button>
      </div>
    `);
    el("#g-go").onclick = () => {
      const name = el("#g-name").value.trim();
      if (!name) return;
      sheet.gear = sheet.gear || [];
      sheet.gear.push({
        id: uid(),
        name,
        qty: Number(el("#g-qty").value) || 1,
        note: el("#g-note").value.trim(),
        equipped: el("#g-eq").checked,
      });
      save();
      closeModal();
      render();
    };
  }

  function openAttackModal(sheet, attackId) {
    const isChar = sheet.type === "character";
    const existing = attackId ? (sheet.attacks || []).find((a) => a.id === attackId) : null;
    if (existing) normalizeAttack(existing);
    const skill = existing ? existing.skill : (isChar ? "cmb" : "combat");
    const kind = existing?.kind || "melee";
    const skillOpts = isChar
      ? [
          ["cmb", "Бой"],
          ["str", "Сила"],
          ["spd", "Скорость"],
          ["int", "Интеллект"],
        ]
      : [
          ["combat", "Бой"],
          ["speed", "Скорость"],
          ["instinct", "Инстинкт"],
        ];
    openModal(`
      <h3>${existing ? "Изменить атаку" : "Новая атака"}</h3>
      <div class="field"><label>Название</label><input id="a-name" placeholder="Обрез / Нож" value="${esc(existing?.name || "")}"></div>
      <div class="field"><label>Тип</label>
        <select id="a-kind">
          <option value="melee" ${kind === "melee" ? "selected" : ""}>Ближний бой</option>
          <option value="ranged" ${kind === "ranged" ? "selected" : ""}>Дальний бой</option>
        </select>
      </div>
      <div class="field"><label>Проверка</label>
        <select id="a-skill">
          ${skillOpts.map(([v, label]) => `<option value="${v}" ${skill === v ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </div>
      <div class="grid-2">
        <div class="field"><label>Бонус навыка</label>
          <p id="a-bonus-view" class="atk-bonus-view">${esc(attackSkillBonusLabel(sheet, { kind }))}</p>
          <p class="hint" style="margin:4px 0 0">Сам: дальний — Огнестрел → Военная подготовка; ближний — Рукопашный бой → Военная подготовка → Атлетика.</p>
        </div>
        <div class="field"><label>Урон</label><input id="a-dmg" placeholder="2d10" value="${esc(existing?.damage || "")}"></div>
      </div>
      <div id="a-eff-wrap" class="field" ${kind === "ranged" ? "" : "hidden"}>
        <label>Эффективные дистанции ${rangesTipIcon(RANGED_EFFECTIVE_RANGES.map((r) => r.id))}</label>
        ${effectiveRangeChecksHtml(existing?.ranges || existing?.range || ["close"])}
      </div>
      <p id="a-melee-range-hint" class="hint" ${kind === "melee" ? "" : "hidden"}>Рукопаш: эффективная дистанция всегда смежная.</p>
      <p class="hint">Эффективные (только дальнее) — ближняя / дальняя / предельная, можно несколько. Смежная — у рукопашного. Текущую дистанцию меняйте в списке атак.</p>
      <div id="a-ranged" class="atk-ranged-fields" ${kind === "ranged" ? "" : "hidden"}>
        <div class="grid-2">
          <div class="field"><label>Выстрелов в магазине</label><input id="a-shots" type="number" min="0" value="${Number(existing?.shots) || 0}" title="Сколько выстрелов до перезарядки"></div>
          <div class="field"><label>Сейчас осталось</label><input id="a-shots-left" type="number" min="0" value="${existing?.shotsLeft != null ? Number(existing.shotsLeft) : (Number(existing?.shots) || 0)}"></div>
        </div>
        <label class="atk-auto-label"><input id="a-auto" type="checkbox" ${existing?.automatic ? "checked" : ""}> Автоматическое</label>
        <div id="a-auto-extra" class="atk-auto-extra" ${existing?.automatic ? "" : "hidden"}>
          <div class="field"><label>Патронов за выстрел</label><input id="a-ammo-per" type="number" min="1" value="${Math.max(1, Number(existing?.ammoPerShot) || 1)}" title="Сколько патронов уходит из магазина за одну атаку (если есть Военная подготовка)"></div>
          <ul class="hint atk-auto-hint">
            <li>Без Военной подготовки в таблице видно только «заряжен / пусто»; выстрел опустошает магазин.</li>
            <li>С Военной подготовкой — видно патроны и расход за выстрел.</li>
          </ul>
        </div>
      </div>
      <div class="field"><label>Тип урона</label>
        <select id="a-wound">
          <option value="">— не задано —</option>
          ${WOUND_TYPES.map((t) => `<option value="${t.id}" ${existing?.wound === t.id ? "selected" : ""}>${esc(t.name)}</option>`).join("")}
        </select>
      </div>
      <div class="field"><label>Заметка</label><input id="a-note" value="${esc(existing?.note || "")}"></div>
      <div class="modal-actions">
        <button type="button" class="btn ghost" data-modal-cancel>Отмена</button>
        <button type="button" class="btn primary" id="a-go">${existing ? "Сохранить" : "Добавить"}</button>
      </div>
    `);
    const syncKind = () => {
      const ranged = el("#a-kind").value === "ranged";
      el("#a-ranged").hidden = !ranged;
      const eff = el("#a-eff-wrap");
      if (eff) eff.hidden = !ranged;
      const meleeHint = el("#a-melee-range-hint");
      if (meleeHint) meleeHint.hidden = ranged;
      const bonusView = el("#a-bonus-view");
      if (bonusView) {
        bonusView.textContent = attackSkillBonusLabel(sheet, { kind: ranged ? "ranged" : "melee" });
      }
    };
    const syncAuto = () => {
      const on = !!el("#a-auto").checked;
      const box = el("#a-auto-extra");
      if (box) box.hidden = !on;
    };
    el("#a-kind").onchange = syncKind;
    el("#a-auto").onchange = syncAuto;
    syncKind();
    syncAuto();
    bindSkillTips(el(".modal") || document);
    el("#a-go").onclick = () => {
      const name = el("#a-name").value.trim();
      if (!name) return;
      sheet.attacks = sheet.attacks || [];
      const nextKind = el("#a-kind").value === "ranged" ? "ranged" : "melee";
      const autoBonus = attackSkillBonus(sheet, { kind: nextKind });
      const payload = {
        name,
        kind: nextKind,
        skill: el("#a-skill").value,
        bonus: autoBonus.bonus,
        skillBonusName: autoBonus.name || "",
        damage: el("#a-dmg").value.trim(),
        note: el("#a-note").value.trim(),
      };
      if (nextKind === "ranged") {
        const pickedRanges = readEffectiveRanges().filter((id) => id !== "cqc");
        if (!pickedRanges.length) {
          alert("Выберите хотя бы одну эффективную дистанцию.");
          return;
        }
        payload.ranges = pickedRanges;
        payload.range = pickedRanges[pickedRanges.length - 1];
      } else {
        payload.ranges = ["cqc"];
        payload.range = "cqc";
      }
      // Текущую дистанцию не трогаем в модалке — она задаётся в списке атак
      if (existing?.currentRange) payload.currentRange = existing.currentRange;
      if (nextKind === "ranged") {
        const shots = Math.max(0, Number(el("#a-shots").value) || 0);
        let left = Number(el("#a-shots-left").value);
        if (!Number.isFinite(left)) left = shots;
        const isAuto = !!el("#a-auto").checked;
        payload.shots = shots;
        payload.shotsLeft = clamp(left, 0, shots || 999);
        payload.automatic = isAuto;
        payload.ammoPerShot = isAuto ? Math.max(1, Number(el("#a-ammo-per").value) || 1) : 1;
      } else {
        payload.shots = 0;
        payload.shotsLeft = 0;
        payload.automatic = false;
        payload.ammoPerShot = 1;
      }
      payload.wound = el("#a-wound").value || "";
      if (existing) {
        Object.assign(existing, payload);
        normalizeAttack(existing);
      } else {
        const created = { id: uid(), ...payload };
        normalizeAttack(created);
        sheet.attacks.push(created);
      }
      save();
      closeModal();
      render();
    };
  }

  bind();
  render();
})();
