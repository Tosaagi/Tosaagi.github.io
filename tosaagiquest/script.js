import { modifyText, fadeOut, verticalWipe, verticalWipeOut } from "./effects.js";

const initializeStats = {
    pName: "Player",
    lvl: 1,
    xP: 0,
    xPR: 10,
    hP: 10,
    mxHP: 10,
    def: 1,
    str: 1,
    aP: 2,
    mxAP: 2,
    gP: 10,
    uP: 0,
    cWI: 0,

    fI: null,
    lE: "",
    cCI: 1,
    cTI: 0,

    mNm: "",
    mHP: 0,
    mS: 0,
    mSC: 0,
    mCSI: 0
}; 

const weapons = [
    {
        name: "Wooden Stick",
        power: 1,
        price: 10
    },
    {
        name: "Silver Dagger",
        power: 5,
        price: 30
    },
    {
        name: "Claw Hammer",
        power: 15,
        price: 70
    },
    {
        name: "Glass Sword",
        power: 30,
        price: 150
    }
];

const monsters = [
    {
        name: "Slime",
        color: "green",
        level: 1,
        health: 5,
        strength: 0,
        damageSpread: 1,
        skills: {
                name: ["Basic Attack", "Heavy Slam"],
                cooldown: [0, 1],
                extraDamage: [0, 2]
            },
        loot: {
            gold: 10,
            xp: 2
        }
    },
    {
        name: "Fanged Beast",
        color: "darkRed",
        level: 2,
        health: 15,
        strength: 5,
        damageSpread: 2,
        skills: {
                name: ["Bite", "Bloodlust Fang"],
                cooldown: [0, 3],
                extraDamage: [0, 5]
            },
        loot: {
            gold: 50,
            xp: 10
        }
    },
    {
        name: "Dragon",
        color: "blueViolet",
        level: 20,
        health: 300,
        strength: 40,
        damageSpread: 12,
        skills: {
                name: ["Claws", "Fire Breath"],
                cooldown: [0, 3],
                extraDamage: [0, 60]
            },
        loot: {
            gold: 500,
            xp: 100
        }
    }
];

const scenes = [
    {
        id: "mainScreen",
        name: "Main-Screen",
        buttonTexts: ["New Adventure!", "God Mode"],
        buttonFunctions: ["prologue", godMode],
        text: `Welcome to <span class="title">Tosaagi's Quest</span>! Explore the land of Morrdevar, fight evil monsters, and beat the cursed dragon! Are you ready to make your choices?`,
        image: `<img src="assets/images/scenes/title_scene.gif">`,
        style: {
            "justify-content": "center",
            "align-items": "center",
            "text-align": "center"
        }
    },
    {
        id: "prologue",
        name: "Introduction",
        buttonTexts: ["Begin Adventure!"],
        buttonFunctions: [goTown],
        text: `&nbsp; &nbsp; <span class="underlined">Prologue</span> <br><br>&nbsp; &nbsp; A mysterious flow of magic has always found its way to spread throughout the continent of Esparthia. While some—beasts and men—acknowledge its incredible power and try to harness it to its fullest, many have fallen victim to the unspeakable curse, and doomed to eternity.<br><br>&nbsp; &nbsp; Despite the inevitable risks, the battle for control of this dangerous substance grows ever stronger. <br><br>&nbsp; &nbsp; However, even amidst the chaos that ensues, a noble hero will come to end it all...`
    },
    {
        id: "upgradePlayerStat",
        name: "Upgrade-Player-Stat-Scene",
        buttonTexts: ["Upgrade Max Health", "Upgrade Strength", "Upgrade Defense", "Go Town"],
        buttonFunctions: [upgradeMaxHp, upgradeStrength, upgradeDefense, goTown],
        text: "Select one of the stats below that you wish to upgrade (consumes 1 Upgrade Point)."
    },
    {
        id: "firstTown",
        name: "Town-Square",
        buttonTexts: ["Go to Store", "Go to Cave", "Fight Dragon"],
        buttonFunctions: [goStore, goCave, fightDragon],
        locations: [
            {
                id: "newbieStore",
                name: "Store",
                buttonTexts: ["Restore HP (10 GP)", "Buy weapon (GP)", "Go to town square"],
                buttonFunctions: [buyHealth, buyWeapon, goTown],
                text: "You enter the store."
            },
            {
                id: "newbieCave",
                name: "Cave",
                buttonTexts: ["Fight Slime", "Fight Fanged Beast", "Go to Town Square"],
                buttonFunctions: [fightSlime, fightBeast, goTown],
                text: "You enter the cave. You see some monsters."
            }
        ],
        text: `You are in Morrdevar, the starting town. You see a store and a quest board.`,
        image: `<img src="assets/images/scenes/main_town.gif">`
    },
    {
        id: "fight",
        name: "Fight",
        buttonTexts: ["Attack", "Defend", "Escape"],
        buttonFunctions: [attack, defend, goTown],
        text: "You are fighting a monster."
    },
    {
        id: "victory",
        name: "kill-Monster",
        buttonTexts: ["Go to town square"],
        buttonFunctions: [goTown],
        text: `The monster screams "Arg!" as it dies. You gain experience points and found some golds.`
    },
    {
        id: "defeat",
        name: "Lose",
        buttonTexts: ["REPLAY?"],
        buttonFunctions: [restart],
        text: "You died. &#x2620;"
    },
    {
        id: "end",
        name: "Win",
        buttonTexts: ["REPLAY?"],
        buttonFunctions: [restart],
        text: "You defeated the dragon! YOU WIN THE GAME! &#x1F389;"
    }
];

