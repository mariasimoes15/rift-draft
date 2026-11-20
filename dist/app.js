const $ = id => document.getElementById(id);
const roleMarks = ['▲', '✦', '◆', '◎', '✚'];
const bestByPools = new Map();
const translations = {
  pt: {
    locale: 'pt-PT', languageLabel: 'Idioma', choose: 'Escolher', picks: 'PICKS', howToPlay: 'Como jogar',
    tagline: 'Lê o draft rival. Escolhe os teus cinco. Maximiza o winrate.', enemyTeam: 'Equipa adversária', redSide: 'LADO VERMELHO',
    yourTeam: 'A tua equipa', choosePerRole: 'Escolhe um champion por posição.', chooseFor: 'Escolhe para', clearPicks: 'Limpar picks',
    simulatedModel: 'Modelo de composição e winrate simulado', calculate: 'Calcular winrate', draftResult: 'Resultado do draft', reviewPicks: 'Rever picks',
    bestTeam: 'Melhor equipa com os sorteios que tiveste', fanGame: 'Rift Draft · Jogo de fãs', credits: 'Catálogo e retratos', inspired: 'Inspirado no',
    helpOne: 'Vê a equipa adversária, o patch da season e o rank do cenário.',
    helpTwo: 'Seleciona uma posição e escolhe qualquer champion da pool partilhada. O sorteio favorece flex picks e as posições que ainda estão livres.',
    helpThree: 'Completa as cinco posições e compara o teu winrate com a melhor equipa possível usando as pools que te saíram.',
    helpModel: 'Cada champion tem uma adequação escondida às diferentes posições. Podes colocá-lo em qualquer role, mas uma escolha menos habitual reduz a pontuação final.',
    backToDraft: 'Voltar ao draft', nextScenario: 'Próximo cenário', poolSaved: 'Pool disponível quando preencheste esta posição.', poolAll: 'Pool partilhada pelas cinco posições.',
    poolFavors: roles => `A pool favorece ${roles}.`, bestResult: 'Atingiste o melhor winrate com as pools que te saíram.', tiedResult: 'Igualaste o melhor winrate à décima.',
    gapResult: gap => `Ficaste a ${gap} p.p. do melhor winrate com estas pools.`, yourWinrate: 'O TEU WINRATE SIMULADO', maxWinrate: 'MÁXIMO COM ESTAS POOLS',
    factors: ['Matchups', 'Equilíbrio da equipa', 'Season e rank', 'Adequação às roles'], favorable: 'Favorável', unfavorable: 'Desfavorável', neutral: 'Neutro',
    magic: 'Dano mágico', physical: 'Dano físico', traits: {frontline:'Linha da frente',engage:'Iniciação',peel:'Proteção',poke:'Poke',dive:'Dive',scaling:'Scaling',tempo:'Early game',shred:'Anti-tank'},
    ranks: {Emerald:'Esmeralda',Silver:'Prata',Diamond:'Diamante',Gold:'Ouro',Master:'Mestre',Platinum:'Platina'},
    scenario: [['O cerco','Poke e controlo de zona'],['À queima-roupa','Dive coordenado'],['A última luta','Scaling e proteção do ADC'],['Sem espaço','Pressão nas lanes e pickoffs'],['Linha de choque','Linha da frente e teamfight'],['A cinco passos','Poke e proteção'],['Ponto cego','Emboscadas e acesso à backline'],['Sem travões','Pressão cedo e engage']],
    picked: (champion, role, done) => `${champion} em ${role}. ${done ? 'Equipa completa.' : 'Escolhe a próxima posição.'}`,
    newScenario: (name, season, rank) => `Novo cenário: ${name}, ${season}, rank ${rank}.`, cleared: 'Picks limpos.'
  },
  en: {
    locale: 'en-GB', languageLabel: 'Language', choose: 'Choose', picks: 'PICKS', howToPlay: 'How to play',
    tagline: 'Read the enemy draft. Pick your five. Maximise your win rate.', enemyTeam: 'Enemy team', redSide: 'RED SIDE',
    yourTeam: 'Your team', choosePerRole: 'Choose one champion for each role.', chooseFor: 'Choose for', clearPicks: 'Clear picks',
    simulatedModel: 'Team composition model and simulated win rate', calculate: 'Calculate win rate', draftResult: 'Draft result', reviewPicks: 'Review picks',
    bestTeam: 'Best team from the pools you received', fanGame: 'Rift Draft · Fan game', credits: 'Champion catalogue and portraits', inspired: 'Inspired by',
    helpOne: 'Check the enemy team, season patch and rank for the scenario.',
    helpTwo: 'Select a role and choose any champion from the shared pool. The draw favours flex picks and the roles still open.',
    helpThree: 'Fill all five roles and compare your win rate with the strongest team possible from the pools you received.',
    helpModel: 'Every champion has hidden suitability for each role. You can place them anywhere, but an unusual assignment lowers the final score.',
    backToDraft: 'Back to draft', nextScenario: 'Next scenario', poolSaved: 'Pool shown when you filled this role.', poolAll: 'Shared pool for all five roles.',
    poolFavors: roles => `The pool favours ${roles}.`, bestResult: 'You reached the best win rate from your pools.', tiedResult: 'You matched the best win rate to one decimal place.',
    gapResult: gap => `You finished ${gap} pp behind the best win rate from these pools.`, yourWinrate: 'YOUR SIMULATED WIN RATE', maxWinrate: 'MAXIMUM FROM THESE POOLS',
    factors: ['Matchups', 'Team balance', 'Season and rank', 'Role suitability'], favorable: 'Favourable', unfavorable: 'Unfavourable', neutral: 'Neutral',
    magic: 'Magic damage', physical: 'Physical damage', traits: {frontline:'Front line',engage:'Engage',peel:'Peel',poke:'Poke',dive:'Dive',scaling:'Scaling',tempo:'Early game',shred:'Anti-tank'},
    ranks: {Emerald:'Emerald',Silver:'Silver',Diamond:'Diamond',Gold:'Gold',Master:'Master',Platinum:'Platinum'},
    scenario: [['The siege','Poke and zone control'],['Point-blank','Coordinated dive'],['The final fight','Scaling and ADC protection'],['No room','Lane pressure and pickoffs'],['Shock line','Front line and teamfights'],['Five steps away','Poke and protection'],['Blind spot','Ambushes and backline access'],['No brakes','Early pressure and engage']],
    picked: (champion, role, done) => `${champion} in ${role}. ${done ? 'Team complete.' : 'Choose the next role.'}`,
    newScenario: (name, season, rank) => `New scenario: ${name}, ${season}, ${rank}.`, cleared: 'Picks cleared.'
  }
};
const rankKeys = ['Emerald', 'Silver', 'Diamond', 'Gold', 'Master', 'Platinum', 'Silver', 'Platinum'];
let language = (() => { try { return localStorage.getItem('rift-language') === 'en' ? 'en' : 'pt'; } catch { return 'pt'; } })();
let scenarioIndex = 0;
let scenario;
let score;
let lineup;
let offersByRole;
let availablePool;
let activeRole;
let showingResult;
let matchupRound = 0;
const copy = () => translations[language];
const formatPercent = value => new Intl.NumberFormat(copy().locale, {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(value);

function portrait(id) {
  const [, sheet, x, y] = champions[id];
  return `<span class="portrait" aria-hidden="true"><span style="background-image:url('assets/${sheet}');background-position:-${x}px -${y}px"></span></span>`;
}

function slot(id, index, interactive = false) {
  const role = roles[index];
  const name = id ? champions[id][0] : copy().choose;
  const content = `<span class="slot-role"><span aria-hidden="true">${roleMarks[index]}</span> ${role}</span>${id ? portrait(id) : '<span class="empty-portrait" aria-hidden="true">+</span>'}<span class="slot-name">${name}</span>`;
  if (!interactive) return `<div class="slot filled">${content}</div>`;
  const active = activeRole === index && !showingResult;
  return `<button type="button" class="slot ${id ? 'filled' : 'unfilled'}" data-role="${index}" aria-pressed="${active}" aria-label="${role}: ${name}">${content}</button>`;
}

function renderStaticCopy() {
  document.documentElement.lang = language === 'pt' ? 'pt-PT' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = copy()[element.dataset.i18n]; });
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
  $('language-switch').setAttribute('aria-label', copy().languageLabel);
  $('new-scenario').setAttribute('aria-label', copy().nextScenario);
  $('new-scenario').title = copy().nextScenario;
}

