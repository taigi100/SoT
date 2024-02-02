function incrementCounter(eventId) {
    let countElement = document.getElementById(eventId);
    countElement.innerText = (parseInt(countElement.innerText) + 1).toString();
}

function decrementCounter(eventId) {
    let countElement = document.getElementById(eventId);
    countElement.innerText = Math.max(parseInt(countElement.innerText) - 1, 0).toString();
}
function generateReport() {
    const initialGold = parseInt(document.getElementById('initialGold').value) || 0;
    const endingGold = parseInt(document.getElementById('endingGold').value) || 0;

    const initialDoubloons = parseInt(document.getElementById('initialDoubloons').value) || 0;
    const endingDoubloons = parseInt(document.getElementById('endingDoubloons').value) || 0;

    const initialAncientCoins = parseInt(document.getElementById('initialAncientCoins').value) || 0;
    const endingAncientCoins = parseInt(document.getElementById('endingAncientCoins').value) || 0;

    const captName = document.getElementById('captainName').value;
    const voyageNo = document.getElementById('voyageNo').value;
    const shipText = shipNameToText[document.getElementById('ship').value];
    const notes = document.getElementById('customMessage').value;
    let report;
    report = `${captName}'s log of the ${voyageNo} ${shipText}: `;
    report += notes;
    report += "\n\n";

    report += "Events:\n";
    events.forEach(event => {
        let count = parseInt(document.getElementById(event.replace(/\s+/g, '')).innerText) || 0;
        if (count > 0) {
            report += `- ${count} x ${event}\n`;
        }
    });

    //format string number with commas
    const numberWithCommas = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if(endingGold - initialGold > 0) {
        report += "\nGold confiscated:\n";
        report += `- ${numberWithCommas(endingGold - initialGold)}\n`;
    }
    if (endingDoubloons - initialDoubloons > 0) {
        report += "\nDoubloons confiscated:\n";
        report += `- ${numberWithCommas(endingDoubloons - initialDoubloons)}\n`;
    }
    if (endingAncientCoins - initialAncientCoins > 0) {
        report += "\nAncient coins confiscated:\n";
        report += `- ${numberWithCommas(endingAncientCoins - initialAncientCoins)}\n`;
    }
    if (elapsedTime !== 0) {
        report += "\nTime:\n";
        let [seconds, minutes, hours] = getHMS(elapsedTime);
        report += `- ${hours}h ${minutes}m\n`;
    }

    document.getElementById('report').innerText = report;
}


// script.js
let timerInterval;
let startTime;
let elapsedTime = 0;

document.getElementById('startTimer').addEventListener('click', startTimer);
document.getElementById('stopTimer').addEventListener('click', stopTimer);
document.getElementById('copyReport').addEventListener('click', copyReport);

const timerElement = document.getElementById("timer");


const dialog = document.querySelector("dialog");
const showButton = document.getElementById("clearData")
const closeButton = document.querySelector("dialog button");

// "Show the dialog" button opens the dialog modally
showButton.addEventListener("click", () => {
    dialog.showModal();
});

// "Close" button closes the dialog
closeButton.addEventListener("click", () => {
    dialog.close();
});

function clearForm() {
        elementsToSave.forEach(id => {
            if (events.includes(id)) {
                document.getElementById(id.replace(/\s+/g, '')).innerText = '0';
            } else {
                const element = document.getElementById(id);
                if (element) {
                    if (id === 'elapsedTime') {
                        elapsedTime = 0;
                        displayTimer(); // Update the timer display
                    } else {
                        element.value = '0';
                    }
                }
            }
        });
        localStorage.clear();
    // setTimeout(() => location.reload(), 500 );
}


function startTimer() {
    if (timerInterval) return;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        displayTimer();
    }, 1000);
    displayTimer();
}

function stopTimer() {
    if (!timerInterval) return;
    clearInterval(timerInterval);
    timerInterval = null;
}

