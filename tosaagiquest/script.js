const initializeStats = {
    pName: "Player",
    lvl: 1,
    exp: 0,
    hP: 100,
    mxHP: 100,
    def: 1,
    str: 1,
    aP: 2,
    mxAP: 2,
    gP: 10,
    cWI: 0,

    fI: 0,
    lE: "",
    cCI: 1,

    mNm: "",
    mHP: 0,
    mS: 0,
    mSC: 0,
    mCSI: 0
};

const weapons = [
    {
        name: "Wooden Stick",
        power: 10,
        price: 10
    },
    {
        name: "Silver Dagger",
        power: 20,
        price: 30
    },
    {
        name: "Claw Hammer",
        power: 45,
        price: 70
    },
    {
        name: "Glass Sword",
        power: 75,
        price: 150
    }
];

const monsters = [
    {
        name: "Slime",
        color: "green",
        level: 2,
        health: 15,
        strength: 10,
        damageSpread: 2,
        skills: {
                name: ["Basic Attack", "Heavy Slam"],
                cooldown: [0, 2],
                extraDamage: [0, 10]
            }
    },
    {
        name: "Fanged Beast",
        color: "darkRed",
        level: 8,
        health: 60,
        strength: 25,
        damageSpread: 20,
        skills: {
                name: ["Bite", "Bloodlust Fang"],
                cooldown: [0, 3],
                extraDamage: [0, 20]
            }
    },
    {
        name: "Dragon",
        color: "blueViolet",
        level: 20,
        health: 300,
        strength: 50,
        damageSpread: 10,
        skills: {
                name: ["Claws", "Fire Breath"],
                cooldown: [0, 3],
                extraDamage: [0, 25]
            }
    }
];

const locations = [
    {
        name: "Town Square",
        "button text": ["Go to Store", "Go to Cave", "Fight Dragon"],
        "button functions": [goStore, goCave, fightDragon],
        text: "You are in the Town Square. You see a sign that says \"Store\"."
    },
    {
        name: "Store",
        "button text": ["Restore HP (10 GP)", "Buy weapon (GP)", "Go to town square"],
        "button functions": [buyHealth, buyWeapon, goTown],
        text: "You enter the store."
    },
    {
        name: "Cave",
        "button text": ["Fight Slime", "Fight Fanged Beast", "Go to Town Square"],
        "button functions": [fightSlime, fightBeast, goTown],
        text: "You enter the cave. You see some monsters."
    },
    {
        name: "fight",
        "button text": ["Attack", "Defend", "Escape"],
        "button functions": [playerTurn, defend, goTown],
        text: "You are fighting a monster."
    },
    {
        name: "kill monster",
        "button text": ["Go to town square", "Go to town square", "Go to town square"],
        "button functions": [goTown, goTown, goTown],
        text: "The monster screams \"Arg!\" as it dies. You gain experience points and find gold."
    },
    {
        name: "lose",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You died. &#x2620;"
    },
    {
        name: "win",
        "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
        "button functions": [restart, restart, restart],
        text: "You defeated the dragon! YOU WIN THE GAME! &#x1F389;"
    }
];

function modifyText(textInput, color, weight) {
    let text;
        if (weight === 3) {
            text = "<span class='" + color + "'><strong>" + textInput + "</strong></span>";
        } else if (weight === 2) {
            text = "<span class='" + color + "'>" + textInput + "</span>";
        }

    return text;
}

let playerName = initializeStats.pName;
let playerLevel = initializeStats.lvl;
let playerXp = initializeStats.exp;
let playerHealth = initializeStats.hP;
// let playerMaxHealth = initializeStats.mHP;
let playerDefense = initializeStats.def;
// let playerStrength = initializeStats.str;
// let playerActionPoints = initializeStats.aP;
// let playerMaxActionPoints = initializeStats.mxAP;
let playerGold = initializeStats.gP;
let playerInventory = [weapons[0].name];
let currentWeaponIndex = initializeStats.cWI;

let weaponPrice;

let playerDamage;
let monsterDamage;
let fighting = initializeStats.fI;
let logEntry = initializeStats.lE;
let currentCombatIndex = initializeStats.cCI;

let monsterName = initializeStats.mNm;
let monsterHealth = initializeStats.mHP;
let monsterSkill = initializeStats.mS;
let monsterSkillCooldown = initializeStats.mSC;
let monsterCurrentSkillIndex = initializeStats.mCSI;

let playerNameTextModified = modifyText(playerName, "yellow", 3);
let monsterNameTextModified;

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector('#button3');

const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText")
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const text = document.querySelector("#text");
const combatLog = document.querySelector("#combat-log");

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
    monsterStats.style.display = "none";
    combatLog.style.display = "none";
    button1.innerText = "[1] " + location["button text"][0];
    button2.innerText = "[2] " + location["button text"][1];
    button3.innerText = "[3] " + location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
}

function logEntryUpdate(log) {
    combatLog.innerHTML = (log + combatLog.innerHTML);
    currentCombatIndex++;
}

function goTown() {
    update(locations[0]);
    fighting = 0;
    monsterName = "";
    monsterHealth = 0;
    monsterCurrentSkillIndex = 0;
}

function goStore() {
    update(locations[1]);
    weaponPrice = weapons[currentWeaponIndex + 1].price;
    button2.innerText = "[2] Buy weapon (" + weaponPrice + " GP)"
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (playerHealth < 100) {
        if (playerGold >= 10) {
            playerGold -= 10;
            if ((playerHealth + 10) >= 100) {
                playerHealth = 100;
            } else {
                playerHealth += 10;
            }

            goldText.innerText = playerGold;
            healthText.innerText = playerHealth;
            text.innerText = "You've restored 10 HP."
        } else {
            text.innerText = "You do not have enough gold to buy HP.";
        }
    } else {
        text.innerText = "You're already at max HP.";
    }
}