function renderScenarioCopy() {
  const [name, style] = copy().scenario[scenarioIndex];
  $('rank').textContent = copy().ranks[rankKeys[scenarioIndex]];
  $('enemy-style').textContent = `${name} · ${style}`;
}

function renderDraft() {
  const picked = lineup.filter(Boolean).length;
  $('count').textContent = `${picked} / 5 ${copy().picks}`;
  $('player-team').innerHTML = lineup.map((id, index) => slot(id, index, true)).join('');
  $('draft-panel').hidden = showingResult;
  $('results').hidden = !showingResult;
  if (showingResult) return;
  const open = roles.map((_, index) => index).filter(index => !lineup[index]);
  if (open.length) availablePool = draftPool(scenario, open, lineup, activeRole);
  const options = offersByRole[activeRole] ?? availablePool;
  $('active-role').textContent = roles[activeRole];
  const openNames = new Intl.ListFormat(copy().locale).format(open.map(index => roles[index]));
  $('pool-note').textContent = lineup[activeRole] ? copy().poolSaved : open.length === roles.length ? copy().poolAll : copy().poolFavors(openNames);
  $('reset').disabled = picked === 0;
  $('evaluate').disabled = picked !== roles.length;
  $('options').innerHTML = options.map(id => {
    const labelKey = tagKeys.find(key => trait(id, key));
    const label = labelKey ? copy().traits[labelKey] : traits.ap.has(id) ? copy().magic : copy().physical;
    const pickedElsewhere = lineup.includes(id) && lineup[activeRole] !== id;
    return `<button type="button" class="option" data-champion="${id}" aria-pressed="${lineup[activeRole] === id}" ${pickedElsewhere ? 'disabled' : ''}>${portrait(id)}<span class="option-name">${champions[id][0]}</span><span class="option-trait">${label}</span></button>`;
  }).join('');
}

