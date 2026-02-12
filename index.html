'use strict';

// Static deployment best practice:
// - Keep all state serializable for localStorage.
// - Keep constants centralized for balancing updates.
const SAVE_KEY = 'incremental-clicker-v2';
const TICK_MS = 1000;
const COST_SCALE = 1.15;

const BASE_GENERATORS = [
  { id: 'cursor', name: 'Cursor', baseCost: 15, perSecond: 1, count: 0 },
  { id: 'miner', name: 'Miner', baseCost: 120, perSecond: 8, count: 0 },
  { id: 'plant', name: 'Power Plant', baseCost: 900, perSecond: 40, count: 0 },
];

const state = {
  score: 0,
  generators: BASE_GENERATORS.map((g) => ({ ...g })),
};

const els = {
  score: document.getElementById('score'),
  pps: document.getElementById('pps'),
  click: document.getElementById('click-btn'),
  shop: document.getElementById('shop'),
  save: document.getElementById('save-btn'),
  reset: document.getElementById('reset-btn'),
};

function fmt(n) {
  if (n >= 1e6) return n.toExponential(2);
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}

function calcCost(generator) {
  return Math.floor(generator.baseCost * Math.pow(COST_SCALE, generator.count));
}

function calcPps() {
  return state.generators.reduce((sum, g) => sum + g.perSecond * g.count, 0);
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    state.score = Math.max(0, Number(parsed.score) || 0);

    const savedById = new Map((parsed.generators || []).map((g) => [g.id, g]));
    state.generators = BASE_GENERATORS.map((base) => {
      const saved = savedById.get(base.id);
      return {
        ...base,
        count: Math.max(0, Math.floor(Number(saved?.count) || 0)),
      };
    });
  } catch {
    // 壊れたセーブデータは無視して初期化
  }
}

function renderShop() {
  els.shop.innerHTML = '';
  for (const gen of state.generators) {
    const btn = document.createElement('button');
    const cost = calcCost(gen);
    btn.className = 'gen-btn';
    btn.dataset.id = gen.id;
    btn.disabled = state.score < cost;
    btn.innerHTML = `
      <div><strong>${gen.name}</strong></div>
      <div>Cost: ${fmt(cost)}</div>
      <div>Output: +${fmt(gen.perSecond)}/sec</div>
      <small>Owned: ${gen.count}</small>
    `;
    els.shop.appendChild(btn);
  }
}

function render() {
  els.score.textContent = fmt(state.score);
  els.pps.textContent = fmt(calcPps());
  renderShop();

  // Extension point: Visual effects
  // e.g., add floating text/particles when score changes.
}

function buyGenerator(id) {
  const gen = state.generators.find((g) => g.id === id);
  if (!gen) return;

  const cost = calcCost(gen);
  if (state.score < cost) return;

  state.score -= cost;
  gen.count += 1;
  saveGame();
  render();

  // Extension point: Achievement systems
  // e.g., unlock achievements after N purchases of a generator.
}

function resetGame() {
  if (!window.confirm('Reset all progress?')) return;
  localStorage.removeItem(SAVE_KEY);
  state.score = 0;
  state.generators = BASE_GENERATORS.map((g) => ({ ...g }));
  render();
}

function tick() {
  const pps = calcPps();
  if (pps > 0) {
    state.score += pps;
    saveGame();
    render();
  }

  // Extension point: Multipliers / prestige resets
  // e.g., apply global multiplier from prestige level before adding pps.
}

function setupEvents() {
  els.click.addEventListener('click', () => {
    state.score += 1;
    saveGame();
    render();
  });

  els.shop.addEventListener('click', (e) => {
    const btn = e.target.closest('.gen-btn');
    if (!btn) return;
    buyGenerator(btn.dataset.id);
  });

  els.save.addEventListener('click', saveGame);
  els.reset.addEventListener('click', resetGame);
}

loadGame();
setupEvents();
render();
window.setInterval(tick, TICK_MS);
