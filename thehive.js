const userInput = document.getElementById("userInput");
const errText = document.getElementById("errText");

// get tw stats elements
const twXP = document.getElementById("twXP");
const twTimesPlayed = document.getElementById("twTimesPlayed");
const twWins = document.getElementById("twWins");
const twFirstPlayed = document.getElementById("twFirstPlayed");
const twFinalKills = document.getElementById("twFinalKills");
const twKills = document.getElementById("twKills");
const twTreasuresDestroyed = document.getElementById("twTreasuresDestroyed");
const twDeaths = document.getElementById("twDeaths");
const twKDRatio = document.getElementById("twKDRatio");
const twPrestige = document.getElementById("twPrestige");

// get deathrun stats elements
const drXP = document.getElementById("drXP");
const drTimesPlayed = document.getElementById("drTimesPlayed");
const drWins = document.getElementById("drWins");
const drFirstPlayed = document.getElementById("drFirstPlayed");
const drDeaths = document.getElementById("drDeaths");
const drKills = document.getElementById("drKills");
const drCheckpoints = document.getElementById("drCheckpoints");
const drTrapsActivated = document.getElementById("drTrapsActivated");
const drKDRatio = document.getElementById("drKDRatio");

// get hide n seek elements
const hideXP = document.getElementById("hideXP");
const hideTimesPlayed = document.getElementById("hideTimesPlayed");
const hideWins = document.getElementById("hideWins");
const hideFirstPlayed = document.getElementById("hideFirstPlayed");
const hideDeaths = document.getElementById("hideDeaths");
const hideKDRatio = document.getElementById("hideKDRatio");
const hiderKills = document.getElementById("hiderKills");
const seekerKills = document.getElementById("seekerKills");

function handleErrors(response) {
  if (!response.ok) {
    errText.style.display = "block";
    errText.textContent = `Epic API Fail! Status code: ${response.status}`;
  }
  return response;
}

let coll = document.getElementsByClassName("collapsible");

for (let i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    let content = this.nextElementSibling;
    content.style.display = "grid";
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
      content.style.display = "inline";
    }
  });
}

function getStats(gamemode, statsFunction) {
  const username = userInput.value; // this will be used in the api request

  fetch(`https://api.playhive.com/v0/game/all/${gamemode}/${username}`)
    .then(handleErrors)
    .then((response) => {
      response.json().then(function (json) {
        errText.style.display = "none";
        statsFunction(json);
      });
    });
}

function onBtnClick() {
  getStats("wars", fillStatsWars);
  getStats("dr", fillStatsDeathRun);
  getStats("hide", fillStatsHide);
}

function unixToNormal(json) {
  let firstPlayedNormal = new Date(json.first_played * 1000).toLocaleDateString(
    "en-US"
  );

  return firstPlayedNormal;
}

function kdrCalc(jsonKills, jsonDeaths) {
  let kdRatio = jsonKills / jsonDeaths;
  kdRatio = kdRatio.toFixed(1);

  return kdRatio;
}

function kdrCalcHide(jsonHiderKills, jsonSeekerKills, jsonDeaths) {
  let totalKills = jsonHiderKills + jsonSeekerKills;
  let kdRatio = totalKills / jsonDeaths;
  kdRatio = kdRatio.toFixed(1);

  return kdRatio;
}

function fillStatsWars(json) {
  twXP.textContent = `XP: ${json.xp}`;
  twTimesPlayed.textContent = `Times played: ${json.played}`;
  twWins.textContent = `Wins: ${json.victories}`;
  twFirstPlayed.textContent = `First played: ${unixToNormal(json)}`;
  twFinalKills.textContent = `Final kills: ${json.final_kills}`;
  twKills.textContent = `Kills: ${json.kills}`;
  twTreasuresDestroyed.textContent = `Treasures destroyed: ${json.treasure_destroyed}`;
  twDeaths.textContent = `Deaths: ${json.deaths}`;
  twPrestige.textContent = `Prestige: ${json.prestige}`;
  twKDRatio.textContent = `K/D: ${kdrCalc(json.kills, json.deaths)}`;
}

function fillStatsDeathRun(json) {
  drXP.textContent = `XP: ${json.xp}`;
  drTimesPlayed.textContent = `Times played: ${json.played}`;
  drWins.textContent = `Wins: ${json.victories}`;
  drFirstPlayed.textContent = `First played: ${unixToNormal(json)}`;
  drDeaths.textContent = `Deaths: ${json.deaths}`;
  drCheckpoints.textContent = `Checkpoints reached: ${json.checkpoints}`;
  drTrapsActivated.textContent = `Traps activated ${json.activated}`;
  drKills.textContent = `Kills: ${json.kills}`;
  drKDRatio.textContent = `K/D: ${kdrCalc(json.kills, json.deaths)}`;
}

function fillStatsHide(json) {
  hideXP.textContent = `XP: ${json.xp}`;
  hideTimesPlayed.textContent = `Times played: ${json.played}`;
  hideWins.textContent = `Wins: ${json.victories}`;
  hideFirstPlayed.textContent = `First played: ${unixToNormal(json)}`;
  hideDeaths.textContent = `Deaths: ${json.deaths}`;
  hideKDRatio.textContent = `K/D: ${kdrCalcHide(
    json.hider_kills,
    json.seeker_kills,
    json.deaths
  )}`;
  hiderKills.textContent = `Hider kills: ${json.hider_kills}`;
  seekerKills.textContent = `Seeker kills: ${json.seeker_kills}`;
}
