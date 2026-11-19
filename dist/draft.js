const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

const roleChampions = [
  'Aatrox Camille Darius Fiora Gangplank Garen Gnar Gwen Jax Kennen KSante Malphite Mordekaiser Ornn Renekton Riven Rumble Sett Shen Sion Teemo Urgot',
  'Amumu Elise Evelynn Fiddlesticks Graves Hecarim Ivern JarvanIV Karthus Khazix Kindred LeeSin Lillia MasterYi Nidalee Nocturne Nunu Poppy Rammus RekSai Sejuani Vi Viego Warwick XinZhao',
  'Ahri Akali Anivia Annie AurelionSol Azir Cassiopeia Diana Ekko Galio Katarina Leblanc Lissandra Lux Orianna Ryze Swain Syndra Talon TwistedFate Veigar Viktor Yasuo Yone Zed Ziggs Zoe',
  'Aphelios Ashe Caitlyn Corki Draven Ezreal Jhin Jinx Kaisa Kalista KogMaw Lucian MissFortune Samira Sivir Smolder Tristana Twitch Varus Vayne Xayah Zeri',
  'Alistar Bard Blitzcrank Brand Braum Janna Karma Leona Lulu Morgana Nami Nautilus Pyke Rakan Rell Renata Senna Seraphine Sona Soraka TahmKench Taric Thresh Yuumi Zyra'
].map(group => group.split(' '));

// Simulated lane distributions. Champions outside this table use their primary role.
// The order is Top, Jungle, Mid, ADC, Support.
const flexRoles = {
  Camille: [88, 8, 0, 0, 4], Garen: [90, 0, 10, 0, 0],
  Graves: [10, 90, 0, 0, 0], Gragas: [37, 42, 16, 0, 5],
  Gwen: [79, 21, 0, 0, 0], Jax: [85, 15, 0, 0, 0],
  Kennen: [86, 0, 14, 0, 0], Malphite: [78, 0, 15, 0, 7],
  Poppy: [38, 49, 0, 0, 13], Rumble: [70, 13, 17, 0, 0],
  Sett: [80, 0, 10, 0, 10], Shen: [87, 0, 0, 0, 13],
  Volibear: [57, 43, 0, 0, 0], Warwick: [18, 82, 0, 0, 0],
  Diana: [0, 64, 36, 0, 0], Ekko: [0, 60, 40, 0, 0],
  Galio: [9, 0, 71, 0, 20], Karthus: [0, 73, 11, 16, 0],
  Lillia: [13, 87, 0, 0, 0], Lux: [0, 0, 44, 0, 56],
  Morgana: [0, 12, 7, 0, 81], Swain: [9, 0, 32, 21, 38],
  Taliyah: [0, 60, 40, 0, 0], Yasuo: [17, 0, 75, 8, 0],
  Yone: [44, 0, 56, 0, 0], Ashe: [0, 0, 0, 79, 21],
  Corki: [0, 0, 58, 42, 0], Seraphine: [0, 0, 12, 23, 65],
  Senna: [0, 0, 0, 15, 85], Karma: [8, 0, 11, 0, 81],
  Brand: [0, 25, 13, 0, 62], Zyra: [0, 12, 0, 0, 88]
};
const historicalFlex = {
  '6.18.1': { Ashe: [0, 0, 0, 100, 0], Diana: [0, 35, 65, 0, 0], Poppy: [65, 34, 0, 0, 1], Brand: [0, 0, 30, 0, 70] },
  '9.19.1': { Ashe: [0, 0, 0, 100, 0], Corki: [0, 0, 94, 6, 0], Brand: [0, 0, 15, 0, 85] },
  '11.19.1': { Corki: [0, 0, 94, 6, 0] }
};
const draftChampions = [...new Set([...roleChampions.flat(), ...Object.keys(flexRoles)])];
function roleProbability(id, role, patch) {
  const distribution = historicalFlex[patch]?.[id] ?? flexRoles[id];
  return distribution ? distribution[role] / 100 : Number(roleChampions[role].includes(id));
}

