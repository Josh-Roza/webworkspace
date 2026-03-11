document.addEventListener('DOMContentLoaded', () => {
  console.log('scenViewer.js loaded (DOMContentLoaded)');

  const jsonMonsterData = document.getElementById('monsterData');
  let monsterData = null;
  if (jsonMonsterData) {
    try {
      monsterData = JSON.parse(jsonMonsterData.textContent);
      console.log('monsterData', monsterData);
    } catch (e) {
      console.error('Invalid JSON in #monsterData', e);
    }
  } else {
    console.log('No #monsterData element found in DOM');
  }

  const raw = sessionStorage.getItem('lastScenario');
  if (!raw) {
    console.warn('No scenario in sessionStorage');
    return;
  }

  let scenario;
  try {
    scenario = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid scenario JSON', e);
    return;  }

  console.log('scenario from sessionStorage', scenario);
  monsterDiv = document.getElementById("monsterDiv");
  for (let i = 0; i < scenario.monsters.length; i++) {
      summon(scenario.monsters[i]);
  }
});

let monsterDiv = document.getElementById("monsterDiv");
let monsterHealths = [];

function checkHealths(){
  for (let i = 0; i < monsterHealths.length; i++) {
    if (monsterHealths[i] <= 0) {
      const btnMinus1 = document.getElementById(`minus1Health${i}`);
      const btnMinus5 = document.getElementById(`minus5Health${i}`);
      const btnMinus20 = document.getElementById(`minus20Health${i}`);
      const btnPlus1 = document.getElementById(`plus1Health${i}`);
      const hpDisplay = document.getElementById(`${i}Health`);

      if (btnMinus1) btnMinus1.disabled = true
        btnMinus1.hidden = true;
      if (btnMinus5) btnMinus5.disabled = true;
        btnMinus5.hidden = true;
      if (btnMinus20) btnMinus20.disabled = true;
        btnMinus20.hidden = true;
      if (btnPlus1) btnPlus1.disabled = true;
        btnPlus1.hidden = true;
      if (hpDisplay) hpDisplay.textContent = `HP: 0`;
        hpDisplay.hidden = true;
      monsterHealths[i] = 100;
    }
  }
}

function summon(monster){
  const existingMonster = document.getElementById(monster.name);
  if (existingMonster) {
      createButtons(monster, existingMonster);
    }
    else {
        console.log(monster);
        freshMonster = document.createElement("div");
        freshMonster.classList.add("monsterDescription");
        freshMonster.id = `${monster.name}`;
        freshMonster.style.padding = '1rem';
        freshMonster.style.boxSizing = 'border-box';
        freshMonster.style.backgroundColor = 'rgb(202, 210, 218)';
        freshMonster.style.border = 'darkmagenta 2px dashed';
        freshMonster.style.minWidth = '220px';
        freshMonster.style.borderRadius = '6px';
        monsterDiv.appendChild(freshMonster);
        
        freshMonster.innerHTML = `
        <h2>${monster.name}</h2>
        <pre>${monster.pack}</pre>
        <pre>HP: ${monster.HP}</pre>
        <pre>AC: ${monster.AC}</pre>
        <pre>Speed: ${monster.speed}</pre>
        <pre>CR: ${monster.CR}, XP: ${monster.XP}</pre>
        <pre>${monster.stats}</pre>
        <pre>${monster.skills}</pre>
        <pre>${monster.attributes}</pre>
        <pre>${monster.actions}</pre>
        <pre>${monster.legendaryActions}</pre>`;

        createButtons(monster,freshMonster);
    }
}

function createButtons(monster,div){
    monsterHealths.push(monster.HP);
    freshHealth = document.createElement("div");
    freshHealth.classList.add("monsterHealth");
    freshHealth.id = `${monster.name}Health`;
    div.appendChild(freshHealth);
    
    freshHealth.innerHTML = `
    <button class="minus1health" id="minus1Health${monsterHealths.length-1}">-1</button>
    <button class="minus5health" id="minus5Health${monsterHealths.length-1}">-5</button>
    <button class="minus20health" id="minus20Health${monsterHealths.length-1}">-20</button>
    <button class="plus1health" id="plus1Health${monsterHealths.length-1}">+1</button>
    <p id="${monsterHealths.length-1}Health">HP: ${monster.HP}</p>`;

    buttonChanges = [1,5,20];
    for (let i = 0; i < buttonChanges.length; i++) {
      console.log(`minus${buttonChanges[i]}Health${monsterHealths.length-1}`);
      document.getElementById(`minus${buttonChanges[i]}Health${monsterHealths.length-1}`).addEventListener("click", (e) => {
          id = parseInt(e.currentTarget.id.replace(`minus${buttonChanges[i]}Health`, ""));
          monsterHealths[id] -= buttonChanges[i];
          document.getElementById(`${id}Health`).textContent = `HP: ${monsterHealths[id]}`;
          checkHealths();
      })
    };
    document.getElementById(`plus1Health${monsterHealths.length-1}`).addEventListener("click", (e) => {
        id = parseInt(e.currentTarget.id.replace(`plus1Health`, ""));
        monsterHealths[id] += 1;
        document.getElementById(`${id}Health`).textContent = `HP: ${monsterHealths[id]}`;
        checkHealths();
    });
}


    
/*function renderScenario(scenario) {
  const container = document.getElementById('scenarioContainer');
  container.innerHTML = ''; // clear existing

  const header = document.createElement('h3');
  header.textContent = `Total XP: ${scenario.total_xp || 0}`;
  container.appendChild(header);

  const list = document.createElement('ul');
  (scenario.monsters || []).forEach(m => {
    const li = document.createElement('li');
    li.textContent = `${m.name} — HP: ${m.HP} AC: ${m.AC} XP: ${m.XP}`;
    list.appendChild(li);
  });
  container.appendChild(list);
}*/

// Expose helpers for manual testing from DevTools (some script loaders run in module scope)
if (typeof window !== 'undefined') {
  window.checkHealths = checkHealths;
  window.monsterHealths = monsterHealths;
  window.summon = summon;
}