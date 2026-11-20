const $ = id => document.getElementById(id);
const roleMarks = ['▲', '✦', '◆', '◎', '✚'];
const bestByPools = new Map();
const translations = {
  pt: {
    locale: 'pt-PT', languageLabel: 'Idioma', choose: 'Vazio', picks: 'PICKS', howToPlay: 'Como jogar',
    tagline: 'Lê o draft rival. Escolhe os teus cinco. Maximiza o winrate.', enemyTeam: 'Equipa adversária', redSide: 'LADO VERMELHO',
    yourTeam: 'A tua equipa', choosePerRole: 'Escolhe um champion e depois atribui-lhe uma role.',
    chooseChampion: 'Escolhe um champion', chooseRole: 'Agora escolhe uma role para {champion}', reroll: 'Trocar pool · 1', rerollUsed: 'Pool trocada',
    simulatedModel: 'Modelo de composição e winrate simulado', calculate: 'Calcular winrate', draftResult: 'Resultado do draft',
    bestTeam: 'Melhor equipa possível com as pools que recebeste', fanGame: 'Rift Draft · Jogo de fãs', credits: 'Catálogo e retratos', inspired: 'Inspirado no',
    helpOne: 'Começas por ver dois champions adversários, além do patch da season e do rank.',
    helpTwo: 'Escolhe um champion da pool de dez e depois clica numa role vazia. A escolha fica bloqueada.',
    helpThree: 'Depois de cada escolha surge uma nova pool de dez e é revelado mais um adversário. Podes trocar uma pool por draft.',
    helpModel: 'Cada champion tem uma adequação escondida às diferentes posições. Podes colocá-lo em qualquer role, mas uma escolha menos habitual reduz a pontuação final.',
    backToDraft: 'Voltar ao draft', nextScenario: 'Próximo cenário', hiddenEnemy: 'Por revelar', gradeLabel: 'CLASSIFICAÇÃO',
    bestPickLabel: 'Melhor pick', worstPickLabel: 'Pick mais arriscado', bestScoreLabel: 'Melhor winrate', streakLabel: 'Streak atual',
    bestPickText: (champion, role) => `${champion} foi a escolha que mais valorizou a composição em ${role}.`,
    worstPickText: (champion, role, alternative, value) => `${champion} foi o pick mais arriscado em ${role}. A melhor alternativa disponível era ${alternative} (${value}%).`,
    enemyRevealed: champion => `${champion} foi revelado na equipa adversária.`,
    bestResult: 'Atingiste o melhor winrate possível com as pools que recebeste.', tiedResult: 'Igualaste o melhor winrate à décima.',
    gapResult: gap => `Ficaste a ${gap} p.p. do melhor winrate possível.`, yourWinrate: 'O TEU WINRATE SIMULADO', maxWinrate: 'MÁXIMO POSSÍVEL',
    factors: ['Matchups', 'Equilíbrio da equipa', 'Season e rank', 'Adequação às roles'], favorable: 'Favorável', unfavorable: 'Desfavorável', neutral: 'Neutro',
    magic: 'Dano mágico', physical: 'Dano físico', traits: {frontline:'Linha da frente',engage:'Iniciação',peel:'Proteção',poke:'Poke',dive:'Dive',scaling:'Scaling',tempo:'Early game',shred:'Anti-tank'},
    ranks: {Emerald:'Esmeralda',Silver:'Prata',Diamond:'Diamante',Gold:'Ouro',Master:'Mestre',Platinum:'Platina'},
    scenario: [['O cerco','Poke e controlo de zona'],['À queima-roupa','Dive coordenado'],['A última luta','Scaling e proteção do ADC'],['Sem espaço','Pressão nas lanes e pickoffs'],['Linha de choque','Linha da frente e teamfight'],['A cinco passos','Poke e proteção'],['Ponto cego','Emboscadas e acesso à backline'],['Sem travões','Pressão cedo e engage']],
    selected: champion => `${champion} selecionado. Escolhe uma role vazia.`,
    picked: (champion, role, done) => `${champion} colocado em ${role}. ${done ? 'Equipa completa.' : 'Nova pool disponível.'}`,
    newScenario: (name, season, rank) => `Novo cenário: ${name}, ${season}, rank ${rank}.`
  },
  en: {
    locale: 'en-GB', languageLabel: 'Language', choose: 'Empty', picks: 'PICKS', howToPlay: 'How to play',
    tagline: 'Read the enemy draft. Pick your five. Maximise your win rate.', enemyTeam: 'Enemy team', redSide: 'RED SIDE',
    yourTeam: 'Your team', choosePerRole: 'Choose a champion and then assign it to a role.',
    chooseChampion: 'Choose a champion', chooseRole: 'Now choose a role for {champion}', reroll: 'Reroll pool · 1', rerollUsed: 'Pool rerolled',
    simulatedModel: 'Team composition model and simulated win rate', calculate: 'Calculate win rate', draftResult: 'Draft result',
    bestTeam: 'Best possible team from the pools you received', fanGame: 'Rift Draft · Fan game', credits: 'Champion catalogue and portraits', inspired: 'Inspired by',
    helpOne: 'You begin with two enemy champions revealed, plus the season patch and rank.',
    helpTwo: 'Choose a champion from the pool of ten, then click an empty role. Your choice is locked.',
    helpThree: 'After every choice, a new pool of ten appears and another enemy is revealed. You may reroll one pool per draft.',
    helpModel: 'Every champion has hidden suitability for each role. You can place them anywhere, but an unusual assignment lowers the final score.',
    backToDraft: 'Back to draft', nextScenario: 'Next scenario', hiddenEnemy: 'Hidden', gradeLabel: 'GRADE',
    bestPickLabel: 'Best pick', worstPickLabel: 'Riskiest pick', bestScoreLabel: 'Best win rate', streakLabel: 'Current streak',
    bestPickText: (champion, role) => `${champion} added the most value to your composition in ${role}.`,
    worstPickText: (champion, role, alternative, value) => `${champion} was the riskiest pick in ${role}. The best available alternative was ${alternative} (${value}%).`,
    enemyRevealed: champion => `${champion} was revealed on the enemy team.`,
    bestResult: 'You reached the best possible win rate from your pools.', tiedResult: 'You matched the best win rate to one decimal place.',
    gapResult: gap => `You finished ${gap} pp behind the best possible win rate.`, yourWinrate: 'YOUR SIMULATED WIN RATE', maxWinrate: 'MAXIMUM POSSIBLE',
    factors: ['Matchups', 'Team balance', 'Season and rank', 'Role suitability'], favorable: 'Favourable', unfavorable: 'Unfavourable', neutral: 'Neutral',
    magic: 'Magic damage', physical: 'Physical damage', traits: {frontline:'Front line',engage:'Engage',peel:'Peel',poke:'Poke',dive:'Dive',scaling:'Scaling',tempo:'Early game',shred:'Anti-tank'},
    ranks: {Emerald:'Emerald',Silver:'Silver',Diamond:'Diamond',Gold:'Gold',Master:'Master',Platinum:'Platinum'},
    scenario: [['The siege','Poke and zone control'],['Point-blank','Coordinated dive'],['The final fight','Scaling and ADC protection'],['No room','Lane pressure and pickoffs'],['Shock line','Front line and teamfights'],['Five steps away','Poke and protection'],['Blind spot','Ambushes and backline access'],['No brakes','Early pressure and engage']],
    selected: champion => `${champion} selected. Choose an empty role.`,
    picked: (champion, role, done) => `${champion} placed in ${role}. ${done ? 'Team complete.' : 'A new pool is ready.'}`,
    newScenario: (name, season, rank) => `New scenario: ${name}, ${season}, ${rank}.`
  }
};
const rankKeys = ['Emerald', 'Silver', 'Diamond', 'Gold', 'Master', 'Platinum', 'Silver', 'Platinum'];
let language = (() => { try { return localStorage.getItem('rift-language') === 'en' ? 'en' : 'pt'; } catch { return 'pt'; } })();
let scenarioIndex = 0;
let scenario;
let score;
let lineup;
let currentPool;
let offersByRole;
let selectedChampion;
let showingResult;
let enemyRevealOrder;
let revealedEnemies;
let rerollUsed;
let resultData;
let matchupRound = 0;
const copy = () => translations[language];
const formatPercent = value => new Intl.NumberFormat(copy().locale, {minimumFractionDigits: 1, maximumFractionDigits: 1}).format(value);
const progressKey = 'rift-draft-progress-v1';

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey));
    return { best: Number(saved?.best) || 0, streak: Number(saved?.streak) || 0 };
  } catch {
    return { best: 0, streak: 0 };
  }
}

