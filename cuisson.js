let caneles = 0;
let ovens = 1;

function createFloatingText(x, y) {
    const text = document.createElement('div');
    text.textContent = '+' + ovens;
    text.style.position = 'fixed';
    text.style.left = x + 'px';
    text.style.top = y + 'px';
    text.style.color = '#a4721f';
    text.style.pointerEvents = 'none';
    text.className = 'font-neucha text-xl';
    document.body.appendChild(text);

    // Animate
    const animation = text.animate([
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-50px)', opacity: 0 }
    ], {
        duration: 1000
    });

    animation.onfinish = () => text.remove();
}

function updateDisplay() {
    const caneleCountElements = document.getElementsByClassName('text-canele-brown');
    for (let element of caneleCountElements) {
        element.textContent = caneles;
    }
    document.getElementById('stop-oven').disabled = caneles < 25;
}

function cookCanele(event) {
    if (event) {
        createFloatingText(event.clientX, event.clientY);
    }
    caneles += ovens;
    updateDisplay();
}

function buyOven() {
    if (caneles >= 25) {
        caneles -= 25;
        ovens += 1;
        updateDisplay();
    }
}

window.onload = function() {
    document.getElementById('start-oven').onclick = function(e) {
        cookCanele(e);
    };
    document.getElementById('stop-oven').onclick = buyOven;
    updateDisplay();
};
