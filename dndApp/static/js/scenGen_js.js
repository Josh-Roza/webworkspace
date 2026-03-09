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
    document.getElementById("bossFight").hidden = false;
    document.getElementById("horde").hidden = false;
    document.getElementById("ranged").hidden = false;
    document.getElementById("melee").hidden = false;
    document.getElementById("abundanceSlider").hidden = false;
    document.getElementById("meleeRangedSlider").hidden = false;
    document.getElementById("monsterPackDiv").hidden = false;
    document.getElementById("Advanced").textContent = "Simple";
}

function switchToSimple() {
    document.getElementById("bossFight").disabled = true;
    document.getElementById("horde").disabled = true;
    document.getElementById("ranged").disabled = true;
    document.getElementById("melee").disabled = true;
    document.getElementById("abundanceSlider").disabled = true;
    document.getElementById("meleeRangedSlider").disabled = true;
    document.getElementById("monsterPackDiv").disabled = true;
    document.getElementById("bossFight").hidden = true;
    document.getElementById("horde").hidden = true;
    document.getElementById("ranged").hidden = true;
    document.getElementById("melee").hidden = true;
    document.getElementById("abundanceSlider").hidden = true;
    document.getElementById("meleeRangedSlider").hidden = true;
    document.getElementById("monsterPackDiv").hidden = true;
    document.getElementById("Advanced").textContent = "Advanced";
}

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

    // prepare payload
    const payload = {
        playerNumber: Number(playerNumber) || 1,
        partyLvl: Number(partyLvl) || 1,
        scenarioDifficulty: scenarioDifficulty,
        monsterPack: monsterPack || null,
        monsterAbundance: Number(monsterAbundance) || null,
        rangeMelee: Number(rangeMelee) || null,
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const csrftoken = getCookie('csrftoken');

    // POST to server API, save response to sessionStorage and open scenViewer
    fetch('/api/generateEncounter/', {
        method: 'POST',
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



switchToSimple();


