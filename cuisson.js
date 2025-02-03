let caneles = 0;
let totalCanelesEarned = 0;
let ovens = 1;
let autoClickerInterval = null;
let upgrades = {
    oven: { count: 1, cost: 25, multiplier: 1, unlockAt: 0, description: "Four basique" },
    autoClicker: { count: 0, cost: 50, interval: 1000, unlockAt: 25, description: "Pâtissier automatique" },
    masterChef: { count: 0, cost: 100, multiplier: 2, unlockAt: 75, description: "Chef expérimenté" },
    recipe: { count: 0, cost: 200, multiplier: 5, unlockAt: 150, description: "Recette ancestrale" },
    grandma: { count: 0, cost: 500, multiplier: 10, unlockAt: 300, description: "Grand-mère et ses secrets" },
    apprentice: { count: 0, cost: 1000, multiplier: 15, unlockAt: 750, description: "École d'apprentis" },
    factory: { count: 0, cost: 2000, multiplier: 25, unlockAt: 1500, description: "Usine de canelés" },
    laboratory: { count: 0, cost: 5000, multiplier: 50, unlockAt: 3000, description: "Laboratoire culinaire" },
    timeMachine: { count: 0, cost: 10000, multiplier: 100, unlockAt: 7500, description: "Machine temporelle à canelés" },
    alchemist: { count: 0, cost: 20000, multiplier: 200, unlockAt: 15000, description: "Alchimiste du sucre" },
    wizard: { count: 0, cost: 50000, multiplier: 400, unlockAt: 30000, description: "Sorcier pâtissier" },
    portal: { count: 0, cost: 100000, multiplier: 800, unlockAt: 75000, description: "Portail dimensionnel" },
    temple: { count: 0, cost: 200000, multiplier: 1600, unlockAt: 150000, description: "Temple des canelés" },
    garden: { count: 0, cost: 500000, multiplier: 3200, unlockAt: 300000, description: "Jardin enchantée" },
    mine: { count: 0, cost: 1000000, multiplier: 6400, unlockAt: 750000, description: "Mine de vanille" },
    spaceship: { count: 0, cost: 2000000, multiplier: 12800, unlockAt: 1500000, description: "Vaisseau intergalactique" },
    dimension: { count: 0, cost: 5000000, multiplier: 25600, unlockAt: 3000000, description: "Dimension parallèle" },
    dragon: { count: 0, cost: 10000000, multiplier: 51200, unlockAt: 7500000, description: "Dragon pâtissier" },
    universe: { count: 0, cost: 20000000, multiplier: 102400, unlockAt: 15000000, description: "Univers de canelés" },
    infinity: { count: 0, cost: 50000000, multiplier: 204800, unlockAt: 30000000, description: "Infinité sucrée" }
};

function saveGame() {
    const saveData = {
        caneles,
        totalCanelesEarned,
        ovens,
        upgrades
    };
    localStorage.setItem('caneleClickerSave', JSON.stringify(saveData));
}

function loadGame() {
    const savedGame = localStorage.getItem('caneleClickerSave');
    if (savedGame) {
        const saveData = JSON.parse(savedGame);
        caneles = saveData.caneles;
        totalCanelesEarned = saveData.totalCanelesEarned;
        ovens = saveData.ovens;
        upgrades = saveData.upgrades;

        // Restart autoClicker if it was running
        if (upgrades.autoClicker.count > 0) {
            if (autoClickerInterval) {
                clearInterval(autoClickerInterval);
            }
            autoClickerInterval = setInterval(() => cookCanele(null, true), upgrades.autoClicker.interval);
        }
    }
}

function createFloatingText(x, y, amount) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = x + 'px';
    container.style.top = y + 'px';
    container.style.pointerEvents = 'none';
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '4px';

    const text = document.createElement('span');
    text.textContent = '+' + amount;  // Show actual production amount
    text.className = 'font-neucha text-2xl font-bold text-white';  // Made text slightly larger
    text.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';  // Enhanced shadow for better visibility

    const img = document.createElement('img');
    img.src = 'assets/bouchee2-1.png';
    img.style.width = '20px';
    img.style.height = '20px';
    img.style.objectFit = 'contain';

    container.appendChild(text);
    container.appendChild(img);
    document.body.appendChild(container);

    const animation = container.animate([
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-100px) scale(1.2)', opacity: 0 }  // Enhanced animation
    ], {
        duration: 1200,  // Slightly longer duration
        easing: 'ease-out'
    });

    animation.onfinish = () => container.remove();
}

function updateDisplay() {
    const caneleCountElements = document.getElementsByClassName('text-canele-brown');
    for (let element of caneleCountElements) {
        element.textContent = caneles;
    }
    
    // Update all upgrade buttons
    for (let type in upgrades) {
        const upgrade = upgrades[type];
        const button = document.getElementById(`upgrade-${type}`);
        const countElement = document.getElementById(`count-${type}`);
        const costElement = document.getElementById(`cost-${type}`);
        
        if (button && countElement && costElement) {
            button.style.display = totalCanelesEarned >= upgrades[type].unlockAt ? 'block' : 'none';
            button.disabled = caneles < upgrade.cost;
            countElement.textContent = upgrade.count;
            costElement.textContent = `${upgrade.cost} cannelés`;
        }
    }
}

function getProductionRate() {
    let multiplier = 1;
    for (let type in upgrades) {
        const upgrade = upgrades[type];
        if (upgrade.multiplier) {
            multiplier *= (1 + upgrade.count * upgrade.multiplier);
        }
    }
    return Math.floor(multiplier);
}

function getAutoClickerRate() {
    return upgrades.autoClicker.count; // Autoclicker produces 1 per count
}

function cookCanele(event, isAuto = false) {
    const earned = isAuto ? getAutoClickerRate() : getProductionRate();
    if (event) {
        createFloatingText(event.clientX, event.clientY, earned);
    }
    caneles += earned;
    totalCanelesEarned += earned;
    updateDisplay();
}

function buyUpgrade(type) {
    const upgrade = upgrades[type];
    if (caneles >= upgrade.cost) {
        caneles -= upgrade.cost;
        upgrade.count++;
        // Exponential cost increase based on count
        upgrade.cost = Math.floor(upgrade.cost * Math.pow(1.15, upgrade.count));
        
        if (type === 'autoClicker') {
            if (autoClickerInterval) {
                clearInterval(autoClickerInterval);
            }
            autoClickerInterval = setInterval(() => cookCanele(null, true), upgrade.interval);
        }
        
        updateDisplay();
    }
}

window.onload = function() {
    // Load saved game first
    loadGame();
    
    document.getElementById('start-oven').onclick = function(e) {
        cookCanele(e);
    };
    
    // Set up upgrade button handlers
    for (let type in upgrades) {
        const button = document.getElementById(`upgrade-${type}`);
        if (button) {
            button.onclick = () => buyUpgrade(type);
        }
    }
    
    updateDisplay();
    
    // Auto-save every 30 seconds
    setInterval(saveGame, 30000);
    
    // Save when closing/refreshing the page
    window.onbeforeunload = saveGame;
};

// Add manual save/load buttons to prevent progress loss
function resetGame() {
    if (confirm('Êtes-vous sûr de vouloir recommencer à zéro ?')) {
        localStorage.removeItem('caneleClickerSave');
        location.reload();
    }
}
