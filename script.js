// 最小実装のインクリメンタルゲーム本体
const STORAGE_KEY = 'incremental-clicker-save-v1';

const defaultGenerators = [
  { id: 'generator', name: '発電機', baseCost: 10, production: 1, count: 0 },
  { id: 'factory', name: '工場', baseCost: 100, production: 8, count: 0 },
  { id: 'lab', name: '研究所', baseCost: 1000, production: 45, count: 0 },
];

const state = {
  points: 0,
  generators: structuredClone(defaultGenerators),
};

const pointsEl = document.getElementById('points');
const ppsEl = document.getElementById('pps');
const clickButton = document.getElementById('click-button');
const resetButton = document.getElementById('reset-button');
const generatorList = document.getElementById('generator-list');

function formatNumber(num) {
  if (num >= 1e6) {
    return num.toExponential(2);
  }
  if (num >= 1000) {
    return num.toLocaleString('ja-JP', { maximumFractionDigits: 2 });
  }
  return num.toFixed(num >= 10 ? 0 : 2).replace(/\.00$/, '');
}

function getGeneratorCost(generator) {
  return Math.floor(generator.baseCost * Math.pow(1.15, generator.count));
}

function calculatePps() {
  return state.generators.reduce(
    (sum, gen) => sum + gen.production * gen.count,
    0
  );
}

function saveGame() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadGame() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    state.points = Number(parsed.points) || 0;

    const savedMap = new Map((parsed.generators || []).map((g) => [g.id, g]));
    state.generators = defaultGenerators.map((base) => {
      const saved = savedMap.get(base.id) || {};
      return {
        ...base,
        count: Math.max(0, Math.floor(Number(saved.count) || 0)),
      };
    });
  } catch {
    // 破損データ時は初期値のまま開始
  }
}

function createGeneratorButtons() {
  generatorList.innerHTML = '';
  state.generators.forEach((generator) => {
    const button = document.createElement('button');
    button.className = 'generator-button';
    button.dataset.id = generator.id;
    generatorList.appendChild(button);
  });
}

function updateGeneratorButtons() {
  state.generators.forEach((generator) => {
    const button = generatorList.querySelector(`[data-id="${generator.id}"]`);
    const cost = getGeneratorCost(generator);
    if (!button) return;

    button.disabled = state.points < cost;
    button.innerHTML = `
      <div><strong>${generator.name}</strong></div>
      <div>価格: ${formatNumber(cost)}</div>
      <div>生産: +${formatNumber(generator.production)}/sec</div>
      <div>所持: ${generator.count}</div>
    `;
  });
}

function updateUI() {
  pointsEl.textContent = formatNumber(state.points);
  ppsEl.textContent = formatNumber(calculatePps());
  updateGeneratorButtons();
}

function buyGenerator(id) {
  const generator = state.generators.find((g) => g.id === id);
  if (!generator) return;

  const cost = getGeneratorCost(generator);
  if (state.points < cost) return;

  state.points -= cost;
  generator.count += 1;
  saveGame();
  updateUI();
}

clickButton.addEventListener('click', () => {
  state.points += 1;
  saveGame();
  updateUI();
});

generatorList.addEventListener('click', (event) => {
  const button = event.target.closest('.generator-button');
  if (!button) return;
  buyGenerator(button.dataset.id);
});

resetButton.addEventListener('click', () => {
  if (!confirm('セーブデータをリセットしますか？')) return;
  localStorage.removeItem(STORAGE_KEY);
  state.points = 0;
  state.generators = structuredClone(defaultGenerators);
  updateUI();
});

setInterval(() => {
  const pps = calculatePps();
  if (pps <= 0) return;
  state.points += pps;
  saveGame();
  updateUI();
}, 1000);

loadGame();
createGeneratorButtons();
updateUI();