const traits = {
  ap: 'Gwen Kennen Malphite Mordekaiser Rumble Teemo Amumu Elise Evelynn Fiddlesticks Ivern Karthus Lillia Nidalee Nunu Rammus Sejuani Ahri Akali Anivia Annie AurelionSol Azir Cassiopeia Diana Ekko Galio Katarina Leblanc Lissandra Lux Orianna Ryze Swain Syndra TwistedFate Veigar Viktor Zoe Alistar Bard Blitzcrank Brand Braum Janna Karma Leona Lulu Morgana Nami Nautilus Rakan Rell Renata Seraphine Sona Soraka TahmKench Taric Thresh Yuumi Zyra',
  frontline: 'Aatrox Darius Garen Gnar KSante Malphite Mordekaiser Ornn Renekton Sett Shen Sion Urgot Amumu Hecarim JarvanIV Nunu Poppy Rammus Sejuani Vi Warwick XinZhao Galio Swain Alistar Braum Leona Nautilus Rakan Rell TahmKench Taric Thresh',
  engage: 'Camille Gnar KSante Malphite Ornn Renekton Sett Shen Sion Amumu Fiddlesticks Hecarim JarvanIV LeeSin Nunu Nocturne Rammus RekSai Sejuani Vi Warwick Diana Galio Lissandra Ashe Varus Alistar Bard Blitzcrank Leona Nautilus Pyke Rakan Rell Thresh',
  peel: 'Gnar Ornn Shen Ivern Kindred Poppy Sejuani Anivia Galio Lissandra Orianna Xayah Alistar Braum Janna Karma Lulu Morgana Nami Renata Seraphine Sona Soraka TahmKench Taric Thresh Yuumi',
  poke: 'Gangplank Jayce Kennen Rumble Teemo Graves Nidalee Anivia Azir Leblanc Lux Orianna Syndra Viktor Xerath Zoe Caitlyn Corki Ezreal Jhin KogMaw Sivir Varus Brand Karma Nami Seraphine Zyra',
  dive: 'Aatrox Camille Fiora Gwen Jax KSante Malphite Renekton Riven Hecarim JarvanIV Khazix LeeSin MasterYi Nocturne RekSai Vi Viego Warwick XinZhao Ahri Akali Diana Ekko Katarina Leblanc Talon Yasuo Yone Zed Kaisa Kalista Samira Tristana Alistar Leona Nautilus Pyke Rakan Rell',
  scaling: 'Camille Fiora Gangplank Gwen Jax Ornn Sion Evelynn Karthus Kindred Lillia MasterYi Viego Anivia AurelionSol Azir Cassiopeia Katarina Orianna Ryze Veigar Viktor Yasuo Yone Aphelios Jinx Kaisa KogMaw Smolder Tristana Twitch Vayne Xayah Zeri Lulu Senna Seraphine Sona Soraka Yuumi',
  tempo: 'Darius Garen Gnar Renekton Riven Rumble Sett Teemo Elise Graves JarvanIV LeeSin Nidalee RekSai Warwick XinZhao Annie Galio Leblanc Lux Syndra Talon TwistedFate Zed Ashe Caitlyn Draven Jhin Kalista Lucian MissFortune Blitzcrank Brand Karma Leona Nautilus Pyke',
  execution: 'Camille Fiora Gangplank Gnar KSante Riven Elise Ivern Kindred LeeSin Nidalee RekSai Azir Akali Cassiopeia Katarina Leblanc Ryze TwistedFate Yasuo Zed Zoe Aphelios Draven Kalista Samira Vayne Zeri Bard Pyke Thresh',
  shred: 'Camille Darius Fiora Gwen Mordekaiser Viego Cassiopeia Kaisa KogMaw Varus Vayne'
};
for (const [trait, ids] of Object.entries(traits)) traits[trait] = new Set(ids.split(' '));
for (const [id, profile] of Object.entries({
  Gragas: ['ap', 'frontline', 'engage', 'peel'], Volibear: ['frontline', 'engage', 'dive', 'tempo'],
  Taliyah: ['ap', 'poke', 'peel', 'execution'], Ziggs: ['ap', 'poke']
})) {
  for (const key of profile) traits[key].add(id);
}
const trait = (id, key) => Number(traits[key].has(id));
const tags = {
  frontline: 'Linha da frente', engage: 'Iniciação', peel: 'Proteção', poke: 'Poke',
  dive: 'Dive', scaling: 'Scaling', tempo: 'Early game', shred: 'Anti-tank'
};