function startScenario(index) {
  scenarioIndex = index;
  scenario = encounter(index, matchupRound++);
  score = scoring(scenario);
  lineup = Array(roles.length).fill(null);
  offersByRole = Array(roles.length).fill(null);
  activeRole = 0;
  showingResult = false;
  $('season').textContent = scenario.season;
  $('patch').textContent = `Patch ${scenario.patch.split('.').slice(0, 2).join('.')}`;
  renderScenarioCopy();
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
  $('result-summary').textContent = result.percent === best.percent ? copy().bestResult : gap === 0 ? copy().tiedResult : copy().gapResult(formatPercent(gap));
  $('result-metrics').innerHTML = `<div><span>${copy().yourWinrate}</span><strong>${formatPercent(result.percent)}%</strong></div><div><span>${copy().maxWinrate}</span><strong>${formatPercent(best.percent)}%</strong></div>`;
  $('result-factors').innerHTML = copy().factors.map((label, index) => {
    const value = [result.matchup, result.balance, result.fit, result.lanes][index];
    const rounded = Math.round(value * 10) / 10;
    const impact = rounded > 0 ? copy().favorable : rounded < 0 ? copy().unfavorable : copy().neutral;
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

function setLanguage(nextLanguage) {
  language = nextLanguage;
  try { localStorage.setItem('rift-language', language); } catch {}
  renderStaticCopy();
  renderScenarioCopy();
  if (showingResult) showResult(); else renderDraft();
}

$('player-team').addEventListener('click', event => { const button = event.target.closest('[data-role]'); if (button) openRole(Number(button.dataset.role), event.detail === 0); });
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
  $('announcement').textContent = copy().picked(champions[id][0], roles[role], firstEmpty < 0);
  if (event.detail === 0) (firstEmpty < 0 ? $('evaluate') : $('options').querySelector('button:not(:disabled)')).focus();
});
$('new-scenario').addEventListener('click', () => { startScenario((scenarioIndex + 1) % scenarios.length); $('announcement').textContent = copy().newScenario(copy().scenario[scenarioIndex][0], scenario.season, copy().ranks[rankKeys[scenarioIndex]]); });
$('reset').addEventListener('click', () => { lineup.fill(null); offersByRole.fill(null); openRole(0, true); $('announcement').textContent = copy().cleared; });
$('evaluate').addEventListener('click', showResult);
$('edit').addEventListener('click', () => openRole(activeRole, true));
$('open-help').addEventListener('click', () => $('help').showModal());
document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
renderStaticCopy();
startScenario(playerSeed % scenarios.length);
