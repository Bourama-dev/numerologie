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

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
const MASTER_NUMBERS = new Set([11, 22, 33]);

function stripAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function reduceNumber(num) {
  while (num > 9 && !MASTER_NUMBERS.has(num)) {
    num = String(num)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return num;
}

function sumLetters(name, filter) {
  const letters = stripAccents(name.toLowerCase()).split('').filter((ch) => /[a-z]/.test(ch));
  const selected = filter ? letters.filter(filter) : letters;
  const total = selected.reduce((sum, ch) => sum + (LETTER_VALUES[ch] || 0), 0);
  return reduceNumber(total);
}

function calcLifePath(dateStr) {
  const digits = dateStr.replace(/-/g, '').split('').map(Number);
  const total = digits.reduce((sum, d) => sum + d, 0);
  return reduceNumber(total);
}

function calcBirthday(dateStr) {
  const day = Number(dateStr.split('-')[2]);
  return reduceNumber(day);
}

function calcExpression(name) {
  return sumLetters(name);
}

function calcSoulUrge(name) {
  return sumLetters(name, (ch) => VOWELS.has(ch));
}

function calcPersonality(name) {
  return sumLetters(name, (ch) => !VOWELS.has(ch));
}

const DESCRIPTIONS = {
  lifePath: {
    label: 'Chemin de vie',
    desc: 'La leçon centrale de votre existence et la direction générale de votre parcours.',
  },
  expression: {
    label: "Nombre d'expression",
    desc: 'Vos talents naturels et la façon dont vous vous exprimez dans le monde.',
  },
  soulUrge: {
    label: "Nombre de l'âme",
    desc: 'Vos motivations profondes, ce que votre cœur désire vraiment.',
  },
  personality: {
    label: 'Nombre de personnalité',
    desc: "L'image que vous projetez et la première impression que vous laissez.",
  },
  birthday: {
    label: 'Nombre du jour de naissance',
    desc: 'Un talent particulier lié au jour exact de votre naissance.',
  },
};

function renderResults(values) {
  const grid = document.getElementById('results-grid');
  grid.innerHTML = '';

  Object.entries(values).forEach(([key, value]) => {
    const info = DESCRIPTIONS[key];
    const item = document.createElement('div');
    item.className = 'result-item';
    item.innerHTML = `
      <div class="number">${value}</div>
      <div class="label">${info.label}</div>
      <div class="desc">${info.desc}</div>
    `;
    grid.appendChild(item);
  });

  document.getElementById('results').hidden = false;
}

document.getElementById('numero-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const fullname = document.getElementById('fullname').value.trim();
  const birthdate = document.getElementById('birthdate').value;

  if (!fullname || !birthdate) return;

  const values = {
    lifePath: calcLifePath(birthdate),
    expression: calcExpression(fullname),
    soulUrge: calcSoulUrge(fullname),
    personality: calcPersonality(fullname),
    birthday: calcBirthday(birthdate),
  };

  renderResults(values);
});
