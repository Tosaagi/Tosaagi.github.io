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
        price: 10,
        rarity: "common"
    },
    {
        name: "Silver Dagger",
        power: 5,
        price: 30,
        rarity: "uncommon"
    },
    {
        name: "Iron Lance",
        power: 10,
        price: 45,
        rarity: "uncommon"
    },
    {
        name: "Claw Hammer",
        power: 15,
        price: 70,
        rarity: "rare"
    },
    {
        name: "Glass Sword",
        power: 30,
        price: 150,
        rarity: "epic"
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
                cooldown: [0, 2],
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
        buttonTexts: ["New Adventure!", "hesoyam"],
        buttonFunctions: ["prologue", hesoyam],
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
        text: `&nbsp; &nbsp; <span class="underlined">Prologue</span> 
                <br><br>&nbsp; &nbsp; A mysterious flow of magic has always found its way to spread throughout the continent of Esparthia. While some—beasts and men—acknowledge its incredible power and try to harness it to its fullest, many have fallen victim to the unspeakable curse, and doomed to eternity.
                <br><br>&nbsp; &nbsp; Despite the inevitable risks, the battle for control ver this dangerous substance grows ever stronger. 
                <br><br>&nbsp; &nbsp; However, even amidst the chaos that ensues, a noble hero will come to end it all...`
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
                buttonTexts: ["Restore HP (10 GP)", "Buy Weapon", "Go to Town Square"],
                buttonFunctions: [buyHealth, seeWeapons, goTown],
                weaponList: [weapons[0], weapons[1], weapons[2], weapons[3], weapons[4]],
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

/*const encounter = [
 *   {
 *       id: "e01",
 *       name: "Red-Riding-Hood",
 *       buttonTexts: ["Buy 1 match (1 GP)", ""]
 *   }
 *];
 */

// Audio Assets
const attackSound = new Audio("./assets/sounds/swordSlash_2.mp3");

// Game Variables
let currentScene;
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
let playerCurrentWeapon = playerWeaponInventory[0];
let playerDefend = false;
let playerWeaponInventory = [weapons[0]];

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
const inventoryContainer = document.querySelector("#inventory");
const inventoryCategory = document.querySelector("#inventory-category");
const inventoryBox = document.querySelector("#inventory-box");
viewInventory("weapons");
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
    closeStats();
    texts = [];

    if(playerUpgradePoints > 0) {
        button0.style.color = "red";
    } else {
        button0.style.color = "#000000";
    }

    let [currentSceneTemp] = scenes.filter((scene) => scene.id === sceneId);
    currentScene = currentSceneTemp;

    monsterStats.style.display = "none";

    if (locationId !== null) {
        [currentScene] = currentScene.locations.filter((location) => location.id === locationId);
        updateTexts(currentScene.text, currentScene.image);
    } else {
        updateTexts(currentScene.text, currentScene.image);
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

    text.style.height = "310px";

    enableButtons();

    combatLogs.style.display = "none";
}

function updateTexts(string, image = null) {
    texts.push(string);
    if (texts.length > 20) {
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

    if(playerUpgradePoints > 0 && fullStats.style.display === "block") {
        upgradeStatButton.style.display = "block";
    } else {
        upgradeStatButton.style.display = "none";
    }

    playerLevelQuickText.innerText = playerLevel;
}

function getDamage(damage, damageRng) {
    return (Math.floor((Math.random() * damageRng) + 1) - Math.floor((damageRng / 2))) + damage;
}

function hesoyam() {
    playerMaxHealth += 40;
    playerHealth += 40;
    playerGold += 100;
    playerStrength += 5;
    playerDefense += 5;
    playerXp += 20;

    playerLevelQuickText.innerText = playerLevel;
    playerHealthQuickText.innerText = playerHealth;
    playerGoldQuickText.innerText = playerGold;

    convertXptoLevel();

    combatLogs.style.display = "flex";
    logEntryUpdate("Cheat activated.");
}

function disableButtons() {
    controlButtons.forEach((button, index) => {
        button.onclick = null;
    }); 
}

function enableButtons() {
    buttons.style.display = "flex";
    buttons.style.flexDirection = "column";

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

        buttons.style.flexDirection = "row";

        combatLogs.style.display = "flex";
        combatLogs.innerHTML = "<span id='combat-log'><span>[<span class='grey'>0</span>]<span class='grey'>Battle start.</span></span></span>";
        combatLogs.innerHTML += "<hr>";

        verticalWipeOut(transition);
    }, 400);
}

