const LETTER_VALUES = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const MASTER_NUMBERS = new Set([11, 22, 33]);

// Signification générale de chaque nombre, réutilisée dans tous les piliers.
const NUMBER_MEANINGS = {
  1: 'Indépendance, leadership, esprit pionnier. Besoin d\'initier et de se démarquer.',
  2: 'Coopération, diplomatie, sensibilité. Besoin d\'harmonie et de relation à l\'autre.',
  3: 'Créativité, expression, joie de vivre. Besoin de communiquer et de partager.',
  4: 'Stabilité, rigueur, sens du concret. Besoin de structure et de sécurité.',
  5: 'Liberté, adaptabilité, curiosité. Besoin de mouvement et de changement.',
  6: 'Responsabilité, harmonie, sens du service. Besoin de prendre soin des autres.',
  7: 'Introspection, analyse, quête de sens. Besoin de comprendre et d\'approfondir.',
  8: 'Ambition, pouvoir, sens matériel. Besoin de réussir et de maîtriser.',
  9: 'Générosité, idéalisme, ouverture au monde. Besoin de donner et de transmettre.',
  11: 'Nombre maître : intuition, inspiration, sensibilité exacerbée. Vocation à éclairer les autres.',
  22: 'Nombre maître : bâtisseur, vision à grande échelle. Vocation à concrétiser de grands projets.',
  33: 'Nombre maître : amour inconditionnel, enseignement, guérison. Vocation à servir l\'humanité.',
};

function meaningOf(number) {
  return NUMBER_MEANINGS[number] || '';
}

function stripAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function onlyLetters(str) {
  return stripAccents(str.toLowerCase())
    .split('')
    .filter((ch) => /[a-z]/.test(ch));
}

