document.addEventListener('DOMContentLoaded', init);

const shipOptions = {
    "NONSUCH": "HMS NONSUCH",
    "LYDIA": "HMS LYDIA",
    "PEMBROKE": "HMS PEMBROKE",
    "ETERNAL": "HMS ETERNAL",
    "BROTHERHOOD": "HMS BROTHERHOOD",
    "INTREPID": "HMS INTREPID",
    "ORION": "HMS ORION",
    "HEADWIND": "HMS HEADWIND",
    "SURPRISE": "HMS SURPRISE"
};

const shipNameToText = {
    "NONSUCH": "voyage of the HMS Nonsuch",
    "LYDIA": "voyage of the HMS Lydia auxiliary to the HMS Nonsuch",
    "PEMBROKE": "voyage of the HMS Pembroke auxiliary to the HMS Nonsuch",
    "SURPRISE": "voyage of the HMS Surprise auxiliary to the HMS Nonsuch",
    "ETERNAL": "voyage of the HMS Eternal",
    "BROTHERHOOD": "voyage of the HMS Brotherhood auxiliary to the HMS Eternal",
    "INTREPID": "voyage of the HMS Intrepid",
    "ORION": "voyage of the HMS Orion auxiliary to the HMS Intepid",
    "HEADWIND": "voyage of the HMS Headwind auxiliary to the HMS Intepid"
}

const events = [
    "Grade 5 Emissary",
    "PvP Sloop",
    "PvP Brigantine",
    "PvP Galleon",
    "Highest hourglass streak",
    "Sea Fort", "Skeleton Fort",
    "Fort of Fortune",
    "Skeleton Fleet",
    "Ghost Fleet",
    "Fleet of Fortune",
    "Skeleton Ship Sloop",
    "Skeleton Ship Brigantine",
    "Skeleton Ship Galleon",
    "Ashen Winds",
    "Davy Jones Fleet",
    "Fort of the Damned",
    "Legend of the Veil",
    "Megalodon",
    "Kraken", "Shipwreck",
    "Siren Shrine", "Siren Treasury",
    "Gold Hoarders Voyage",
    "Merchant Hoarders Voyage",
    "Order of Souls Hoarders Voyage",
    "Athena's Hoarders Voyage"
];
const elementsToSave = ["captainName", "customMessage", "voyageNo", "ship", "initialGold", "endingGold", "initialDoubloons", "endingDoubloons", "elapsedTime", ...events];
const elementsToNotClear = ["captainName"];
const roles = ['CO', 'XO', 'Quartermaster', 'Gunner', 'Boarder', 'Carpenter', 'Partial'];

let crewMemberCount = 0;
let saveInterval;

function init() {
    generateShipOptions();
    generateEventHTML(events);
    let existingCrewMembersCount = localStorage.getItem('crewMemberCount') || 2;
    generateCrewMemberHTML();
    for (let i = 1; i <= existingCrewMembersCount; i++) {
        addCrewMember(true);
    }
    setupEventListeners();
    loadFormState();
}

function generateShipOptions() {
    const shipSelect = document.getElementById('ship');
    Object.keys(shipOptions).forEach(key => {
        let option = new Option(shipOptions[key], key);
        shipSelect.appendChild(option);
    });
}

function generateEventHTML(events) {
    const container = document.getElementById('eventsContainer');
    events.forEach(event => {
        const div = document.createElement('div');
        div.className = 'event';
        div.innerHTML = `
            <label>${event}</label>
            <button type="button" onclick="updateCounter('${event.replace(/\s+/g, '')}', -1)">-</button>
            <span id="${event.replace(/\s+/g, '')}">0</span>
            <button type="button" onclick="updateCounter('${event.replace(/\s+/g, '')}', 1)">+</button>
        `;
        container.appendChild(div);
    });
}

function generateCrewMemberHTML() {
    const crewSection = document.getElementById('crewSection');
    const table = document.createElement('table');
    table.id = 'crewMembersTable';
    crewSection.appendChild(table);
    const newRow = table.insertRow(-1);
    const header = ['Name', ...roles];
    header.forEach((header, index) => {
        const cell = newRow.insertCell(index);
        cell.innerHTML = header;
    });
    return table;
}

