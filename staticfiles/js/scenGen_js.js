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
    document.getElementById("bossFight").hidden = false;
    document.getElementById("horde").hidden = false;
    document.getElementById("ranged").hidden = false;
    document.getElementById("melee").hidden = false;
    document.getElementById("abundanceSlider").hidden = false;
    document.getElementById("meleeRangedSlider").hidden = false;
    document.getElementById("Advanced").textContent = "Simple";
}

function switchToSimple() {
    document.getElementById("bossFight").disabled = true;
    document.getElementById("horde").disabled = true;
    document.getElementById("ranged").disabled = true;
    document.getElementById("melee").disabled = true;
    document.getElementById("abundanceSlider").disabled = true;
    document.getElementById("meleeRangedSlider").disabled = true;
    document.getElementById("bossFight").hidden = true;
    document.getElementById("horde").hidden = true;
    document.getElementById("ranged").hidden = true;
    document.getElementById("melee").hidden = true;
    document.getElementById("abundanceSlider").hidden = true;
    document.getElementById("meleeRangedSlider").hidden = true;
    document.getElementById("Advanced").textContent = "Advanced";
}

function generateScenario() {
    console.log("Generate Scenario button clicked");
    var playerNumber = document.getElementById("playerNumber").value;
    var partyLvl = document.getElementById("partyLvl").value;
    var scenarioDifficulty = document.getElementById("scenarioDifficulty").value;
    if (document.getElementById("Advanced").textContent === "Simple") {
        var monsterPack = document.getElementById("monsterPack").value;
    } else {
        var advMonsterPack = document.getElementById("advancedMonsterPack").value;
        var monsterAbundance = document.getElementById("abundanceSlider").value;
        var rangeMelee = document.getElementById("rangeMeleeSlider").value;
    }
}

switchToSimple();