// Audio Assets
const attackSound = new Audio("./assets/sounds/swordSlash_2.mp3");

// Game Variables
let fighting = initializeStats.fI;
let logEntry = initializeStats.lE;
let currentCombatIndex = initializeStats.cCI;
let currentTurnIndex = initializeStats.cTI;
let weaponPrice;
let textMessage;
let texts = [];

// Player Stats Initialization
let playerName = initializeStats.pName;
let playerLevel = initializeStats.lvl;
let playerXp = initializeStats.xP;
let playerNextLevelMinXp = initializeStats.xPR;
let playerHealth = initializeStats.hP;
let playerMaxHealth = initializeStats.mxHP;
let playerDefense = initializeStats.def;
let playerStrength = initializeStats.str;
let playerActionPoints = initializeStats.aP; // to be used
let playerMaxActionPoints = initializeStats.mxAP; // to be used
let playerGold = initializeStats.gP;
let playerUpgradePoints = initializeStats.uP;
let currentWeaponIndex = initializeStats.cWI;
let playerDamage;
let playerDefend = false;
let playerInventory = [weapons[0].name];

// Monster Stats Initialization
let monsterName = initializeStats.mNm;
let monsterHealth = initializeStats.mHP;
let monsterSkill = initializeStats.mS;
let monsterSkillCooldown = initializeStats.mSC;
let monsterCurrentSkillIndex = initializeStats.mCSI;
let monsterDamage;

// Modifications
let playerNameTextModified = modifyText(playerName, "yellow", 3);
let monsterNameTextModified;

// Game DOM
const fullStats = document.querySelector("#full-stats");
const shortStats = document.querySelector("#short-stats");
const monsterHealthBar = document.querySelector("#monsterHealthBar");
const transition = document.querySelector("#transition");
const buttons = document.querySelector("#controls");
const text = document.querySelector("#text");
const combatLogs = document.querySelector("#combat-logs");

// Buttons
const upgradeStatButton = document.querySelector("#upgradeStatButton");
upgradeStatButton.onclick = (() => changeScene("upgradePlayerStat"));

const button0 = document.querySelector("#button0");
button0.onclick = checkStats;

let controlButtons = [];
const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector('#button3');
const button4 = document.querySelector('#button4');
const button5 = document.querySelector('#button5');
const button6 = document.querySelector('#button6');
const button7 = document.querySelector('#button7');
controlButtons.push(button1, button2, button3, button4, button5, button6, button7);

// Player Stats DOM
const playerNameText = document.querySelector("#playerNameText");
const playerLevelText = document.querySelector("#playerLevelText");
const playerHealthText = document.querySelector("#playerHealthText");
const playerExperienceText = document.querySelector("#playerExperienceText");
const playerStrengthText = document.querySelector("#playerStrengthText");
const playerDefenseText = document.querySelector("#playerDefenseText");
const playerGoldText = document.querySelector("#playerGoldText");
const playerUpgradePointsText = document.querySelector("#playerUpgradePointsText");
const playerLevelQuickText = document.querySelector("#game-levelText");
const playerHealthQuickText = document.querySelector("#game-healthText")
const playerGoldQuickText = document.querySelector("#game-goldText");

// Monster Stats DOM 
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

