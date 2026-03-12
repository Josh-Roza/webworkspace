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


