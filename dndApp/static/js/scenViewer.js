console.log('yep')

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
});

let monsterDiv = document.getElementById("monsterDiv");
let monsterHealths = [];

function summon(monster){
    if (pass){
        pass
        //if the monster is already there add another health mod
    }
    else {
        freshMonster = document.createElement("div");
        freshMonster.classList.add("monsterDescription");
        freshMonster.id = `${monster.name}`;
        monsterDiv.appendChild(freshMonster);
        freshMonster.innerHTML = `
        <h2>${monster[8]}</h2>
        <p>${monster[9]}</p>
        <p>HP: ${monster[2]}</p>
        <p>AC: ${monster[0]}</p>
        <P>Speed: ${monster[12]}</P>
        <P>CR: ${monster[1]}, XP: ${monster[3]})}</P>
        <p>${monster[13]}</p>
        <p>${monster[11]}</p>
        <p>${monster[5]}</p>
        <p>${monsters[4]}</p>
        <p>${monsters[7]}</p>`;
        monsterHealths.append(monster[2]);
        freshHealth = document.createElement("div");
        freshHealth.classList.add("monsterHealth");
        freshHealth.id = `${monster.name}Health`;
        freshMonster.appendChild(freshHealth);
        freshHealth.innerHTML = `
        <button class="minus1health" id="minus1Health${monsterHealths.length-1}>-1</button>
        <button class="minus5health" id="minus5Health${monsterHealths.length-1}>-5</button>
        <button class="minus20health" id="minus20Health${monsterHealths.length-1}>-20</button>
        <button class="plus1health" id="plus1health${monsterHealths.length-1}>+1</button>
        <p id="${monsterHealths.length-1}Health">HP: ${monster[2]}</p>`;
        buttonChanges = [1,5,20];
        for (let i = 0; i < buttonChanges.length; i++) {
          document.getElementById(`minus${buttonChanges[i]}Health${monsterHealths.length-1}`).addEventListener("click", () => {
              id = parseInt(this.id.replace(`minus${buttonChanges[i]}Health`, ""));
              monsterHealths[id] -= 1;
              document.getElementById(`${id}Health`).textContent = `HP: ${monsterHealths[id]}`;
          })
        };
        document.getElementById(`plus1Health${monsterHealths.length-1}`).addEventListener("click", () => {
            id = parseInt(this.id.replace(`plus1Health`, ""));
            monsterHealths[id] += 1;
            document.getElementById(`${id}Health`).textContent = `HP: ${monsterHealths[id]}`;
        });
    }
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