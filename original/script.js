// initialize stats
let initializeStats = {
    pN: "Player",
    xP: 0,
    hP: 100,
    gP: 250,
    cWI: 0,

    fI: 0,
    cCI: 0,
    mN: "",
    mH: 0,
    mCSI: 0
};

let playerName = initializeStats.pN;
let xp = initializeStats.xP;
let health = initializeStats.hP;
let gold = initializeStats.gP;
let currentWeaponIndex = initializeStats.cWI;

let fighting = initializeStats.fI;
let currentCombatIndex = initializeStats.cCI;
let monsterName = initializeStats.mN;
let monsterHealth = initializeStats.mH;
let monsterCurrentSkillIndex = initializeStats.mCSI;

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

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

const weapons = [
    {
        name: "Wooden Stick",
        power: 5
    },
    {
        name: "Silver Dagger",
        power: 30
    },
    {
        name: "Claw Hammer",
        power: 50
    },
    {
        name: "Glass Sword",
        power: 100
    }
];

let inventory = [weapons[0].name];

const monsters = [
    {
        name: "Slime",
        color: "green",
        level: 2,
        health: 15,
        skills: {
                name: ["Basic Attack", "Heavy Slam"],
                level: [4, 10]
            }
    },
    {
        name: "Fanged Beast",
        color: "darkRed",
        level: 8,
        health: 60,
        skills: {
                name: ["Bite", "Bloodlust Fang"],
                level: [10, 20]
            }
    },
    {
        name: "Dragon",
        color: "blueViolet",
        level: 20,
        health: 300,
        skills: {
                name: ["Claws", "Fire Breath"],
                level: [22, 50]
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
        "button text": ["Restore HP (10 GP)", "Buy weapon (30 GP)", "Go to town square"],
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
        "button text": ["Attack", "Dodge", "Run"],
        "button functions": [attack, dodge, goTown],
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

function update(location) {
    monsterStats.style.display = "none";
    button1.innerText = "[1] " + location["button text"][0];
    button2.innerText = "[2] " + location["button text"][1];
    button3.innerText = "[3] " + location["button text"][2];
    button1.onclick = location["button functions"][0];
    button2.onclick = location["button functions"][1];
    button3.onclick = location["button functions"][2];
    text.innerHTML = location.text;
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
}

function goCave() {
    update(locations[2]);
}

function buyHealth() {
    if (health < 100) {
        if (gold >= 10) {
            gold -= 10;
            if ((health + 10) >= 100) {
                health = 100;
            } else {
                health += 10;
            }

            goldText.innerText = gold;
            healthText.innerText = health;
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
        if (gold >= 30) {
            gold -= 30;
            currentWeaponIndex++;

            let newWeapon = weapons[currentWeaponIndex].name;
            inventory.push(newWeapon);

            goldText.innerText = gold;
            text.innerText = "You now have a " + newWeapon + ".";
            text.innerText += " In your inventory you have:\n" + inventory;
        } else {
            text.innerText = "You do not have enough GP to buy a weapon.";
        }
    } else {
        text.innerText = "You already have the most powerful weapon!";
        button2.innerText = "[2] Sell weapon for 15 GP";
        button2.onclick = sellWeapon;
    }
}

function sellWeapon() {
    if (inventory.length > 1) {
        gold += 15;
        let currentWeapon = inventory.shift();

        goldText.innerText = gold;
        text.innerHTML = "You sold a " + currentWeapon + ".";
        text.innerHTML += " In your inventory you have: " + inventory;
    } else {
        text.innerHTML = "You cannot sell your only weapon.";
    }
}

function goFight() {
    update(locations[3]);
    monsterHealth = monsters[fighting].health;
    monsterStats.style.display = "block";
    monsterNameText.innerText = monsters[fighting].name;
    monsterHealthText.innerText = monsters[fighting].health;
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
    // player turn
    let playerDmg = weapons[currentWeaponIndex].power + Math.floor(Math.random() * xp) + 1; // player damage
    monsterHealth -= playerDmg;

    playerName = modifyText(playerName, "yellow", 3)
    playerDmg = modifyText(playerDmg, "damageRed", 2);
    monsterName = modifyText(monsters[fighting].name, monsters[fighting].color, 3);

    monsterHealthText.innerText = monsterHealth;
    text.innerHTML += "<br>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + "<span class='entity yellow'>Player</span> deals " + playerDmg + " damage to " + monsterName + " using [" + weapons[currentWeaponIndex].name + "].";
    currentCombatIndex++;

    // check battle condition
    if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    } else {
        // monster turn
        let monsterSkill = monsters[fighting].skills;
        let monsterDmg = monsterSkill.level[monsterCurrentSkillIndex];
        health -= monsterDmg;

        monsterDmg = modifyText(monsterDmg, "damageRed", 2)

        healthText.innerText = health;
        text.innerHTML += "<br>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + monsterName + " deals " + monsterDmg + " damage to " + playerName + " using [" + monsterSkill.name[monsterCurrentSkillIndex] + "].";
        currentCombatIndex++;
        
        monsterNextAttack(monsterName);
        currentCombatIndex++;

        if (health <= 0) {
            lose();
        }
    }
}

function dodge() {
    monsterName = modifyText(monsters[fighting].name, monsters[fighting].color, 3);
    text.innerHTML += "<br>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + " You dodge the attack from the " + monsterName + ".";

    monsterNextAttack(monsterName);
    currentCombatIndex++;
}

function monsterNextAttack(monsterName) {
    monsterCurrentSkillIndex = Math.random() < 0.7 ? 0 : 1;

    if (monsterCurrentSkillIndex === 0) {
        text.innerHTML += "<br>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + monsterName + " readies a basic attack.";
    } else {
        text.innerHTML += "<br>[" + modifyText(currentCombatIndex, "grey", 2) + "] " + monsterName + " prepares a " + modifyText("special", "purple", 3) + " attack.";
    }
}

function defeatMonster() {
    gold += Math.floor(monsters[fighting].level * 6.7);
    xp += monsters[fighting].level;

    goldText.innerText = gold;
    xpText.innerText = xp;

    update(locations[4]);
}

function lose() {
    update(locations[5]);
}

function winGame() {
    update(locations[6]);
}

function restart() {
    playerName = initializeStats.pN;
    xp = initializeStats.xP;
    health = initializeStats.hP;
    gold = initializeStats.gP;
    currentWeaponIndex = initializeStats.cWI;

    fighting = initializeStats.fI;
    currentCombatIndex = initializeStats.cCI;
    monsterName = initializeStats.mN;
    monsterHealth = initializeStats.mH;
    monsterCurrentSkillIndex = initializeStats.mCSI;

    xpText.innerText = xp;
    healthText.innerText = health;
    goldText.innerText = gold;
    goTown();
}