// Adjust `addCrewMember` to accept a parameter for restoring state from localStorage
function addCrewMember(restoreState = false) {
    crewMemberCount++;
    const table = document.getElementById('crewMembersTable');
    const newRow = table.insertRow(-1);
    newRow.setAttribute('id', `crewRow${crewMemberCount}`);
    let cell = newRow.insertCell(0);
    cell.innerHTML = `<input type="text" id="cm${crewMemberCount}name">`;
    elementsToSave.push(`cm${crewMemberCount}name`);
    roles.forEach((role, index) => {
        cell = newRow.insertCell(index + 1);
        const checkboxId = `cm${crewMemberCount}${role}`;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = checkboxId;
        checkbox.name = checkboxId;
        cell.appendChild(checkbox);

        // If restoring state, check localStorage for the checkbox state
        if (restoreState) {
            checkbox.checked = localStorage.getItem(checkboxId) === "true";
        }
        elementsToSave.push(`cm${crewMemberCount}${role}`);
    });
}

function setupEventListeners() {
    document.getElementById('addCrewmanButton').addEventListener('click', addCrewMember);
    document.getElementById('startTimerButton').addEventListener('click', startTimer);
    document.getElementById('stopTimerButton').addEventListener('click', stopTimer);
    document.getElementById('generateReportButton').addEventListener('click', generateReport);
    document.getElementById('copyReportButton').addEventListener('click', copyReport);
    document.getElementById('clearDataButton').addEventListener('click', () => document.getElementById('confirmationDialog').showModal());
    document.getElementById('confirmClearButton').addEventListener('click', clearForm);
    document.getElementById('cancelClearButton').addEventListener('click', closeDialogue);
    window.addEventListener('unload', () => { if(saveInterval) clearInterval(saveInterval) });
}

function closeDialogue() {
    document.getElementById('confirmationDialog').close();
}
function updateCounter(eventId, delta) {
    let countElement = document.getElementById(eventId);
    countElement.innerText = (parseInt(countElement.innerText) + delta).toString();
}

let timerInterval = null; // Holds the reference to setInterval
let elapsedTime = 0; // Holds the elapsed time in seconds

function startTimer() {
    if (timerInterval !== null) return; // Prevents multiple timers from starting
    timerInterval = setInterval(() => {
        elapsedTime += 1;
        updateDisplay(); // Update your timer display accordingly
    }, 1000); // Update every second
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null; // Reset the interval ID
}

function updateDisplay() {
    document.getElementById('elapsedTime').innerText = formatTime(elapsedTime);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${pad(hours)}h ${pad(minutes)}m ${pad(remainingSeconds)}s`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

function showToast(message) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = 'toastMessage';
    toast.innerText = message;

    toastContainer.appendChild(toast);

    // Automatically remove the toast after 4 seconds
    setTimeout(() => toast.remove(), 4000);
}

function copyReport() {
    const report = document.getElementById('report').innerText;
    navigator.clipboard.writeText(report).then(() => showToast('Report copied to clipboard!'));
}

function getValue(id, isNumeric = false) {
    const value = document.getElementById(id).value;
    return isNumeric ? parseInt(value, 10) || 0 : value;
}

function formatNumberWithCommas(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateEventSection() {
    return events.reduce((acc, event) => {
        const count = parseInt(document.getElementById(event.replace(/\s+/g, '')).innerText) || 0;
        return count > 0 ? `${acc}${count} x ${event}\n` : acc;
    }, "");
}

function generateCrewSection() {
    let crewSection = "Crew:\n";
    for (let i = 1; i <= crewMemberCount; i++) {
        crewSection += `${document.getElementById(`cm${i}name`).value} (${roles.reduce((acc, role) => {
            const checkbox = document.getElementById(`cm${i}${role}`);
            return acc + (checkbox.checked? `${role},` : '');
        }, '').slice(0,-1)})\n`;
    }
    return crewSection;
}

function generateReport() {
    const initialGold = getValue('initialGold', true);
    const endingGold = getValue('endingGold', true);
    const initialDoubloons = getValue('initialDoubloons', true);
    const endingDoubloons = getValue('endingDoubloons', true);
    const captName = getValue('captainName');
    const voyageNo = getValue('voyageNo');
    const ship = getValue('ship');
    const notes = getValue('customMessage');
    const shipText = shipNameToText[ship];

    const goldGained = endingGold - initialGold;
    const doubloonsGained = Math.max(endingDoubloons - initialDoubloons, 0);

    const timeSection = elapsedTime !== 0 ? `\nTime:\n${formatTime(elapsedTime)}` : '';
    const eventsSection = generateEventSection();
    const crewSection = generateCrewSection();

    document.getElementById('report').innerText = `${captName}'s log of the ${voyageNo} ${shipText}: ${notes}\n\n` +
        "Events:\n" + eventsSection +
        (goldGained > 0 ? `\nGold confiscated:\n${formatNumberWithCommas(goldGained)}\n` : '') +
        `\nDoubloons confiscated:\n${formatNumberWithCommas(doubloonsGained)}\n` +
        timeSection + '\n\n' + crewSection;
}