// Game Methods
function changeScene(sceneId, locationId = null) {
    texts = [];
    let [currentScene] = scenes.filter((scene) => scene.id === sceneId);

    monsterStats.style.display = "none";

    if (locationId !== null) {
        [currentScene] = currentScene.locations.filter((location) => location.id === locationId);
        updateTexts(currentScene.text, currentScene.image);
    } else {
        updateTexts(currentScene.text, currentScene.image);
        texts = [];
    }

    if (currentScene.style) {
        text.style.justifyContent = [currentScene.style["justify-content"]];
        text.style.alignItems = [currentScene.style["align-items"]];
        text.style.textAlign = [currentScene.style["text-align"]];
    } else {
        text.style.justifyContent = "flex-start";
        text.style.alignItems = "flex-start";
        text.style.textAlign = "left";
    }

    if (playerUpgradePoints > 0) {
        upgradeStatButton.style.display = "block";
    } else {
        upgradeStatButton.style.display = "none";
    }

    text.style.height = "310px";

    controlButtons.forEach((button, index) => {
        let currentButtonFunction = currentScene.buttonFunctions[index];
        if (currentButtonFunction) {
            button.style.display = "block";
            button.innerText = currentScene.buttonTexts[index];

            if (typeof currentButtonFunction === "function") {
                button.onclick = currentButtonFunction;
            } else {
                button.onclick = (() => changeScene(currentButtonFunction));
            }
            // let buttonFunction = currentScene.buttonFunctions[index];

            // button.addEventListener("click", async function() {
            //     fadeOut(text);

            //     await new Promise(resolve => {
            //         setTimeout(resolve, 5000);
            //     });

            //     buttonFunction();
            // });
        } else {
            button.style.display = "none";
        }
    });

    buttons.style.display = "block";
    combatLogs.style.display = "none";
}

function updateTexts(string, image = null) {
    texts.push(string);
    if (texts.length > 10) {
        texts.shift();
    }

    text.innerHTML = texts.reduce((acc, string) => acc + `<p>${string}</p>`, "");

    if (image) {
        text.innerHTML = image + text.innerHTML;
    }

    if (texts.length > 3) {
        text.scrollTo(0, text.scrollHeight);
    }
}

function logEntryUpdate(log) {
    if (log === "newTurn"){
        combatLogs.innerHTML = (`<span id='combat-log' class='grey'><span></span><span>Turn: ${currentTurnIndex}</span></span>${combatLogs.innerHTML}`);
    } else {
        combatLogs.innerHTML = (`<span id='combat-log'>${log}</span>${combatLogs.innerHTML}`);
        currentCombatIndex++;
    }
}

function convertXptoLevel() {
    while ((playerXp) >= playerNextLevelMinXp) {
        playerXp -= playerNextLevelMinXp;
        playerLevel++;
        playerNextLevelMinXp += ((playerLevel - 1) * 10);
        playerUpgradePoints += 2;
    }

    playerLevelQuickText.innerText = playerLevel;
}

function getDamage(damage, damageRng) {
    return (Math.floor((Math.random() * damageRng) + 1) - Math.floor((damageRng / 2))) + damage;
}

function godMode() {
    playerMaxHealth = 200;
    playerHealth = 200;
    playerGold = 9999;
    playerStrength = 20;
    playerDefense = 20;
    playerLevel = 99;

    playerLevelQuickText.innerText = 99;
    playerHealthQuickText.innerText = 200;
    playerGoldQuickText.innerText = 9999;

    logEntryUpdate("God mode activated.");
}

// Player Actions
function goTown() { // add parameter to tell which town
    verticalWipe(transition);

    setTimeout(() => {
        changeScene("firstTown");

        fighting = null;
        monsterName = "";
        monsterHealth = 0;
        monsterCurrentSkillIndex = 0;

        verticalWipeOut(transition);
    }, 400);
}

function goStore() {
    verticalWipe(transition);

    setTimeout(() => {
        changeScene("firstTown", "newbieStore");

        weaponPrice = weapons[currentWeaponIndex + 1].price;
        button2.innerText = `Buy weapon (${weaponPrice} GP)`;

        verticalWipeOut(transition);
    }, 400);
}

function goCave() {
    verticalWipe(transition);

    setTimeout(() => {
        changeScene("firstTown", "newbieCave");

        verticalWipeOut(transition);
    }, 400);
}

function goFight() {
    verticalWipe(transition);

    setTimeout(() => {
        changeScene("fight");

        monsterName = monsters[fighting].name;
        monsterHealth = monsters[fighting].health;
        monsterSkill = monsters[fighting].skills;

        monsterStats.style.display = "block";
        monsterNameText.innerText = monsters[fighting].name;
        monsterNameTextModified = modifyText(monsters[fighting].name, monsters[fighting].color, 3);
        monsterHealthText.innerText = monsters[fighting].health;
        monsterHealthBar.style.width = ("100%");
        text.style.height = "calc(310px - 32px)";

        currentCombatIndex = 1;
        currentTurnIndex = 0;
        monsterSkillCooldown = 0;

        buttons.style.display = "flex";

        combatLogs.style.display = "flex";
        combatLogs.innerHTML = "<span id='combat-log'><span>[<span class='grey'>0</span>]<span class='grey'>Battle start.</span></span></span>";
        combatLogs.innerHTML += "<hr>";

        verticalWipeOut(transition);
    }, 400);
}