const scenarios = [
  { name: 'O cerco', season: '2024', patch: '14.19.1', rank: 'Esmeralda', style: 'Poke e controlo de zona', enemy: ['Aatrox', 'Graves', 'Syndra', 'Jhin', 'Karma'], seed: 6, pace: 0.25, finesse: 0.25,
    pool: ['Camille Gnar Malphite Ornn Renekton Gwen Shen', 'Vi Nocturne LeeSin Sejuani Poppy Lillia JarvanIV', 'Ahri Orianna Galio Akali Yasuo Viktor Lux', 'Kaisa Caitlyn Xayah Ashe Ezreal Jinx Samira', 'Leona Nautilus Rakan Braum Lulu Janna Thresh'] },
  { name: 'À queima-roupa', season: '2016', patch: '6.18.1', rank: 'Prata', style: 'Dive coordenado', enemy: ['Gnar', 'LeeSin', 'Diana', 'Lucian', 'Leona'], seed: 31, pace: 0.15, finesse: -0.65 },
  { name: 'A última luta', season: '2019', patch: '9.19.1', rank: 'Diamante', style: 'Scaling e proteção do ADC', enemy: ['Ornn', 'Sejuani', 'Veigar', 'Jinx', 'Lulu'], seed: 71, pace: -0.12, finesse: 0.58 },
  { name: 'Sem espaço', season: '2021', patch: '11.19.1', rank: 'Ouro', style: 'Pressão nas lanes e pickoffs', enemy: ['Renekton', 'XinZhao', 'Leblanc', 'Draven', 'Thresh'], seed: 81, pace: 0.45, finesse: -0.28 },
  { name: 'Linha de choque', season: '2024', patch: '14.19.1', rank: 'Mestre', style: 'Linha da frente e teamfight', enemy: ['KSante', 'Amumu', 'Orianna', 'Smolder', 'Rell'], seed: 121, pace: 0.25, finesse: 0.8 },
  { name: 'A cinco passos', season: '2016', patch: '6.18.1', rank: 'Platina', style: 'Poke e proteção', enemy: ['Gangplank', 'Nidalee', 'Lux', 'Ezreal', 'Janna'], seed: 210, pace: 0.15, finesse: 0.10 },
  { name: 'Ponto cego', season: '2019', patch: '9.19.1', rank: 'Prata', style: 'Emboscadas e acesso à backline', enemy: ['Camille', 'Nocturne', 'Zed', 'Kaisa', 'Pyke'], seed: 331, pace: -0.12, finesse: -0.65 },
  { name: 'Sem travões', season: '2021', patch: '11.19.1', rank: 'Platina', style: 'Pressão cedo e engage', enemy: ['Sett', 'JarvanIV', 'TwistedFate', 'MissFortune', 'Nautilus'], seed: 451, pace: 0.45, finesse: 0.10 }
];

