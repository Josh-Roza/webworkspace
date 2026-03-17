function advancedButtonClicked() {
    console.log("Advanced button clicked");
    if (document.getElementById("Advanced").textContent === "Advanced") {
        switchToAdvanced();
    } else {
        switchToSimple();
    }
}

function switchToAdvanced() {
    document.getElementById("bossFight").disabled = false;
    document.getElementById("horde").disabled = false;
    document.getElementById("ranged").disabled = false;
    document.getElementById("melee").disabled = false;
    document.getElementById("abundanceSlider").disabled = false;
    document.getElementById("meleeRangedSlider").disabled = false;
    document.getElementById("monsterPackDiv").disabled = false;
    document.getElementById("bossFight").style.display = "block";
    document.getElementById("horde").style.display = "block";
    document.getElementById("ranged").style.display = "block";
    document.getElementById("melee").style.display = "block";
    document.getElementById("abundanceSlider").style.display = "";
    document.getElementById("meleeRangedSlider").style.display = "";
    document.getElementById("abundanceSliderDiv").style.display = "flex";
    document.getElementById("rangeMeleeSliderDiv").style.display = "flex";
    document.getElementById("monsterPackDiv").style.display = "flex";
    document.getElementById("Advanced").textContent = "Simple";
}

function switchToSimple() {
    document.getElementById("advancedButtonDiv").disabled = true; //change later for advanced settings
    document.getElementById("bossFight").disabled = true;
    document.getElementById("horde").disabled = true;
    document.getElementById("ranged").disabled = true;
    document.getElementById("melee").disabled = true;
    document.getElementById("abundanceSlider").disabled = true;
    document.getElementById("meleeRangedSlider").disabled = true;
    document.getElementById("monsterPackDiv").disabled = true;
    document.getElementById("advancedButtonDiv").style.display = "none"; //change later for advanced settings
    document.getElementById("bossFight").style.display = "none";
    document.getElementById("horde").style.display = "none";
    document.getElementById("ranged").style.display = "none";
    document.getElementById("melee").style.display = "none";
    document.getElementById("abundanceSliderDiv").style.display = "none";
    document.getElementById("rangeMeleeSliderDiv").style.display = "none";
    document.getElementById("monsterPackDiv").style.display = "none";
    document.getElementById("Advanced").textContent = "Advanced";
    console.log("yep")
}
//generate a scenario with the attributes from the website, then save the information in a json file.
function generateScenario() {
    console.log("Generate Scenario button clicked");
    var playerNumber = document.getElementById("playerNumber").value;
    var partyLvl = document.getElementById("partyLvl").value;
    var scenarioDifficulty = document.getElementById("scenarioDifficulty").value;
    if (document.getElementById("Advanced").textContent === "Advanced") {
        var monsterPack = document.getElementById("monsterPack").value;
        var monsterAbundance = document.getElementById("abundanceSlider").value;
        var rangeMelee = document.getElementById("meleeRangedSlider").value;
    }

    // prepare payload (send monster names and counts)
    const payload = {
        playerNumber: Number(playerNumber) || 1,
        partyLvl: Number(partyLvl) || 1,
        scenarioDifficulty: scenarioDifficulty,
        monsterPack: monsterPack || null,
        monsterAbundance: Number(monsterAbundance) || null,
        rangeMelee: Number(rangeMelee) || null,
        selectedMonsters: (window._addedMonsters || []).map(m => ({name: m.name, count: m.count || 1})),
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const csrftoken = getCookie('csrftoken');
    console.log('csrftoken:', csrftoken);

    // POST to server API, save response to sessionStorage and open scenViewer
    fetch('/api/generateEncounter/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken || ''
        },
        body: JSON.stringify(payload)
    }).then(async (resp) => {
        if (!resp.ok) {
            const text = await resp.text();
            console.error('Generate failed', resp.status, text);
            alert('Failed to generate scenario');
            return;
        }
        const data = await resp.json();
        // save scenario for scenViewer to read
        sessionStorage.setItem('lastScenario', JSON.stringify(data));
        // navigate to scenViewer page
        window.location.href = '/scenViewer/';
    }).catch((err) => {
        console.error('Generate error', err);
        alert('Error generating scenario');
    });
}


//The page starts with the simple settings
switchToSimple();