function saveProgress(progress) {
  try { localStorage.setItem(progressKey, JSON.stringify(progress)); } catch {}
}

function portrait(id) {
  const [, sheet, x, y] = champions[id];
  return `<span class="portrait" aria-hidden="true"><span style="background-image:url('assets/${sheet}');background-position:-${x}px -${y}px"></span></span>`;
}

function slot(id, index, interactive = false) {
  const role = roles[index];
  const name = id ? champions[id][0] : copy().choose;
  const content = `<span class="slot-role"><span aria-hidden="true">${roleMarks[index]}</span> ${role}</span>${id ? portrait(id) : '<span class="empty-portrait" aria-hidden="true">+</span>'}<span class="slot-name">${name}</span>`;
  if (!interactive || id) return `<div class="slot ${id ? 'filled' : 'unfilled'}">${content}</div>`;
  return `<button type="button" class="slot unfilled ${selectedChampion ? 'role-ready' : ''}" data-role="${index}" ${selectedChampion ? '' : 'disabled'} aria-label="${role}: ${name}">${content}</button>`;
}

function hiddenEnemySlot(index) {
  return `<div class="slot hidden-enemy"><span class="slot-role"><span aria-hidden="true">${roleMarks[index]}</span> ${roles[index]}</span><span class="empty-portrait" aria-hidden="true">?</span><span class="slot-name">${copy().hiddenEnemy}</span></div>`;
}