function buyWeapon() {
    if (currentWeaponIndex < weapons.length - 1) {
        if (playerGold >= weaponPrice) {
            playerGold -= weaponPrice;
            currentWeaponIndex++;
            weaponPrice = weapons[currentWeaponIndex + 1].price
            button2.innerText = "[2] Buy weapon (" + weaponPrice + " GP)"

            let newWeapon = weapons[currentWeaponIndex].name;
            playerInventory.push(newWeapon);

            goldText.innerText = playerGold;
            text.innerText = "You now have a " + newWeapon + ".";
            text.innerText += " In your inventory you have:\n" + playerInventory;
        } else {
            text.innerText = "You do not have enough GP to buy a weapon.";
        }
    } else {
        weaponPrice = weapons[0].price;

        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "[2] Sell weapon for 15 GP";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (playerInventory.length > 1) {
        playerGold += weaponPrice;
        weaponPrice = weapons[playerInventory.length - 1].price;
        let currentWeapon = playerInventory.shift();

        goldText.innerText = playerGold;
        text.innerHTML = "You sold a " + currentWeapon + ".";
        text.innerHTML += " In your inventory you have: " + playerInventory;
    } else {
        text.innerHTML = "You cannot sell your only weapon.";
    }
}

function goFight() {
    update(locations[3]);

    monsterName = monsters[fighting].name;
    monsterNameTextModified = modifyText(monsters[fighting].name, monsters[fighting].color, 3);
    monsterHealth = monsters[fighting].health;
    monsterSkill = monsters[fighting].skills;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsters[fighting].health;

    currentCombatIndex = initializeStats.cCI;
    monsterSkillCooldown = 0;

    combatLog.style.display = "flex";
    combatLog.innerHTML = "<span>[<span class='grey'>0</span>] <span class='grey'>Battle start.</span></span>";
    combatLog.innerHTML += "<hr>";
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

function playerTurn() {
    playerDamage = weapons[currentWeaponIndex].power + Math.floor(Math.random() * playerXp) + 1; // player damage
    monsterHealth -= playerDamage;
    monsterHealthText.innerText = monsterHealth;

    logEntry = "<span>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + playerNameTextModified + " deals " + modifyText(playerDamage, "damageRed", 2) + " damage to " + monsterNameTextModified + " using [" + weapons[currentWeaponIndex].name + "].</span>";
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
        monsterTurn(playerDefense);
    }
}

function defend() {
    logEntry = "<span>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + " You defend.</span>";
    logEntryUpdate(logEntry);

    monsterTurn(playerDefense * 15);
}

function monsterTurn(playerDef) {
    monsterDamage = getDamage(monsters[fighting].strength, monsters[fighting].damageSpread) + monsterSkill.extraDamage[monsterCurrentSkillIndex];
    monsterDamage -= playerDef;
        
        if (monsterDamage <= 0) {
            monsterDamage = 1;
            playerHealth--;
        } else {
            playerHealth -= monsterDamage;
        }

        healthText.innerText = playerHealth;

        logEntry = "<span>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + monsterNameTextModified + " deals " + modifyText(monsterDamage, "damageRed", 2) + " damage to " + playerNameTextModified + " using [" + monsterSkill.name[monsterCurrentSkillIndex] + "].</span>";
        logEntryUpdate(logEntry);
        
        monsterPreparesAttack(monsterName);
        currentCombatIndex++;

        if (playerHealth <= 0) {
            lose();
        }
}

function getDamage(damage, damageRng) {
    return (Math.floor((Math.random() * damageRng) + 1) - (damageRng / 2)) + damage;
}

function monsterPreparesAttack(monsterName) {
    monsterSkillCooldown++;

    if (monsterSkill.cooldown.includes(monsterSkillCooldown) && monsterSkillCooldown !== 0) {
        logEntry = "<span>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + monsterNameTextModified + " prepares a " + modifyText("special", "purple", 3) + " attack.</span>";
        logEntryUpdate(logEntry);
        monsterCurrentSkillIndex++;

        if (monsterSkill.cooldown[(monsterSkill.cooldown.length - 1)] === monsterSkillCooldown) {
            monsterSkillCooldown = 0;
            monsterCurrentSkillIndex = 0;
        }

    } else {
        logEntry = "<span>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + monsterNameTextModified + " readies a basic attack.</span>";
        logEntryUpdate(logEntry);
    }
}

function defeatMonster() {
    playerGold += Math.floor(monsters[fighting].level * 6.7);
    playerXp += monsters[fighting].level;

    goldText.innerText = playerGold;
    xpText.innerText = playerXp;

    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    playerName = initializeStats.pName;
    playerLevel = initializeStats.lvl;
    playerXp = initializeStats.exp;
    playerHealth = initializeStats.hP;
    // playerMaxHealth = initializeStats.mHP;
    // playerDefense = initializeStats.def;
    // playerStrength = initializeStats.str;
    // playerActionPoints = initializeStats.aP;
    // playerMaxActionPoints = initializeStats.mxAP;
    playerGold = initializeStats.gP;
    playerInventory = [weapons[0].name];
    currentWeaponIndex = initializeStats.cWI;

    fighting = initializeStats.fI;
    logEntry = initializeStats.lE;
    currentCombatIndex = initializeStats.cCI;

    monsterName = initializeStats.mNm;
    monsterHealth = initializeStats.mHP;
    monsterSkill = initializeStats.mS;
    monsterSkillCooldown = initializeStats.mSC;
    monsterCurrentSkillIndex = initializeStats.mCSI;

    xpText.innerText = playerXp;
    healthText.innerText = playerHealth;
    goldText.innerText = playerGold;
    goTown();
}