function wander() {
    let encounterType = Math.floor(Math.random() * 2);

    switch (encounterType) {
        case 0:
            fighting = Math.floor(Math.random() * 2);
            goFight();
            break
        case 1:
    }
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
    attackSound.play();

    currentTurnIndex++;
    logEntryUpdate("newTurn");

    playerDamage = playerStrength + playerCurrentWeapon.power; // player damage
    monsterHealth -= playerDamage;
    monsterHealthBar.style.width = ((monsterHealth / monsters[fighting].health) * 100 + "%");
    monsterHealthText.innerText = monsterHealth;

    logEntry = `<span>[${modifyText(currentCombatIndex, "grey", 2)}]</span><span> ${playerNameTextModified} deals ${modifyText(playerDamage, "damageRed", 2)} damage to ${monsterNameTextModified} using [${weapons[currentWeaponIndex].name}].</span>`;
    logEntryUpdate(logEntry);

    updateTexts(`<hr>`);
    updateTexts(`You attacked the ${monsterName}, dealing ${modifyText(playerDamage, "damageRed", 2)} damage.`);

    // check battle condition
    if (monsterHealth <= 0) {
        if (fighting === 2) {
            winGame();
        } else {
            defeatMonster();
        }
    } else {
        // monster turn
        disableButtons();

        setTimeout(() => {
            monsterTurn();

            enableButtons();
        }, 1000);
    }

    console.log("Player Damage: " + playerDamage);
}

function defend() {
    playerDefend = true;
    currentTurnIndex++;
    logEntryUpdate("newTurn");

    logEntry = `<span>[${modifyText(currentCombatIndex, "grey", 2)}]</span><span> ${modifyText(playerName, "yellow", 3)} defend.</span>`;
    logEntryUpdate(logEntry);

    updateTexts(`<hr>`);
    updateTexts("You took a defensive position.");

    disableButtons();

    setTimeout(() => {
        monsterTurn();

        enableButtons();
    }, 1000);
}