const laneEdges = [
  ['Fiora', 'Aatrox'], ['Gwen', 'Ornn'], ['Gwen', 'KSante'], ['Malphite', 'Gnar'],
  ['Shen', 'Camille'], ['Poppy', 'LeeSin'], ['Poppy', 'JarvanIV'], ['Poppy', 'XinZhao'],
  ['Kindred', 'Amumu'], ['Warwick', 'Nocturne'], ['Lissandra', 'Leblanc'],
  ['Lissandra', 'Zed'], ['Galio', 'Leblanc'], ['Anivia', 'TwistedFate'],
  ['Caitlyn', 'Jhin'], ['Ashe', 'Jhin'], ['Draven', 'Jinx'], ['Caitlyn', 'Smolder'],
  ['Xayah', 'Kaisa'], ['Braum', 'MissFortune'], ['Braum', 'Leona'], ['Morgana', 'Nautilus'],
  ['Morgana', 'Thresh'], ['Janna', 'Rell'], ['Rakan', 'Karma'], ['Lulu', 'Pyke']
];

// The alternatives preserve the named scenario's draft theme.
const rivalAlternatives = [
  ['Gnar Rumble', 'Nidalee Lillia', 'Lux Viktor', 'Caitlyn Ezreal', 'Zyra Seraphine'],
  ['Malphite Renekton', 'JarvanIV Nocturne', 'Ahri Lissandra', 'Tristana Kalista', 'Alistar Nautilus'],
  ['Shen Sion', 'Ivern Amumu', 'Orianna Anivia', 'KogMaw Twitch', 'Janna Braum'],
  ['Darius Sett', 'Elise LeeSin', 'Talon TwistedFate', 'Lucian Caitlyn', 'Blitzcrank Pyke'],
  ['Ornn Malphite', 'Sejuani JarvanIV', 'Galio Swain', 'Aphelios Jinx', 'Rakan Nautilus'],
  ['Kennen Teemo', 'Graves Elise', 'Ziggs Viktor', 'Caitlyn Varus', 'Karma Nami'],
  ['Fiora Jax', 'Khazix Evelynn', 'Talon Leblanc', 'Twitch Tristana', 'Thresh Blitzcrank'],
  ['Renekton Gnar', 'Vi XinZhao', 'Galio Annie', 'Lucian Samira', 'Leona Rakan']
];

function seededDraw(seed) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2 ** 32;
  };
}

function weightedTake(options, random) {
  const total = options.reduce((sum, option) => sum + option.weight, 0);
  let ticket = random() * total;
  const index = options.findIndex(option => (ticket -= option.weight) < 0);
  return options.splice(index < 0 ? options.length - 1 : index, 1)[0].id;
}

function encounter(index) {
  const scenario = scenarios[index];
  const legal = new Set(rosters[scenario.patch]);
  const random = seededDraw(scenario.seed);
  const enemy = [];
  for (const [role, featured] of scenario.enemy.entries()) {
    const candidates = [featured, ...rivalAlternatives[index][role].split(' ')]
      .filter(id => legal.has(id) && !enemy.includes(id))
      .map(id => ({ id, weight: roleProbability(id, role, scenario.patch) * (id === featured ? 3 : 1) }))
      .filter(option => option.weight > 0);
    enemy.push(weightedTake(candidates, random));
  }
  return { ...scenario, enemy };
}

function draftPool(scenario, openRoles, assigned) {
  const legal = new Set(rosters[scenario.patch]);
  const mask = openRoles.reduce((value, role) => value | (1 << role), 0);
  const random = seededDraw(scenario.seed + 1000 + 53 * mask);
  const eligible = draftChampions.filter(id => legal.has(id) && !scenario.enemy.includes(id) && !assigned.includes(id));
  const selected = [];
  const startingRole = Math.floor(random() * openRoles.length);
  const featured = openRoles.map(role => new Set(scenario.pool?.[role].split(' ') ?? []));
  for (let index = 0; index < 6; index++) {
    const offset = (startingRole + index) % openRoles.length;
    const role = openRoles[offset];
    const options = eligible.filter(id => !selected.includes(id)).map(id => {
      const counter = laneEdges.some(([pick, enemy]) => id === pick && scenario.enemy[role] === enemy);
      return { id, weight: roleProbability(id, role, scenario.patch) ** 1.5 * (featured[offset].has(id) || counter ? 2 : 1) };
    }).filter(option => option.weight > 0);
    selected.push(weightedTake(options, random));
  }
  const wildcard = eligible.filter(id => !selected.includes(id)).map(id => ({ id, weight: 1 }));
  selected.splice(Math.floor(random() * 7), 0, weightedTake(wildcard, random));
  return selected;
}