function fightSlime() {
    fighting = 0;
    goFight();
}

function fightBeast() {
    fighting = 1;
    goFight();
}

function fightDragon() {
    fighting = 2;
    goFight();
}

function attack() {
    currentTurnIndex++;
    logEntryUpdate("newTurn");

    playerDamage = playerStrength + weapons[currentWeaponIndex].power; // player damage
    monsterHealth -= playerDamage;
    monsterHealthBar.style.width = ((monsterHealth / monsters[fighting].health) * 100 + "%");
    monsterHealthText.innerText = monsterHealth;

    attackSound.play();
    logEntry = `<span>[${modifyText(currentCombatIndex, "grey", 2)}]</span><span> ${playerNameTextModified} deals ${modifyText(playerDamage, "damageRed", 2)} damage to ${monsterNameTextModified} using [${weapons[currentWeaponIndex].name}].</span>`;
    logEntryUpdate(logEntry);

    // check battle condition
    if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    } else {
        // monster turn
        monsterTurn();
    }

    console.log("Player Damage: " + playerDamage);
}

function defend() {
    playerDefend = true;
    currentTurnIndex++;
    logEntryUpdate("newTurn");

    logEntry = `<span>[${modifyText(currentCombatIndex, "grey", 2)}]</span><span> ${modifyText(playerName, "yellow", 3)} defend.</span>`;
    logEntryUpdate(logEntry);

    monsterTurn();
}

// Player Stats Upgrade Functions
function upgrade(stat) {
    if (playerUpgradePoints > 0) {
        switch (stat) {
            case "maxHp":
                let oldMaxHealth = playerMaxHealth;
                playerMaxHealth += 10;
                playerHealth += 10;
                playerHealthQuickText.innerText = playerHealth;
                playerHealthText.innerText = `${playerHealth}/${playerMaxHealth}`
                textMessage = `You've increased your max HP (${oldMaxHealth} -> ${playerMaxHealth}).`;
                break;
            case "strength":
                let oldStrength = playerStrength;
                playerStrength += 1;
                playerStrengthText.innerText = playerStrength;
                textMessage = `You've increased your max STR (${oldStrength} -> ${playerStrength}).`;
                break;
            case "defense":
                let oldDefense = playerDefense;
                playerDefense += 1;
                playerDefenseText.innerText = playerDefense;
                textMessage = `You've increased your max DEF(${oldDefense} -> ${playerDefense}).`;
                break;
        }

        playerUpgradePoints -= 1;
        
        if (playerUpgradePoints <= 0) {
            upgradeStatButton.style.display = "none";
        }

    } else {
        textMessage = "You don't have enough UP.";
    }

    console.log(playerUpgradePoints);
    updateTexts(textMessage);
}

function upgradeMaxHp() {
    upgrade("maxHp");
}

function upgradeStrength() {
    upgrade("strength");
}

function upgradeDefense() {
    upgrade("defense");
}

// Player Options
function checkStats() {
    fullStats.style.display = "block";
    shortStats.style.display = "none";

    playerNameText.innerText = `"${playerName}"`;
    playerLevelText.innerText = playerLevel;
    playerHealthText.innerText = `${playerHealth}/${playerMaxHealth}`;
    playerExperienceText.innerText = playerXp;
    playerStrengthText.innerText = playerStrength;
    playerDefenseText.innerText = playerDefense;
    playerGoldText.innerText = playerGold;
    playerUpgradePointsText.innerText = playerUpgradePoints;
    button0.innerText = "close";
    button0.onclick = closeStats;

    monsterStats.style.display = "none";
    combatLogs.style.display = "none";
    buttons.style.display = "none";
    text.style.display = "none";
}

function closeStats() {
    if (fighting !== null) {
        monsterStats.style.display = "block";
        combatLogs.style.display = "flex";
        buttons.style.display = "flex";
    } else {
        buttons.style.display = "block";
    }

    fullStats.style.display = "none";
    shortStats.style.display = "flex";
    button0.innerText = "stats";
    button0.onclick = checkStats;
    text.style.display = "flex";
}