function getHMS(elapsedTime) {
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let hours = Math.floor((elapsedTime / (1000 * 60 * 60)) % 24);
    return [seconds, minutes, hours];
}
function displayTimer() {
    let [seconds, minutes, hours] = getHMS(elapsedTime);
    document.getElementById('elapsedTime').innerText = `${hours}h ${minutes}m ${seconds}s`;
}

function copyReport() {
    const report = document.getElementById('report').innerText;
    navigator.clipboard.writeText(report).then(() => alert('Report copied to clipboard!'));
}

function initSave() {
    setInterval(() => {
        saveFormState();
    }, 1000);
}

function saveFormState() {
    elementsToSave.forEach(id => {
        if (events.includes(id)) {
            const count = document.getElementById(id.replace(/\s+/g, '')).innerText;
            localStorage.setItem(id, count);
        } else {
            const element = document.getElementById(id);
            if (id === 'elapsedTime' && elapsedTime > 0) {
                localStorage.setItem(id, elapsedTime.toString());
            }
            else
                {
                    localStorage.setItem(id, element.value);
                }
            }

    });
}
function loadFormState() {
    elementsToSave.forEach(id => {
        if (events.includes(id)) {
            const count = parseInt(localStorage.getItem(id)) || 0;
            document.getElementById(id.replace(/\s+/g, '')).innerText = count.toString();
        } else {
            const value = localStorage.getItem(id);
            if (value && document.getElementById(id)) {
                if (id === 'elapsedTime') {
                    elapsedTime = parseInt(value) || 0;
                    if(elapsedTime > 0)
                    displayTimer(); // Update the timer display
                } else {
                    document.getElementById(id).value = value;
                }
            }
        }

    });
    initSave();
}
function generateEventHTML(events) {
    const container = document.getElementById('eventsContainer'); // Ensure you have a div with this id in your HTML

    events.forEach(event => {
        const div = document.createElement('div');
        div.className = 'event';

        const label = document.createElement('label');
        label.textContent = event;

        const decrementButton = document.createElement('button');
        decrementButton.type = 'button';
        decrementButton.textContent = '-';
        decrementButton.onclick = function() { decrementCounter(event.replace(/\s+/g, '')) };

        const span = document.createElement('span');
        span.id = event.replace(/\s+/g, '');
        span.textContent = '0';

        const incrementButton = document.createElement('button');
        incrementButton.type = 'button';
        incrementButton.textContent = '+';
        incrementButton.onclick = function() { incrementCounter(event.replace(/\s+/g, '')) };

        div.appendChild(label);
        div.appendChild(decrementButton);
        div.appendChild(span);
        div.appendChild(incrementButton);

        container.appendChild(div);
    });

    loadFormState();
}

// Example usage
const events = ["PvP Sloop", "PvP Brigantine", "PvP Galleon", "Highest hourglass streak", "Sea Fort", "Skeleton Fort", "Fort of Fortune", "Skeleton Fleet", "Ghost Fleet", "Ashen Winds", "Davy Jones Fleet", "Fort of the Damned", "Legend of the Veil", "Skeleton Ship", "Megalodon", "Kraken", "Shipwreck", "Siren Shrine", "Siren Treasury", "Gold Hoarders Voyage", "Merchant Hoarders Voyage", "Order of Souls Hoarders Voyage", "Athena's Hoarders Voyage", "Grade 5 Emissary"];
const elementsToSave = ["captainName", "customMessage", "voyageNo", "ship", "initialGold", "endingGold", "initialDoubloons", "endingDoubloons", "initialAncientCoins", "endingAncientCoins", "elapsedTime", ...events];
generateEventHTML(events);

shipNameToText = {
    "NONSUCH": "voyage of the HMS Nonsuch",
    "LYDIA": "voyage of the HMS Lydia auxiliary to the HMS Nonsuch",
    "PEMBROKE": "voyage of the HMS Pembroke auxiliary to the HMS Nonsuch"
}