function renderEnemyTeam() {
  const visible = new Set(enemyRevealOrder.slice(0, revealedEnemies));
  $('enemy-team').innerHTML = scenario.enemy.map((id, role) => visible.has(role) ? slot(id, role) : hiddenEnemySlot(role)).join('');
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
  renderEnemyTeam();
}

function renderDraft() {
  const picked = lineup.filter(Boolean).length;
  $('count').textContent = `${picked} / 5 ${copy().picks}`;
  $('player-team').innerHTML = lineup.map((id, index) => slot(id, index, true)).join('');
  $('draft-panel').hidden = showingResult;
  $('results').hidden = !showingResult;
  if (showingResult) return;
  $('pool-heading').textContent = selectedChampion
    ? copy().chooseRole.replace('{champion}', champions[selectedChampion][0])
    : copy().chooseChampion;
  $('reroll').disabled = rerollUsed;
  $('reroll').textContent = rerollUsed ? copy().rerollUsed : copy().reroll;
  $('evaluate').disabled = picked !== roles.length;
  $('options').innerHTML = currentPool.map(id => {
    const labelKey = tagKeys.find(key => trait(id, key));
    const label = labelKey ? copy().traits[labelKey] : traits.ap.has(id) ? copy().magic : copy().physical;
    const used = lineup.includes(id);
    return `<button type="button" class="option" data-champion="${id}" aria-pressed="${selectedChampion === id}" ${used ? 'disabled' : ''}>${portrait(id)}<span class="option-name">${champions[id][0]}</span><span class="option-trait">${label}</span></button>`;
  }).join('');
}

function refreshPool(variant = 0) {
  const openRoles = roles.map((_, index) => index).filter(index => !lineup[index]);
  if (!openRoles.length) return;
  currentPool = draftPool(scenario, openRoles, lineup.filter(Boolean), variant);
}

function startScenario(index) {
  scenarioIndex = index;
  scenario = encounter(index, matchupRound++);
  score = scoring(scenario);
  lineup = Array(roles.length).fill(null);
  offersByRole = Array(roles.length).fill(null);
  selectedChampion = null;
  showingResult = false;
  rerollUsed = false;
  resultData = null;
  revealedEnemies = 2;
  enemyRevealOrder = roles.map((_, index) => index);
  const revealRandom = seededDraw((scenario.drawSeed ^ 0x9e3779b9) >>> 0);
  for (let index = enemyRevealOrder.length - 1; index > 0; index--) {
    const swap = Math.floor(revealRandom() * (index + 1));
    [enemyRevealOrder[index], enemyRevealOrder[swap]] = [enemyRevealOrder[swap], enemyRevealOrder[index]];
  }
  refreshPool();
  $('season').textContent = scenario.season;
  $('patch').textContent = `Patch ${scenario.patch.split('.').slice(0, 2).join('.')}`;
  renderScenarioCopy();
  renderEnemyTeam();
  renderDraft();
}

function gradeFor(percent) {
  if (percent >= 75) return 'S+';
  if (percent >= 68) return 'S';
  if (percent >= 60) return 'A';
  if (percent >= 52) return 'B';
  if (percent >= 45) return 'C';
  return 'D';
}

function analyzePicks(result) {
  return lineup.map((champion, role) => {
    const alternatives = offersByRole[role].filter(id => id !== champion && !lineup.includes(id));
    const scored = alternatives.map(id => {
      const team = [...lineup];
      team[role] = id;
      return { id, percent: score(team).percent };
    }).sort((left, right) => right.percent - left.percent);
    const average = scored.reduce((sum, item) => sum + item.percent, 0) / scored.length;
    return {
      champion,
      role,
      contribution: result.percent - average,
      alternative: scored[0]
    };
  });
}