// Reduces to a single digit, unless a master number (11, 22, 33) is met along the way.
function reduceKeepMaster(num) {
  while (num > 9 && !MASTER_NUMBERS.has(num)) {
    num = String(num)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return num;
}

// Always reduces down to a single digit (1-9), ignoring master numbers.
function reduceFully(num) {
  while (num > 9) {
    num = String(num)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return num;
}

function sumLetterValues(name) {
  return onlyLetters(name).reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
}

function digitSumOfNumbers(...numbers) {
  return numbers
    .join('')
    .split('')
    .reduce((sum, digit) => sum + Number(digit), 0);
}

function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return { day, month, year };
}

// --- 1er pilier : Chemin de vie ---
function calcLifePath({ day, month, year }) {
  return reduceKeepMaster(digitSumOfNumbers(day, month, year));
}

// --- Prénom (nombre actif) et Nom (nombre héréditaire) ---
function calcActiveNumber(firstName) {
  return reduceKeepMaster(sumLetterValues(firstName));
}

function calcHereditaryNumber(lastName) {
  return reduceKeepMaster(sumLetterValues(lastName));
}

// --- 2ème pilier : Nombre d'expression (1er prénom + nom de famille) ---
function calcExpression(firstName, lastName) {
  return reduceKeepMaster(sumLetterValues(firstName) + sumLetterValues(lastName));
}

// --- 3ème pilier : Grille d'inclusion (nom de famille + tous les prénoms) ---
function calcInclusionGrid(lastName, allFirstNames) {
  const letters = [lastName, ...allFirstNames].flatMap(onlyLetters);
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  letters.forEach((ch) => {
    const value = LETTER_VALUES[ch];
    if (value) counts[value] += 1;
  });
  return counts;
}

// --- Les cycles de vie ---
function calcCycles({ day, month, year }) {
  return {
    formatif: reduceKeepMaster(month),
    productif: reduceKeepMaster(day),
    moisson: reduceKeepMaster(year),
  };
}

// --- Les réalisations ---
function calcRealisations({ day, month, year }, lifePath) {
  const number1 = reduceKeepMaster(day + month);
  const number2 = reduceKeepMaster(day + year);
  const number3 = reduceKeepMaster(number1 + number2);
  const number4 = reduceKeepMaster(month + year);

  const age1 = 36 - lifePath;
  const age2 = age1 + 9;
  const age3 = age2 + 9;

  return [
    { number: number1, range: `0 à ${age1} ans` },
    { number: number2, range: `${age1} à ${age2} ans` },
    { number: number3, range: `${age2} à ${age3} ans` },
    { number: number4, range: `${age3} ans et plus` },
  ];
}

// --- Les défis de vie ---
function calcDefis({ day, month, year }) {
  const reducedDay = reduceFully(day);
  const reducedMonth = reduceFully(month);
  const reducedYear = reduceFully(year);

  const defi1 = Math.abs(reducedDay - reducedMonth);
  const defi2 = Math.abs(reducedDay - reducedYear);
  const defiMajeur = Math.abs(defi1 - defi2);

  return { defi1, defi2, defiMajeur };
}

// --- Année personnelle ---
function calcPersonalYear({ day, month }, targetYear) {
  return reduceFully(digitSumOfNumbers(day, month, targetYear));
}

// --- Nombre de rendez-vous ---
function calcRendezVous(birth, rdvDate) {
  const { day, month, year } = parseDate(rdvDate);
  const personalYear = calcPersonalYear(birth, year);
  return reduceFully(reduceFully(day) + reduceFully(month) + personalYear);
}

const PILLAR_DESCRIPTIONS = {
  lifePath: {
    label: 'Chemin de vie',
    desc: 'La leçon centrale de votre existence et la direction générale de votre parcours (jour + mois + année).',
  },
  expression: {
    label: "Nombre d'expression",
    desc: "L'essence du caractère : cumul du 1er prénom (nombre actif) et du nom de famille (nombre héréditaire).",
  },
  active: {
    label: 'Prénom (nombre actif)',
    desc: 'Vos talents naturels et votre façon spontanée de vous exprimer.',
  },
  hereditary: {
    label: 'Nom (nombre héréditaire)',
    desc: "L'héritage familial et les traits transmis à la naissance.",
  },
};

function renderPillars(values) {
  const grid = document.getElementById('pillars-grid');
  grid.innerHTML = '';

  Object.entries(values).forEach(([key, value]) => {
    const info = PILLAR_DESCRIPTIONS[key];
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <div class="number">${value}</div>
      <div class="label">${info.label}</div>
      <div class="desc">${info.desc}</div>
      <div class="meaning">${meaningOf(value)}</div>
    `;
    grid.appendChild(item);
  });
}

function renderInclusionGrid(counts) {
  const container = document.getElementById('inclusion-grid');
  container.innerHTML = '';
  // Disposition classique de la grille pythagoricienne
  const layout = [3, 6, 9, 2, 5, 8, 1, 4, 7];

  layout.forEach((digit) => {
    const cell = document.createElement('div');
    const count = counts[digit];
    cell.className = 'inclusion-cell' + (count === 0 ? ' empty' : '');
    cell.innerHTML = `
      <div class="digit">${digit}</div>
      <div class="repeat">${count > 0 ? digit.toString().repeat(count) : '—'}</div>
    `;
    container.appendChild(cell);
  });
}

function renderCycles(cycles) {
  const grid = document.getElementById('cycles-grid');
  grid.innerHTML = '';

  const items = [
    { value: cycles.formatif, label: 'Cycle formatif', desc: 'Calculé avec le mois de naissance.' },
    { value: cycles.productif, label: 'Cycle productif', desc: 'Calculé avec le jour de naissance réduit.' },
    { value: cycles.moisson, label: 'Cycle de la moisson', desc: "Calculé avec l'année de naissance réduite." },
  ];

  items.forEach(({ value, label, desc }) => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <div class="number">${value}</div>
      <div class="label">${label}</div>
      <div class="desc">${desc}</div>
      <div class="meaning">${meaningOf(value)}</div>
    `;
    grid.appendChild(item);
  });
}

function renderRealisations(realisations) {
  const grid = document.getElementById('realisations-grid');
  grid.innerHTML = '';

  realisations.forEach(({ number, range }, index) => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <div class="number">${number}</div>
      <div class="label">${index + 1}${index === 0 ? 'ère' : 'ème'} réalisation</div>
      <div class="desc">${range}</div>
      <div class="meaning">${meaningOf(number)}</div>
    `;
    grid.appendChild(item);
  });
}

function renderDefis(defis) {
  const grid = document.getElementById('defis-grid');
  grid.innerHTML = '';

  const items = [
    { value: defis.defi1, label: '1er défi mineur', desc: 'Jour − mois de naissance (valeur absolue).' },
    { value: defis.defi2, label: '2ème défi mineur', desc: "Jour − année de naissance (valeur absolue)." },
    { value: defis.defiMajeur, label: '3ème défi majeur', desc: '1er défi − 2ème défi (valeur absolue).' },
  ];

  items.forEach(({ value, label, desc }) => {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <div class="number">${value}</div>
      <div class="label">${label}</div>
      <div class="desc">${desc}</div>
      ${value > 0 ? `<div class="meaning">${meaningOf(value)}</div>` : ''}
    `;
    grid.appendChild(item);
  });
}

