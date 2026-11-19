const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

const roleChampions = [
  'Aatrox Camille Darius Fiora Gangplank Garen Gnar Gwen Jax Kennen KSante Malphite Mordekaiser Ornn Renekton Riven Rumble Sett Shen Sion Teemo Urgot',
  'Amumu Elise Evelynn Fiddlesticks Graves Hecarim Ivern JarvanIV Karthus Khazix Kindred LeeSin Lillia MasterYi Nidalee Nocturne Nunu Poppy Rammus RekSai Sejuani Vi Viego Warwick XinZhao',
  'Ahri Akali Anivia Annie AurelionSol Azir Cassiopeia Diana Ekko Galio Katarina Leblanc Lissandra Lux Orianna Ryze Swain Syndra Talon TwistedFate Veigar Viktor Yasuo Yone Zed Zoe',
  'Aphelios Ashe Caitlyn Corki Draven Ezreal Jhin Jinx Kaisa Kalista KogMaw Lucian MissFortune Samira Sivir Smolder Tristana Twitch Varus Vayne Xayah Zeri',
  'Alistar Bard Blitzcrank Brand Braum Janna Karma Leona Lulu Morgana Nami Nautilus Pyke Rakan Rell Renata Senna Seraphine Sona Soraka TahmKench Taric Thresh Yuumi Zyra'
].map(group => group.split(' '));

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

function draftPools(scenario) {
  const legal = new Set(rosters[scenario.patch]);
  if (scenario.pool) {
    return scenario.pool.map(row => row.split(' ').filter(id => legal.has(id) && !scenario.enemy.includes(id)));
  }

  let seed = scenario.seed;
  return roleChampions.map((row, role) => {
    const options = row.filter(id => legal.has(id) && !scenario.enemy.includes(id));
    for (let index = options.length - 1; index > 0; index--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const swap = seed % (index + 1);
      [options[index], options[swap]] = [options[swap], options[index]];
    }
    const laneCounter = laneEdges.find(([pick, enemy]) => enemy === scenario.enemy[role] && options.includes(pick));
    const pool = options.slice(0, 7);
    if (laneCounter && !pool.includes(laneCounter[0])) pool[3] = laneCounter[0];
    return pool;
  });
}

function totals(team) {
  return Object.fromEntries(Object.keys(traits).map(key =>
    [key, team.reduce((sum, id) => sum + trait(id, key), 0)]
  ));
}

function scoring(scenario) {
  const rival = totals(scenario.enemy);
  const soloEdges = roleChampions.map((pool, index) => {
    const opponent = scenario.enemy[index];
    return Object.fromEntries(pool.map(id => {
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

  const rivalStructure = structure(rival, scenario.enemy[4]);
  const rivalContext = context(rival);
  return function score(team) {
    const stats = totals(team);
    const matchup = team.reduce((sum, id, index) => sum + soloEdges[index][id], 0)
      + answers(stats, rival) - answers(rival, stats);
    const balance = structure(stats, team[4]) - rivalStructure;
    const fit = context(stats) - rivalContext;
    return { percent: 50 + 32 * Math.tanh((matchup + balance + fit) / 8), matchup, balance, fit };
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