// Player Stats Upgrade Functions
function upgrade(stat) {
    if (playerUpgradePoints > 0) {
        switch (stat) {
            case "maxHp":
                let oldMaxHealth = playerMaxHealth;
                playerMaxHealth += 5;
                playerHealth += 5;
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

    playerUpgradePointsText.innerText = playerUpgradePoints;
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
    inventoryContainer.style.display = "block";

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

    if(playerUpgradePoints > 0 && fighting === null) {
        upgradeStatButton.style.display = "block";
    }

    viewInventory("weapons");

    inventoryCategory.onchange = (() => {
        viewInventory(inventoryCategory.value);
    });

    monsterStats.style.display = "none";
    combatLogs.style.display = "none";
    buttons.style.display = "none";
    text.style.display = "none";
}

function closeStats() {
    if (fighting !== null) {
        monsterStats.style.display = "block";
        combatLogs.style.display = "flex";
        buttons.style.flexDirection = "row";
    }

    fullStats.style.display = "none";
    shortStats.style.display = "flex";
    inventoryContainer.style.display = "none";
    button0.innerText = "stats";
    button0.onclick = checkStats;
    buttons.style.display = "flex";
    text.style.display = "flex";

    upgradeStatButton.style.display = "none";
}

function changeCurrentWeapon(i) {
    playerCurrentWeapon = playerWeaponInventory[i];
    console.log(playerCurrentWeapon);
}

function viewInventory(invCategory) {
    let selectedCategory;

    switch (invCategory) {
        case "weapons":
            selectedCategory = playerWeaponInventory;
    }

    inventoryBox.innerHTML = "";

    selectedCategory.forEach((item, index) => {
        let thisButton = document.createElement("button");
        thisButton.innerHTML = `${modifyText(item.name, item.rarity, 2)}`;
        // `<button class="middle ${item.rarity}">${item.name}</button>`;

        thisButton.addEventListener("click", () => {changeCurrentWeapon(index)});

        addTooltip(thisButton, modifyText(item.name, item.rarity, 2), `Power: ${item.power}`, `Price: ${item.price}`);

        inventoryBox.appendChild(thisButton);
    });
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

function seeWeapons() {
    updateTexts("You decided to check the weaponry section. You see a wide variety of weapons.");

    controlButtons.forEach((button, index) => {
        let availableWeapon = currentScene.weaponList[index];
        button.style.display = "block";

        if (availableWeapon) {
            buttons.style.flexDirection = "row";
            button.innerHTML = modifyText(availableWeapon.name, availableWeapon.rarity, 2);
            button.onclick = (() => buyWeapon(availableWeapon));

            addTooltip(button, modifyText(availableWeapon.name, availableWeapon.rarity, 2), `Power: ${availableWeapon.power}`, `Price: ${availableWeapon.price}`);

        } else if (index === 6) {
            button.innerText = "Go Back";
            button.onclick = goStore;
        } else {
            button.style.display = "none";
        }
    });
}

function addTooltip(element, text1, text2 = null, text3 = null) {
    let thisElementTooltip = document.createElement("div");
    thisElementTooltip.classList.add("tooltip");
    thisElementTooltip.innerHTML = (`<p>${text1}</p>`);

    if (text2 !== null) {
        thisElementTooltip.innerHTML += (`<p>${text2}</p>`);
    }

    if (text3 !== null) {
        thisElementTooltip.innerHTML += (`<p>${text3}</p>`);
    }

    element.appendChild(thisElementTooltip);
}

function buyWeapon(selectedWeapon) {
    console.log(selectedWeapon);

    if (playerWeaponInventory.filter((item) => item.name === selectedWeapon.name).length > 0) {
        textMessage = "You already have this weapon.";
    } else {
        if (playerGold >= selectedWeapon.price) {
            playerGold -= selectedWeapon.price;
            currentWeaponIndex++;

            playerWeaponInventory.push(selectedWeapon);

            playerGoldQuickText.innerText = playerGold;
            textMessage = `You now have a ${selectedWeapon.name}`;
            textMessage += ` In your inventory you have:\n${playerWeaponInventory.reduce((acc, item) => acc + " [" + item.name + "]", "")}`;
        } else {
            textMessage = "You do not have enough GP to buy this weapon.";
        }
    }

    // if (currentWeaponIndex < weapons.length - 1) {
    //     if (playerGold >= weaponPrice) { // cwi = 2
    //         playerGold -= weaponPrice;
    //         currentWeaponIndex++; //cwi = 3

    //         // 
    //         if (currentWeaponIndex !== weapons.length - 1) {
    //             weaponPrice = weapons[currentWeaponIndex + 1].price;
    //             button2.innerText = `Buy weapon (${weaponPrice} GP)`;
    //         } 

    //         let newWeapon = weapons[currentWeaponIndex].name;
    //         playerInventory.push(newWeapon);

    //         playerGoldQuickText.innerText = playerGold;
    //         textMessage = `You now have a ${newWeapon}.`;
    //         textMessage += ` In your inventory you have:\n${playerInventory}`;

    //     } else {
    //         textMessage = "You do not have enough GP to buy a weapon.";
    //     }
    // } else {
    //     weaponPrice = weapons[0].price;

    //     textMessage = "You already have the most powerful weapon!";
    //     button2.innerText = "Sell weapon for 15 GP";
    //     button2.onclick = sellWeapon;
    // }

    console.log(playerWeaponInventory);
    updateTexts(textMessage);
}

/* function sellWeapon() {
 *     if (playerWeaponInventory.length > 1) {
 *         playerGold += (weaponPrice - (Math.floor(weaponPrice / 2)));
 *         weaponPrice = weapons[playerWeaponInventory.length - 1].price;
 *         let currentWeapon = playerWeaponInventory.shift();

 *         playerGoldQuickText.innerText = playerGold;
 *         textMessage = `You sold a ${currentWeapon}.`;
 *         textMessage += ` In your inventory you have: ${playerWeaponInventory}`;
 *     } else {
 *         textMessage = "You cannot sell your only weapon.";
 *     }
 *
 *     updateTexts(textMessage);
 * }
 */

// Monsters Actions
function monsterTurn() {
    attackSound.play();

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

    updateTexts(`${monsterNameTextModified} attacks! Dealing ${modifyText(monsterDamage, "damageRed", 2)} damage to You.`);

    if (playerHealth <= 0) {
        lose();
    }

    monsterPreparesAttack();

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

        updateTexts(`${monsterNameTextModified} prepares a ${modifyText("special", "purple", 2)} attack.`);

        monsterCurrentSkillIndex++;

    } else {
        logEntry = `<span>[${modifyText(currentCombatIndex, "grey", 2)}]</span><span> ${monsterNameTextModified} readies a basic attack.</span>`;

        updateTexts(`${monsterNameTextModified} prepares a ${modifyText("basic", "grey", 2)} attack.`);

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