function renderPersonalYear(value, year) {
  const grid = document.getElementById('annee-grid');
  grid.innerHTML = '';

  const item = document.createElement('div');
  item.className = 'result-item';
  item.innerHTML = `
    <div class="number">${value}</div>
    <div class="label">Année personnelle ${year}</div>
    <div class="desc">Jour + mois de naissance + année en cours.</div>
    <div class="meaning">${meaningOf(value)}</div>
  `;
  grid.appendChild(item);
}

let currentBirth = null;

const NAME_PATTERN = /^[a-zàâäéèêëîïôöùûüç' -]+$/i;

function showError(fieldId, message) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  errorEl.textContent = message;
  errorEl.hidden = false;
}

function clearError(fieldId) {
  const errorEl = document.getElementById(`${fieldId}-error`);
  errorEl.hidden = true;
  errorEl.textContent = '';
}

function validateProfileForm(lastName, firstNamesRaw, birthdate) {
  let valid = true;

  clearError('lastname');
  clearError('firstnames');
  clearError('birthdate');

  if (!lastName) {
    showError('lastname', 'Le nom de famille est obligatoire.');
    valid = false;
  } else if (!NAME_PATTERN.test(lastName)) {
    showError('lastname', 'Le nom ne doit contenir que des lettres, espaces, apostrophes ou tirets.');
    valid = false;
  }

  if (!firstNamesRaw) {
    showError('firstnames', 'Au moins un prénom est obligatoire.');
    valid = false;
  } else if (!NAME_PATTERN.test(firstNamesRaw)) {
    showError('firstnames', 'Les prénoms ne doivent contenir que des lettres, espaces, apostrophes ou tirets.');
    valid = false;
  }

  if (!birthdate) {
    showError('birthdate', 'La date de naissance est obligatoire.');
    valid = false;
  } else if (new Date(birthdate) > new Date()) {
    showError('birthdate', 'La date de naissance ne peut pas être dans le futur.');
    valid = false;
  }

  return valid;
}

document.getElementById('numero-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const lastName = document.getElementById('lastname').value.trim();
  const firstNamesRaw = document.getElementById('firstnames').value.trim();
  const birthdate = document.getElementById('birthdate').value;

  if (!validateProfileForm(lastName, firstNamesRaw, birthdate)) return;

  const allFirstNames = firstNamesRaw.split(/\s+/).filter(Boolean);
  const firstName = allFirstNames[0];
  const birth = parseDate(birthdate);
  currentBirth = birth;

  const lifePath = calcLifePath(birth);

  renderPillars({
    lifePath,
    expression: calcExpression(firstName, lastName),
    active: calcActiveNumber(firstName),
    hereditary: calcHereditaryNumber(lastName),
  });

  renderInclusionGrid(calcInclusionGrid(lastName, allFirstNames));
  renderCycles(calcCycles(birth));
  renderRealisations(calcRealisations(birth, lifePath));
  renderDefis(calcDefis(birth));

  const currentYear = new Date().getFullYear();
  renderPersonalYear(calcPersonalYear(birth, currentYear), currentYear);

  document.getElementById('results').hidden = false;
  document.getElementById('rdv-result').hidden = true;
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('rdv-btn').addEventListener('click', () => {
  const rdvDate = document.getElementById('rdv-date').value;

  clearError('rdv-date');

  if (!rdvDate) {
    showError('rdv-date', 'Choisissez une date de rendez-vous.');
    return;
  }
  if (!currentBirth) return;

  const number = calcRendezVous(currentBirth, rdvDate);
  const resultBox = document.getElementById('rdv-result');
  resultBox.hidden = false;
  resultBox.innerHTML = `
    <div class="number">${number}</div>
    <div class="desc">Jour + mois du rendez-vous + année personnelle correspondante.</div>
    <div class="meaning">${meaningOf(number)}</div>
  `;
});

document.getElementById('print-btn').addEventListener('click', () => {
  window.print();
});
