const $ = id => document.getElementById(id);
const percent = value => new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 1, maximumFractionDigits: 1
}).format(value);
const roleMarks = ['▲', '✦', '◆', '◎', '✚'];
const bestByPools = new Map();
let scenarioIndex = 0;
let scenario;
let score;
let lineup;
let offersByRole;
let availablePool;
let activeRole;
let showingResult;

function portrait(id) {
  const [, sheet, x, y] = champions[id];
  return `<span class="portrait" aria-hidden="true"><span style="background-image:url('assets/${sheet}');background-position:-${x}px -${y}px"></span></span>`;
}

function slot(id, index, interactive = false) {
  const role = roles[index];
  const name = id ? champions[id][0] : 'Escolher';
  const content = `
    <span class="slot-role"><span aria-hidden="true">${roleMarks[index]}</span> ${role}</span>
    ${id ? portrait(id) : '<span class="empty-portrait" aria-hidden="true">+</span>'}
    <span class="slot-name">${name}</span>`;
  if (!interactive) return `<div class="slot filled">${content}</div>`;
  const active = activeRole === index && !showingResult;
  return `<button type="button" class="slot ${id ? 'filled' : 'unfilled'}" data-role="${index}" aria-pressed="${active}" aria-label="${role}: ${name}">${content}</button>`;
}

function renderDraft() {
  const picked = lineup.filter(Boolean).length;
  $('count').textContent = `${picked} / 5 PICKS`;
  $('player-team').innerHTML = lineup.map((id, index) => slot(id, index, true)).join('');
  $('draft-panel').hidden = showingResult;
  $('results').hidden = !showingResult;
  if (showingResult) return;

  const open = roles.map((_, index) => index).filter(index => !lineup[index]);
  if (open.length) availablePool = draftPool(scenario, open, lineup);
  const options = offersByRole[activeRole] ?? availablePool;
  $('active-role').textContent = roles[activeRole];
  $('pool-note').textContent = lineup[activeRole] ? 'Pool disponível quando preencheste esta posição.'
    : open.length === roles.length ? 'Pool partilhada pelas cinco posições.'
      : `A pool favorece ${new Intl.ListFormat('pt-PT').format(open.map(index => roles[index]))}.`;
  $('reset').disabled = picked === 0;
  $('evaluate').disabled = picked !== roles.length;
  $('options').innerHTML = options.map(id => {
    const labels = Object.keys(tags).filter(key => trait(id, key)).slice(0, 1).map(key => tags[key]);
    const chance = Math.round(100 * roleProbability(id, activeRole, scenario.patch));
    const pickedElsewhere = lineup.includes(id) && lineup[activeRole] !== id;
    return `<button type="button" class="option" data-champion="${id}" aria-pressed="${lineup[activeRole] === id}" ${pickedElsewhere ? 'disabled' : ''}>
      ${portrait(id)}
      <span class="option-name">${champions[id][0]}</span>
      <span class="lane-odds" data-offrole="${chance === 0}">${chance}% ${roles[activeRole]}${chance === 0 ? ' · Fora da role' : ''}</span>
      <span class="option-trait">${labels.join(' · ') || (traits.ap.has(id) ? 'Dano mágico' : 'Dano físico')}</span>
    </button>`;
  }).join('');
}

function startScenario(index) {
  scenarioIndex = index;
  scenario = encounter(index);
  score = scoring(scenario);
  lineup = Array(roles.length).fill(null);
  offersByRole = Array(roles.length).fill(null);
  activeRole = 0;
  showingResult = false;
  $('season').textContent = scenario.season;
  $('patch').textContent = `Patch ${scenario.patch.split('.').slice(0, 2).join('.')}`;
  $('rank').textContent = scenario.rank;
  $('enemy-style').textContent = `${scenario.name} · ${scenario.style}`;
  $('enemy-team').innerHTML = scenario.enemy.map((id, role) => slot(id, role)).join('');
  renderDraft();
}

function showResult() {
  if (lineup.some(id => !id)) return;
  const result = score(lineup);
  const route = JSON.stringify([scenarioIndex, offersByRole]);
  if (!bestByPools.has(route)) bestByPools.set(route, bestDraft(offersByRole, score));
  const best = bestByPools.get(route);
  const gap = (Math.round(best.percent * 10) - Math.round(result.percent * 10)) / 10;
  showingResult = true;
  $('result-summary').textContent = result.percent === best.percent
    ? 'Atingiste o melhor winrate com as pools que te saíram.'
    : gap === 0 ? 'Igualaste o melhor winrate à décima.' : `Ficaste a ${percent(gap)} p.p. do melhor winrate com estas pools.`;
  $('result-metrics').innerHTML = `
    <div><span>O TEU WINRATE SIMULADO</span><strong>${percent(result.percent)}%</strong></div>
    <div><span>MÁXIMO COM ESTAS POOLS</span><strong>${percent(best.percent)}%</strong></div>`;
  $('result-factors').innerHTML = [
    ['Matchups', result.matchup], ['Equilíbrio da equipa', result.balance],
    ['Season e rank', result.fit], ['Adequação às roles', result.lanes]
  ].map(([label, value]) => {
    const rounded = Math.round(value * 10) / 10;
    const impact = rounded > 0 ? 'Favorável' : rounded < 0 ? 'Desfavorável' : 'Neutro';
    return `<div data-impact="${Math.sign(rounded)}"><span>${label}</span><strong>${impact}</strong></div>`;
  }).join('');
  $('best-team').innerHTML = best.team.map((id, index) => slot(id, index)).join('');
  renderDraft();
  $('result-heading').focus();
}

function openRole(index, focus) {
  showingResult = false;
  activeRole = index;
  renderDraft();
  if (focus) document.querySelector(`[data-role="${index}"]`).focus();
}

$('player-team').addEventListener('click', event => {
  const button = event.target.closest('[data-role]');
  if (button) openRole(Number(button.dataset.role), event.detail === 0);
});

$('options').addEventListener('click', event => {
  const option = event.target.closest('[data-champion]');
  if (!option) return;
  const id = option.dataset.champion;
  const role = activeRole;
  if (lineup.includes(id) && lineup[role] !== id) return;
  if (!offersByRole[role]) offersByRole[role] = availablePool;
  lineup[role] = id;
  const nextRole = lineup.findIndex((pick, index) => !pick && index > role);
  const firstEmpty = lineup.indexOf(null);
  activeRole = nextRole >= 0 ? nextRole : firstEmpty >= 0 ? firstEmpty : role;
  renderDraft();
  $('announcement').textContent = `${champions[id][0]} em ${roles[role]}. ${firstEmpty < 0 ? 'Equipa completa.' : `A escolher para ${roles[activeRole]}.`}`;
  if (event.detail === 0) {
    if (firstEmpty < 0) $('evaluate').focus();
    else $('options').querySelector('button:not(:disabled)').focus();
  }
});

$('new-scenario').addEventListener('click', () => {
  startScenario((scenarioIndex + 1) % scenarios.length);
  $('announcement').textContent = `Novo cenário: ${scenario.name}, ${scenario.season}, rank ${scenario.rank}.`;
});
$('reset').addEventListener('click', () => {
  lineup.fill(null);
  offersByRole.fill(null);
  openRole(0, true);
  $('announcement').textContent = 'Picks limpos.';
});
$('evaluate').addEventListener('click', showResult);
$('edit').addEventListener('click', () => openRole(activeRole, true));
$('open-help').addEventListener('click', () => $('help').showModal());
startScenario(0);
