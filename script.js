// script.js
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

    // Similar retrieval and calculation for doubloons and ancient coins
    const initialDoubloons = parseInt(document.getElementById('initialDoubloons').value) || 0;
    const endingDoubloons = parseInt(document.getElementById('endingDoubloons').value) || 0;

    const initialAncientCoins = parseInt(document.getElementById('initialAncientCoins').value) || 0;
    const endingAncientCoins = parseInt(document.getElementById('endingAncientCoins').value) || 0;

    let report = "Events:\n";
    let events = [
        { name: "Sea Fort", count: parseInt(document.getElementById('seaFort').innerText) },
        { name: "Ghost Fleet", count: parseInt(document.getElementById('ghostFleet').innerText) },
        { name: "Fleet of Fortune", count: parseInt(document.getElementById('fleetOfFortune').innerText) },
        //Generate the same objects as above for: "Grade 5 Guild Emissary, Grade 5 Gold Emissary, Grade 5 Order of Souls Emissary, Grade 5 Reaper Emissary, Grade 5 Athena Emissary, PvP Sloop, PvP Brigantine, PvP Galleon
        { name: "Grade 5 Guild Emissary", count: parseInt(document.getElementById('grade5GuildEmissary').innerText) || 0 },
        { name: "Grade 5 Gold Emissary", count: parseInt(document.getElementById('grade5GoldEmissary').innerText) || 0 },
        { name: "Grade 5 Order of Souls Emissary", count: parseInt(document.getElementById('grade5OrderOfSoulsEmissary').innerText) || 0 },
        { name: "Grade 5 Reaper Emissary", count: parseInt(document.getElementById('grade5ReaperEmissary').innerText) || 0 },
        { name: "Grade 5 Athena Emissary", count: parseInt(document.getElementById('grade5AthenaEmissary').innerText) || 0 },
        { name: "PvP Sloop", count: parseInt(document.getElementById('pvpSloop').innerText) || 0 },
        { name: "PvP Brigantine", count: parseInt(document.getElementById('pvpBrigantine').innerText) || 0 },
        { name: "PvP Galleon", count: parseInt(document.getElementById('pvpGalleon').innerText) || 0 }
    ];

    events.forEach(event => {
        if (event.count > 0) {
            report += `- ${event.count} x ${event.name}\n`;
        }
    });

    //format string number with commas
    const numberWithCommas = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    document.getElementById('report').innerText = report;
    report += "\nGold confiscated:\n";
    report += `- ${numberWithCommas(endingGold - initialGold)}\n`;
    report += "\nDoubloons confiscated:\n";
    report += `- ${numberWithCommas(endingDoubloons - initialDoubloons)}\n`;
    if (endingAncientCoins - initialAncientCoins > 0) {
        report += "\nAncient coins confiscated:\n";
        report += `- ${numberWithCommas(endingAncientCoins - initialAncientCoins)}\n`;
    }
    document.getElementById('report').innerText = report;
}