// Manage added monsters list and UI
// Wrap setup in DOMContentLoaded to ensure elements exist
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('scenGen_js: DOM ready, setting up add-monster handlers');
        window._addedMonsters = window._addedMonsters || [];
        const addBtn = document.getElementById('addMonsterButton');
        const resultsSelect = document.getElementById('monsterResults');
        const addedContainer = document.getElementById('addedMonsters');

        function renderAdded() {
            if (!addedContainer) return;
            addedContainer.innerHTML = '';
            window._addedMonsters.forEach(m => {
                const p = document.createElement('p');
                p.className = 'added-monster';
                p.setAttribute('data-id', m.id);
                // name
                const nameSpan = document.createElement('span');
                nameSpan.className = 'added-name';
                nameSpan.textContent = m.name;
                p.appendChild(nameSpan);
                // quantity controls
                const qty = document.createElement('span');
                qty.className = 'added-qty';
                qty.textContent = ` x${m.count || 1}`;
                qty.style.marginLeft = '8px';
                p.appendChild(qty);
                const inc = document.createElement('button');
                inc.type = 'button';
                inc.className = 'inc-monster';
                inc.textContent = '+';
                inc.style.marginLeft = '8px';
                const dec = document.createElement('button');
                dec.type = 'button';
                dec.className = 'dec-monster';
                dec.textContent = '−';
                dec.style.marginLeft = '4px';
                const remove = document.createElement('button');
                remove.type = 'button';
                remove.className = 'remove-monster';
                remove.textContent = 'Remove';
                remove.style.marginLeft = '8px';
                p.appendChild(inc);
                p.appendChild(dec);
                p.appendChild(remove);
                addedContainer.appendChild(p);
            });
        }

        if (addBtn && resultsSelect) {
            addBtn.addEventListener('click', function(){
                console.log('Add Monster clicked');
                const val = resultsSelect.value;
                const text = resultsSelect.options[resultsSelect.selectedIndex] ? resultsSelect.options[resultsSelect.selectedIndex].text : '';
                // if there's no selection but user typed a name, add that name
                if (!val) {
                    const typed = (document.getElementById('monsterSearch') || {}).value || '';
                    if (typed && typed.trim()) {
                        const name = typed.trim();
                        const existing = window._addedMonsters.find(m => m.name === name && (m.id === null || m.id === undefined));
                        if (existing) {
                            existing.count = (existing.count || 1) + 1;
                        } else {
                            window._addedMonsters.push({id: null, name: name, count: 1});
                        }
                        renderAdded();
                        return;
                    }
                    // otherwise show a little feedback
                    console.log('No monster selected and no name typed');
                    alert('Please select a monster from the dropdown or type a monster name and try Add.');
                    return;
                }
                // allow duplicates by incrementing count if exists
                const existing = window._addedMonsters.find(m => String(m.id) === String(val));
                if (existing) {
                    existing.count = (existing.count || 1) + 1;
                } else {
                    window._addedMonsters.push({id: val, name: text, count: 1});
                }
                renderAdded();
            });
        } else {
            console.log('Add button or results select not found', {addBtn: !!addBtn, resultsSelect: !!resultsSelect});
        }

        // delegate remove
        if (addedContainer) {
            addedContainer.addEventListener('click', function(e){
                if (e.target.classList.contains('remove-monster')) {
                    const p = e.target.closest('.added-monster');
                    if (!p) return;
                    const id = p.getAttribute('data-id');
                    // remove all entries matching id (or name if id null)
                    window._addedMonsters = window._addedMonsters.filter(m => String(m.id) !== String(id));
                    renderAdded();
                    return;
                }
                if (e.target.classList.contains('inc-monster')) {
                    const p = e.target.closest('.added-monster');
                    if (!p) return;
                    const id = p.getAttribute('data-id');
                    const item = window._addedMonsters.find(m => String(m.id) === String(id));
                    if (item) { item.count = (item.count || 1) + 1; renderAdded(); }
                    return;
                }
                if (e.target.classList.contains('dec-monster')) {
                    const p = e.target.closest('.added-monster');
                    if (!p) return;
                    const id = p.getAttribute('data-id');
                    const item = window._addedMonsters.find(m => String(m.id) === String(id));
                    if (item) {
                        item.count = (item.count || 1) - 1;
                        if (item.count <= 0) {
                            window._addedMonsters = window._addedMonsters.filter(m => String(m.id) !== String(id));
                        }
                        renderAdded();
                    }
                    return;
                }
            });
        }
        // initial render if any
        renderAdded();
    } catch (err) {
        console.error('Error setting up add-monster handlers', err);
    }
});
