/* Version: #4 */
/* === LOGIKK FOR HV-BORTFORKLARING === */

console.log("script.js starter opp...");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM er ferdig lastet. Initialiserer app...");

    // Hent referanser til HTML-elementer
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const excuseText = document.getElementById('excuse-text');
    const statusMsg = document.getElementById('status-msg');

    // Sjekk om databasen er tilgjengelig (fra excuses.js)
    if (typeof militaryExcuses === 'undefined' || !Array.isArray(militaryExcuses)) {
        console.error("FEIL: Kunne ikke finne listen 'militaryExcuses'. Sjekk at excuses.js er lastet før script.js.");
        excuseText.innerText = "FEIL: Database ikke funnet. Sjekk samband (konsoll).";
        excuseText.style.color = "red";
        return; // Avbryt oppstart
    }

    console.log(`Database bekreftet. Antall unnskyldninger tilgjengelig: ${militaryExcuses.length}`);

    // Variabel for å holde styr på siste genererte indeks for å unngå repetisjon
    let lastIndex = -1;

    // === FUNKSJON: GENERER UNNSKYLDNING ===
    const generateExcuse = () => {
        console.log("Genererer unnskyldning...");
        
        // Enkel animasjonseffekt (teksten blinker kort)
        excuseText.style.opacity = 0;
        
        setTimeout(() => {
            // Velg en tilfeldig indeks
            let randomIndex;
            
            // Hvis vi har mer enn 1 unnskyldning, sørg for at vi ikke får den samme to ganger på rad
            if (militaryExcuses.length > 1) {
                do {
                    randomIndex = Math.floor(Math.random() * militaryExcuses.length);
                } while (randomIndex === lastIndex);
            } else {
                randomIndex = 0;
            }

            lastIndex = randomIndex;
            const selectedExcuse = militaryExcuses[randomIndex];
            
            console.log(`Valgte unnskyldning #${randomIndex}: "${selectedExcuse}"`);

            // Oppdater teksten
            excuseText.innerText = selectedExcuse;
            excuseText.style.opacity = 1;

            // Aktiver kopier-knappen nå som vi har tekst
            copyBtn.disabled = false;
            
            // Tøm eventuell gammel statusmelding
            hideStatus();

        }, 150); // Kort forsinkelse for "blink"-effekten
    };

    // === FUNKSJON: KOPIER TIL UTKLIPPSTAVLE ===
    const copyToClipboard = async () => {
        const textToCopy = excuseText.innerText;

        if (!textToCopy || textToCopy === "Systemet er klart. Venter på input...") {
            console.warn("Ingenting å kopiere.");
            return;
        }

        try {
            // Moderne metode for kopiering
            await navigator.clipboard.writeText(textToCopy);
            console.log("Tekst kopiert til utklippstavle.");
            showStatus("KOPIERT TIL UTKLIPPSTAVLE!");
        } catch (err) {
            console.error("Kunne ikke kopiere tekst: ", err);
            // Fallback for eldre nettlesere eller spesielle sikkerhetsinnstillinger
            fallbackCopy(textToCopy);
        }
    };

    // Fallback kopieringsmetode (hvis navigator.clipboard feiler)
    const fallbackCopy = (text) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Sørg for at textarea ikke er synlig
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            console.log("Tekst kopiert via fallback-metode.");
            showStatus("KOPIERT (FALLBACK)!");
        } catch (err) {
            console.error("Fallback kopiering feilet også.", err);
            showStatus("FEIL VED KOPIERING");
        }
        
        document.body.removeChild(textArea);
    };

    // === HJELPEFUNKSJONER FOR STATUSMELDING ===
    let statusTimeout;
    
    const showStatus = (msg) => {
        statusMsg.innerText = msg;
        statusMsg.classList.remove('hidden');
        
        // Fjern meldingen automatisk etter 3 sekunder
        clearTimeout(statusTimeout);
        statusTimeout = setTimeout(() => {
            hideStatus();
        }, 3000);
    };

    const hideStatus = () => {
        statusMsg.classList.add('hidden');
    };

    // === EVENT LISTENERS ===
    generateBtn.addEventListener('click', generateExcuse);
    copyBtn.addEventListener('click', copyToClipboard);

    console.log("Event listeners er satt opp. Klar til strid.");
});

/* Version: #4 */