function prepareResult() {
  const result = score(lineup);
  const route = JSON.stringify([scenarioIndex, offersByRole]);
  if (!bestByPools.has(route)) bestByPools.set(route, bestDraft(offersByRole, score));
  const best = bestByPools.get(route);
  const analyses = analyzePicks(result).sort((left, right) => right.contribution - left.contribution);
  const progress = loadProgress();
  progress.best = Math.max(progress.best, result.percent);
  progress.streak = result.percent > 50 ? progress.streak + 1 : 0;
  saveProgress(progress);
  return {
    result,
    best,
    gap: (Math.round(best.percent * 10) - Math.round(result.percent * 10)) / 10,
    grade: gradeFor(result.percent),
    bestPick: analyses[0],
    worstPick: analyses.at(-1),
    progress
  };
}

function showResult() {
  if (lineup.some(id => !id)) return;
  if (!resultData) resultData = prepareResult();
  const { result, best, gap, grade, bestPick, worstPick, progress } = resultData;
  showingResult = true;
  $('result-summary').textContent = result.percent === best.percent ? copy().bestResult : gap === 0 ? copy().tiedResult : copy().gapResult(formatPercent(gap));
  $('result-metrics').innerHTML = `
    <div><span>${copy().yourWinrate}</span><strong>${formatPercent(result.percent)}%</strong></div>
    <div><span>${copy().maxWinrate}</span><strong>${formatPercent(best.percent)}%</strong></div>
    <div><span>${copy().gradeLabel}</span><strong class="grade">${grade}</strong></div>`;
  $('result-factors').innerHTML = copy().factors.map((label, index) => {
    const value = [result.matchup, result.balance, result.fit, result.lanes][index];
    const rounded = Math.round(value * 10) / 10;
    const impact = rounded > 0 ? copy().favorable : rounded < 0 ? copy().unfavorable : copy().neutral;
    return `<div data-impact="${Math.sign(rounded)}"><span>${label}</span><strong>${impact}</strong></div>`;
  }).join('');
  $('result-analysis').innerHTML = `
    <article><h3>${copy().bestPickLabel}</h3><p>${copy().bestPickText(champions[bestPick.champion][0], roles[bestPick.role])}</p></article>
    <article><h3>${copy().worstPickLabel}</h3><p>${copy().worstPickText(champions[worstPick.champion][0], roles[worstPick.role], champions[worstPick.alternative.id][0], formatPercent(worstPick.alternative.percent))}</p></article>`;
  $('result-progress').innerHTML = `
    <div>${copy().bestScoreLabel}<strong>${formatPercent(progress.best)}%</strong></div>
    <div>${copy().streakLabel}<strong>${progress.streak}</strong></div>`;
  $('best-team').innerHTML = best.team.map((id, index) => slot(id, index)).join('');
  renderDraft();
  $('result-heading').focus();
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  try { localStorage.setItem('rift-language', language); } catch {}
  renderStaticCopy();
  renderScenarioCopy();
  if (showingResult) showResult(); else renderDraft();
}

$('options').addEventListener('click', event => {
  const option = event.target.closest('[data-champion]');
  if (!option || lineup.includes(option.dataset.champion)) return;
  selectedChampion = option.dataset.champion;
  renderDraft();
  $('announcement').textContent = copy().selected(champions[selectedChampion][0]);
});

$('player-team').addEventListener('click', event => {
  const button = event.target.closest('[data-role]');
  if (!button || !selectedChampion) return;
  const role = Number(button.dataset.role);
  if (lineup[role]) return;
  const champion = selectedChampion;
  offersByRole[role] = currentPool;
  lineup[role] = champion;
  selectedChampion = null;
  const done = lineup.every(Boolean);
  let revealedChampion = null;
  if (revealedEnemies < roles.length) {
    const revealedRole = enemyRevealOrder[revealedEnemies];
    revealedEnemies += 1;
    revealedChampion = scenario.enemy[revealedRole];
  }
  if (!done) refreshPool();
  renderEnemyTeam();
  renderDraft();
  $('announcement').textContent = copy().picked(champions[champion][0], roles[role], done)
    + (revealedChampion ? ` ${copy().enemyRevealed(champions[revealedChampion][0])}` : '');
  if (event.detail === 0) (done ? $('evaluate') : $('options').querySelector('button:not(:disabled)')).focus();
});

$('reroll').addEventListener('click', () => {
  if (rerollUsed || showingResult) return;
  rerollUsed = true;
  selectedChampion = null;
  refreshPool(1);
  renderDraft();
});
$('new-scenario').addEventListener('click', () => {
  startScenario((scenarioIndex + 1) % scenarios.length);
  $('announcement').textContent = copy().newScenario(copy().scenario[scenarioIndex][0], scenario.season, copy().ranks[rankKeys[scenarioIndex]]);
});
$('evaluate').addEventListener('click', showResult);
$('open-help').addEventListener('click', () => $('help').showModal());
document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
renderStaticCopy();
startScenario(playerSeed % scenarios.length);
