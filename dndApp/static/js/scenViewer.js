//When the info is loaded retrieve the scenario data and call the summon function for all the monsters.
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

//When a button is clicked check if any health is less than or equal to 0, if so delete the correpsinding health bar
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

//make a div for the monster and add all the html elements with the attributes using innerHTML
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

//Create buttons to modify the health of each monster along with the monster health, add to the div with the descrition of that monster
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

// Save scenario to server
function saveScen() {
  try {
    console.log('saveScen invoked');
    const raw = sessionStorage.getItem('lastScenario');
    if (!raw) { showSaveMessage('No scenario to save'); console.warn('No scenario in sessionStorage'); return; }
    const payload = JSON.parse(raw);
    // optionally set a name
    const name = prompt('Save scenario as (optional name):', '');
    if (name !== null) payload.name = name;
    console.log('Saving scenario payload', payload);

    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    }
    const csrftoken = getCookie('csrftoken');

    // provide immediate UI feedback and remove the save button so it can't be clicked again
    const btn = document.getElementById('saveScenButton');
    if (btn) { try { btn.disabled = true; btn.remove(); } catch(e) { console.warn('Could not remove save button', e); } }

    fetch('/api/saveScenario/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrftoken || '' },
      body: JSON.stringify(payload),
      credentials: 'same-origin'
    }).then(async (resp) => {
      if (!resp.ok) {
        const text = await resp.text();
        showSaveMessage('Save failed: ' + resp.status);
        console.error('Save failed response', resp.status, text);
        return;
      }
      const data = await resp.json();
      // show inline save confirmation
      showSaveMessage('Scenario saved (id: ' + data.scenario_id + ')');
      // button removed after click
    }).catch(err => {
      console.error('Save error', err);
      showSaveMessage('Error saving scenario');
    });
  } catch (e) {
    console.error('SaveScen error', e);
    alert('Error saving scenario');
  }
}

// Attach handler to the button when DOM is ready
document.addEventListener('DOMContentLoaded', function(){
  try {
    const btn = document.getElementById('saveScenButton');
    if (btn) btn.addEventListener('click', saveScen);
    // also expose for console if desired
    window.saveScen = saveScen;
  } catch (e) {
    console.error('Failed to attach saveScen handler', e);
  }
});

// show a temporary message near top-right when scenario is saved
function showSaveMessage(msg) {
  try {
    let el = document.getElementById('saveScenMessage');
    if (!el) {
      el = document.createElement('p');
      el.id = 'saveScenMessage';
      el.setAttribute('role', 'status');
      el.style.position = 'fixed';
      el.style.top = '1rem';
      el.style.right = '1rem';
      el.style.background = 'rgba(117,45,180,0.95)';
      el.style.color = 'white';
      el.style.padding = '8px 12px';
      el.style.borderRadius = '6px';
      el.style.zIndex = 9999;
      el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.2)';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    // clear any existing hide timeout
    if (el._hideTimer) clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
      el.style.transition = 'opacity 400ms ease';
      el.style.opacity = '0';
      el._hideTimer = setTimeout(() => { try { el.remove(); } catch(e){} }, 450);
    }, 3000);
  } catch (e) {
    console.error('showSaveMessage error', e);
  }
}