function totals(team) {
  return Object.fromEntries(Object.keys(traits).map(key =>
    [key, team.reduce((sum, id) => sum + trait(id, key), 0)]
  ));
}

function scoring(scenario) {
  const rival = totals(scenario.enemy);
  const soloEdges = roles.map((_, index) => {
    const opponent = scenario.enemy[index];
    return Object.fromEntries(draftChampions.map(id => {
      const direct = laneEdges.reduce((edge, [pick, enemy]) =>
        edge + Number(id === pick && opponent === enemy) - Number(id === enemy && opponent === pick), 0);
      return [id, 1.4 * direct + 0.18 * trait(id, 'peel') * trait(opponent, 'dive')
        + 0.36 * trait(id, 'shred') * trait(opponent, 'frontline')
        + 0.22 * (trait(id, 'dive') * trait(opponent, 'poke') - trait(id, 'poke') * trait(opponent, 'dive'))];
    }));
  });

  function structure(team, support) {
    const magic = team.ap - 0.7 * trait(support, 'ap');
    return 0.8 * Math.min(team.frontline, 2) + 0.5 * Math.min(team.engage, 2)
      + 0.35 * Math.min(team.peel, 2) + 0.6 * Math.min(team.scaling, 2)
      - 0.8 * Math.max(0, 1.2 - magic, magic - 2.8)
      + 0.25 * Math.min(team.engage, team.dive, 2);
  }

  function answers(team, opponent) {
    return 0.24 * Math.min(team.peel, 3) * opponent.dive
      + 0.21 * Math.min(team.engage, 3) * opponent.poke
      + 0.24 * Math.min(team.shred, 2) * opponent.frontline
      + 0.2 * Math.min(team.tempo, 3) * Math.max(0, opponent.scaling - 1)
      + 0.16 * Math.min(team.poke, 3) * Math.max(0, 3 - opponent.engage);
  }

  function context(team) {
    return scenario.pace * (Math.min(team.tempo, 3) - 0.4 * Math.min(team.scaling, 3))
      + scenario.finesse * (0.5 * team.execution + 0.2 * Math.min(team.engage, team.dive));
  }

  function suitability(team) {
    return team.reduce((sum, id, role) =>
      sum + 0.65 * Math.log(0.25 + 0.75 * roleProbability(id, role, scenario.patch)), 0);
  }

  const rivalStructure = structure(rival, scenario.enemy[4]);
  const rivalContext = context(rival);
  const rivalSuitability = suitability(scenario.enemy);
  return function score(team) {
    const stats = totals(team);
    const matchup = team.reduce((sum, id, index) => sum + soloEdges[index][id], 0)
      + answers(stats, rival) - answers(rival, stats);
    const balance = structure(stats, team[4]) - rivalStructure;
    const fit = context(stats) - rivalContext;
    const lanes = suitability(team) - rivalSuitability;
    return { percent: 50 + 32 * Math.tanh((matchup + balance + fit + lanes) / 8), matchup, balance, fit, lanes };
  };
}

function bestDraft(pools, score) {
  let best = { team: [], percent: -Infinity };
  const team = [];
  function tryPicks(index) {
    if (index === pools.length) {
      const { percent } = score(team);
      if (percent > best.percent) best = { team: [...team], percent };
      return;
    }
    for (const id of pools[index]) {
      if (team.includes(id)) continue;
      team.push(id);
      tryPicks(index + 1);
      team.pop();
    }
  }
  tryPicks(0);
  return best;
}