function buyHealth() {
    if (playerHealth < playerMaxHealth) {
        if (playerGold >= 10) {
            playerGold -= 10;
            if ((playerHealth + 10) >= playerMaxHealth) {
                playerHealth = playerMaxHealth;
            } else {
                playerHealth += 10;
            }

            playerGoldQuickText.innerText = playerGold;
            playerHealthQuickText.innerText = playerHealth;
            textMessage = "You've restored HP.";
        } else {
            textMessage = "You do not have enough gold to buy HP.";
        }
    } else {
        textMessage = "You're already at max HP.";
    }

    updateTexts(textMessage);
}

function buyWeapon() {
    if (currentWeaponIndex < weapons.length - 1) {
        if (playerGold >= weaponPrice) { // cwi = 2
            playerGold -= weaponPrice;
            currentWeaponIndex++; //cwi = 3

            // 
            if (currentWeaponIndex !== weapons.length - 1) {
                weaponPrice = weapons[currentWeaponIndex + 1].price;
                button2.innerText = `Buy weapon (${weaponPrice} GP)`;
            } 

            let newWeapon = weapons[currentWeaponIndex].name;
            playerInventory.push(newWeapon);

            playerGoldQuickText.innerText = playerGold;
            textMessage = `You now have a ${newWeapon}.`;
            textMessage += ` In your inventory you have:\n${playerInventory}`;

        } else {
            textMessage = "You do not have enough GP to buy a weapon.";
        }
    } else {
        weaponPrice = weapons[0].price;

        textMessage = "You already have the most powerful weapon!";
        button2.innerText = "Sell weapon for 15 GP";
        button2.onclick = sellWeapon;
    }

    updateTexts(textMessage);
}

function sellWeapon() {
    if (playerInventory.length > 1) {
        playerGold += (weaponPrice - (Math.floor(weaponPrice / 2)));
        weaponPrice = weapons[playerInventory.length - 1].price;
        let currentWeapon = playerInventory.shift();

        playerGoldQuickText.innerText = playerGold;
        textMessage = `You sold a ${currentWeapon}.`;
        textMessage += ` In your inventory you have: ${playerInventory}`;
    } else {
        textMessage = "You cannot sell your only weapon.";
    }

    updateTexts(textMessage);
}

// Monsters Actions
function monsterTurn() {
    monsterDamage = getDamage(monsters[fighting].strength, monsters[fighting].damageSpread) + monsterSkill.extraDamage[monsterCurrentSkillIndex];
    if (playerDefend === true) {
        monsterDamage -= (playerDefend * 10);
    } else {
        monsterDamage -= playerDefend;
    }

    playerDefend = false;
        
    if (monsterDamage <= 0) {
        monsterDamage = 1;
        playerHealth--;
    } else {
        playerHealth -= monsterDamage;
    }

    playerHealthQuickText.innerText = playerHealth;

    logEntry = `<span>[${modifyText(currentCombatIndex, "grey", 2)}]</span><span> ${monsterNameTextModified} deals ${modifyText(monsterDamage, "damageRed", 2)} damage to ${playerNameTextModified} using [${monsterSkill.name[monsterCurrentSkillIndex]}].</span>`;
    logEntryUpdate(logEntry);
    
    monsterPreparesAttack();

    if (playerHealth <= 0) {
        lose();
    }

    if ((monsterSkill.cooldown[(monsterSkill.cooldown.length) - 1]) + 1 === monsterSkillCooldown) {
        monsterSkillCooldown = 0;
        monsterCurrentSkillIndex = 0;
    }
    
    console.log("Monster Damage: " + monsterDamage);
}

function monsterPreparesAttack() {
    monsterSkillCooldown++;

    if (monsterSkill.cooldown.includes(monsterSkillCooldown) && monsterSkillCooldown !== 0) {

        logEntry = `<span>[${modifyText(currentCombatIndex, "grey", 2)}]</span><span> ${monsterNameTextModified} prepares a ${modifyText("special", "purple", 3)} attack.</span>`;
        logEntryUpdate(logEntry);
        monsterCurrentSkillIndex++;

    } else {
        logEntry = `<span>[${modifyText(currentCombatIndex, "grey", 2)}]</span><span> ${monsterNameTextModified} readies a basic attack.</span>`;
        logEntryUpdate(logEntry);
    }
}

function defeatMonster() {
    playerGold += Math.floor(Math.random() * 5) - 2 + monsters[fighting].loot.gold;
    playerXp += Math.floor(Math.random() * 2) + monsters[fighting].loot.xp;
    convertXptoLevel();
    fighting = null;

    playerGoldQuickText.innerText = playerGold;

    changeScene("victory");
}

// Game Conditions
function lose() {
    changeScene("defeat");
}

function winGame() {
    changeScene("end");
}

function restart() {
    location.reload();
}

changeScene("mainScreen");