let saveLock = false;
function clearForm() {
    saveLock = true;
    elementsToSave.forEach(id => {
        if (elementsToNotClear.includes(id)) return;

        const element = document.getElementById(id.replace(/\s+/g, ''));
        if (!element) return;

        if (events.includes(id)) {
            element.innerText = '0'; // Reset text to '0' for event counters
        } else if (element.type === 'checkbox') {
            element.checked = false;
        } else if (element.type === 'number' || element.type === 'text' || element.tagName === 'TEXTAREA') {
            element.value = '';
        }
    });

    // Reset specific variables and localStorage outside the loop
    elapsedTime = 0;
    crewMemberCount = 2;
    localStorage.clear();
    updateDisplay();
    showToast("Data cleared!");
    closeDialogue();
    saveLock = false;
    window.location.reload();
}

function initSave() {
    // Clear any existing interval to prevent multiple intervals
    if (saveInterval) {
        clearInterval(saveInterval);
    }

    // Save the state every second
    saveInterval = setInterval(() => {
        saveFormState();
    }, 10000);

    // Save when the user leaves the page or tab becomes inactive
    window.addEventListener('beforeunload', saveFormState);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            saveFormState();
        }
    });
}

function saveFormState() {
    if (saveLock) return; // Prevents multiple saves from happening
    elementsToSave.forEach(id => {
        const element = document.getElementById(id.replace(/\s+/g, ''));
        if (!element) return;

        let valueToSave;
        if (events.includes(id)) {
            valueToSave = element.innerText; // For event counters
        } else if (element.type === 'checkbox') {
            valueToSave = element.checked.toString();
        } else if (element.type === 'number' || element.type === 'text' || element.tagName === 'TEXTAREA' || id === 'elapsedTime') {
            valueToSave = element.value;
            if (id === 'elapsedTime') valueToSave = elapsedTime.toString();
        }

        localStorage.setItem(id, valueToSave);
    });
    localStorage.setItem('crewMemberCount', crewMemberCount.toString());
}

function loadFormState() {
    if (saveLock) return; // Prevents multiple saves from happening
    elementsToSave.forEach(id => {
        const value = localStorage.getItem(id);
        if (value === null) return;

        const element = document.getElementById(id.replace(/\s+/g, ''));
        if (!element) return;

        if (events.includes(id)) {
            element.innerText = value;
        } else if (element.type === 'checkbox') {
            element.checked = value === "true";
        } else if (element.type === 'number' || element.type === 'text' || element.tagName === 'TEXTAREA' || id === 'elapsedTime') {
            element.value = value;
            if (id === 'elapsedTime') {
                elapsedTime = parseInt(value, 10) || 0;
                updateDisplay();
            }
        }
    });
    initSave();
}

