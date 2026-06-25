

const XML_FILE = 'ron-rccv.usfx.xml';
let xmlDoc = null;
let leafletMap = null;
let layerTraseu = null;
let markersHarta = [];
let currentFontSize = 1.1; 
let isSpeaking = false;    

function toggleTema() {
    document.body.classList.toggle('light-mode');
    if(document.body.classList.contains('light-mode')) {
        localStorage.setItem('tema', 'light');
    } else {
        localStorage.setItem('tema', 'dark');
    }
}

const dateLocatii = {
    iisus: { culoare: '#1f6feb', puncte: [{ nume: "Betleem", coor: [31.7054, 35.2024], info: "Locul Nașterii Domnului." }, { nume: "Nazaret", coor: [32.7019, 35.3033], info: "Unde a crescut Iisus." }, { nume: "Râul Iordan", coor: [31.8369, 35.5451], info: "Locul Botezului." }, { nume: "Pustiul Iudeii", coor: [31.695, 35.350], info: "Ispitirea de 40 de zile." }, { nume: "Cana Galileii", coor: [32.747, 35.332], info: "Prima minune." }, { nume: "Capernaum", coor: [32.881, 35.575], info: "Centrul activității în Galileea." }, { nume: "Marea Galileii", coor: [32.8235, 35.5874], info: "Mersul pe ape." }, { nume: "Muntele Tabor", coor: [32.686, 35.392], info: "Schimbarea la Față." }, { nume: "Ierihon", coor: [31.856, 35.463], info: "Întâlnirea cu Zacheu." }, { nume: "Betania", coor: [31.771, 35.250], info: "Învierea lui Lazăr." }, { nume: "Ierusalim", coor: [31.7683, 35.2137], info: "Răstignirea și Învierea." }] },
    moise: { culoare: '#e3b341', puncte: [{ nume: "Egipt (Gosen)", coor: [30.78, 31.83], info: "Plecarea din robie." }, { nume: "Sucot", coor: [30.55, 32.20], info: "Prima oprire." }, { nume: "Marea Roșie", coor: [29.60, 32.50], info: "Trecerea miraculoasă." }, { nume: "Mara", coor: [29.20, 32.80], info: "Izvorul cu apă amară." }, { nume: "Elim", coor: [29.10, 33.00], info: "Popasul la cele 12 izvoare." }, { nume: "Muntele Sinai", coor: [28.53, 33.97], info: "Cele 10 Porunci." }, { nume: "Cadeș-Barnea", coor: [30.60, 34.40], info: "Rătăcirea în pustiu." }, { nume: "Edom", coor: [30.30, 35.40], info: "Ocolirea ținutului Edom." }, { nume: "Muntele Hor", coor: [30.31, 35.41], info: "Moartea lui Aaron." }, { nume: "Câmpia Moabului", coor: [31.80, 35.70], info: "Ultima tabără." }, { nume: "Muntele Nebo", coor: [31.76, 35.72], info: "Moise vede Țara Făgăduinței." }] },
    samson: { culoare: '#ff4d4d', puncte: [{ nume: "Țora", coor: [31.776, 34.989], info: "Locul nașterii lui Samson." }, { nume: "Timna", coor: [31.737, 34.904], info: "Unde a ucis leul și s-a căsătorit." }, { nume: "Valea Sorek", coor: [31.76, 34.88], info: "Locul unde a întâlnit-o pe Dalila." }, { nume: "Gaza", coor: [31.50, 34.466], info: "A smuls porțile cetății și a fost dus în captivitate." }] },
    maria: { culoare: '#ffffff', puncte: [{ nume: "Nazaret", coor: [32.7019, 35.3033], info: "Buna Vestire." }, { nume: "Ain Karem", coor: [31.767, 35.161], info: "Vizita la verișoara Elisabeta." }, { nume: "Betleem", coor: [31.705, 35.202], info: "Nașterea Pruncului Iisus." }, { nume: "Ierusalim", coor: [31.768, 35.213], info: "Prezentarea la Templu." }, { nume: "Egipt", coor: [30.040, 31.230], info: "Fuga în Egipt pentru a scăpa de Irod." }, { nume: "Efes", coor: [37.940, 27.340], info: "Se crede că a trăit aici cu Sf. Ioan." }] },
    andrei: { culoare: '#3399ff', puncte: [{ nume: "Ierusalim", coor: [31.768, 35.213], info: "Punctul de plecare după Cincizecime." }, { nume: "Bizanț", coor: [41.008, 28.978], info: "A predicat pe țărmul Mării Negre." }, { nume: "Scythia Minor (Dobrogea)", coor: [44.093, 27.946], info: "Peștera Sf. Andrei, leagănul creștinismului românesc." }, { nume: "Patras", coor: [38.246, 21.735], info: "Locul martiriului pe o cruce în formă de X." }] },
    matei: { culoare: '#27ae60', puncte: [{ nume: "Ierusalim", coor: [31.768, 35.213], info: "A scris prima Evanghelie." }, { nume: "Antiohia", coor: [36.200, 36.150], info: "Misiuni de predicare alături de alți apostoli." }, { nume: "Persia", coor: [32.427, 53.688], info: "Călătorii misionare în Orient." }, { nume: "Etiopia", coor: [9.145, 40.489], info: "Locul în care tradiția spune că a fost martirizat." }] },
    iuda: { culoare: '#808080', puncte: [{ nume: "Templul din Ierusalim", coor: [31.778, 35.235], info: "Trădarea pentru 30 de arginți." }, { nume: "Grădina Ghetsimani", coor: [31.779, 35.240], info: "Sărutul trădării și arestarea Mântuitorului." }, { nume: "Aceldama", coor: [31.765, 35.231], info: "Țarina Sângelui, locul sfârșitului său tragic." }] },
    iacob: { culoare: '#e67e22', puncte: [{ nume: "Capernaum", coor: [32.881, 35.575], info: "A lăsat mrejele și l-a urmat pe Iisus alături de fratele său Ioan." }, { nume: "Zaragoza (Spania)", coor: [41.648, -0.889], info: "Tradiția spune că a predicat în Spania (originea pelerinajului Camino de Santiago)." }, { nume: "Ierusalim", coor: [31.768, 35.213], info: "Primul apostol martirizat, ucis de Irod Agripa." }] },
    filip: { culoare: '#9b59b6', puncte: [{ nume: "Betsaida", coor: [32.909, 35.620], info: "Orașul natal al lui Filip, ca și al lui Petru și Andrei." }, { nume: "Ierusalim", coor: [31.768, 35.213], info: "A fost prezent alături de ceilalți apostoli la Cincizecime." }, { nume: "Hierapolis (Turcia)", coor: [37.925, 29.126], info: "Locul unde a predicat, a făcut minuni și a fost martirizat." }] },
    bartolomeu: { culoare: '#1abc9c', puncte: [{ nume: "Cana Galileii", coor: [32.747, 35.332], info: "Cunoscut și sub numele de Natanael, originar din Cana." }, { nume: "India", coor: [19.240, 73.130], info: "Tradiția spune că a propovăduit Evanghelia în regiunea Indiei." }, { nume: "Albanopolis (Armenia)", coor: [39.960, 44.550], info: "A creștinat Armenia, unde a suferit un martiriu crunt." }] },
    ioan: { culoare: '#ff7675', puncte: [{ nume: "Ierusalim", coor: [31.768, 35.213], info: "Apropiat al Domnului, Ioan a avut grijă de Fecioara Maria după Răstignire." }, { nume: "Efes (Turcia)", coor: [37.940, 27.340], info: "A predicat în Asia Mică și a condus comunitatea creștină de aici." }, { nume: "Insula Patmos (Grecia)", coor: [37.315, 26.542], info: "Exilat de împăratul Domițian, unde a scris cartea Apocalipsei." }] },
    toma: { culoare: '#fdcb6e', puncte: [{ nume: "Ierusalim", coor: [31.768, 35.213], info: "Cunoscut pentru momentele de îndoială de după Înviere, corectate de Iisus." }, { nume: "Edessa (Mesopotamia)", coor: [37.158, 38.791], info: "A predicat în drumul său spre est, lăsând comunități creștine timpurii." }, { nume: "Muziris (India)", coor: [10.155, 76.225], info: "A debarcat în India (Kerala), unde a întemeiat comunitatea creștinilor sirieni de Malabar." }, { nume: "Mylapore (Chennai)", coor: [13.033, 80.278], info: "Locul martiriului său, străpuns cu sulița pe Muntele Sf. Toma." }] },
    iacob_mic: { culoare: '#6c5ce7', puncte: [{ nume: "Ierusalim", coor: [31.768, 35.213], info: "Fiul lui Alfeu, adesea numit Iacob cel Mic pentru a fi distins de fratele lui Ioan." }, { nume: "Ierihon", coor: [31.856, 35.463], info: "A propovăduit Evanghelia în regiunea Iudeei." }, { nume: "Ostrakine (Egipt)", coor: [31.119, 33.512], info: "Tradiția spune că a fost martirizat în Egipt, fiind răstignit pe cruce." }] },
    simon_zelotul: { culoare: '#00cec9', puncte: [{ nume: "Ierusalim", coor: [31.768, 35.213], info: "Numit 'Zelotul' pentru râvna sa deosebită în păstrarea Legii." }, { nume: "Egipt", coor: [30.044, 31.235], info: "A călătorit și a predicat în Nordul Africii înainte de a merge în Orient." }, { nume: "Suanir (Persia)", coor: [32.427, 53.688], info: "A suferit moarte martirică alături de Sf. Iuda Tadeu, fiind tăiat cu fierăstrăul." }] },
    iuda_tadeu: { 
        culoare: '#ffeaa7', 
        puncte: [
            { nume: "Ierusalim", coor: [31.768, 35.213], info: "Autorul unei epistole din Noul Testament, numit și Tadeu pentru a nu fi confundat cu Iscarioteanul." }, 
            { nume: "Mesopotamia", coor: [33.315, 44.366], info: "A vestit Cuvântul în regiunile Irakului de astăzi." }, 
            { nume: "Beirut (Liban)", coor: [33.893, 35.501], info: "Conform tradiției, a propovăduit și în Fenicia, unde a îndurat multe suferințe pentru Hristos." }
        ] 
    }, 

    petru: {
        culoare: '#ff7b72', 
        puncte: [
            { nume: "Ierusalim", coor: [31.7683, 35.2137], info: "Ridicarea Bisericii timpurii după Cincizecime și Predicarea de la Templu." },
            { nume: "Iope (Jaffa)", coor: [32.0554, 34.7531], info: "Minunea învierii Tabitei și viziunea feței de masă cu animale (Trimiterea la neamuri)." },
            { nume: "Cezareea Maritima", coor: [32.5050, 34.8922], info: "Botezul sutașului Corneliu, primul păgân convertit oficial la creștinism." },
            { nume: "Antiohia", coor: [36.2023, 36.1613], info: "Petru conduce comunitatea creștină de aici (unde ucenicii au fost numiți 'creștini' pentru prima oară)." },
            { nume: "Roma", coor: [41.9028, 12.4964], info: "Locul martiriului Sfântului Apostol Petru." }
        ]
    } 
}; 


window.onload = () => {
    if(localStorage.getItem('tema') === 'light') {
        document.body.classList.add('light-mode');
    }

    incarcaBiblia();
    initHarta();
    
    const searchBtn = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    if (searchBtn) searchBtn.onclick = cautaInBiblie;
    if (searchInput) {
        searchInput.onkeypress = (e) => {
            if (e.key === 'Enter') cautaInBiblie();
        };
    }
    
    const audioEl = document.getElementById('bg-audio');
    const volEl = document.getElementById('volume-control');
    if(audioEl && volEl) {
        audioEl.volume = volEl.value;
    }
};

function initHarta() {
   try {
        
        leafletMap = L.map('map', {
            
            dragging: !L.Browser.mobile,
            tap: !L.Browser.mobile,
            scrollWheelZoom: false 
        }).setView([31.5, 35.0], 6);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap'
        }).addTo(leafletMap);

        schimbaHarta('iisus');
    } catch (e) {
        console.error("Eroare la inițializarea hărții:", e);
    }
}

function schimbaHarta(tip) {
    const data = dateLocatii[tip];
    if (!data) return;

    if (layerTraseu) leafletMap.removeLayer(layerTraseu);
    markersHarta.forEach(m => leafletMap.removeLayer(m));
    markersHarta = [];
    let puncteTraseu = [];

    data.puncte.forEach(p => {
        const marker = L.marker(p.coor).addTo(leafletMap).bindPopup(`<b>${p.nume}</b><br>${p.info}`);
        marker.bindTooltip(p.nume, { permanent: true, direction: 'top', className: 'label-romana' });
        markersHarta.push(marker);
        puncteTraseu.push(p.coor);
    });

    layerTraseu = L.polyline(puncteTraseu, {
        color: data.culoare,
        weight: 4,
        className: 'animated-route' 
    }).addTo(leafletMap);

    const bounds = L.latLngBounds(puncteTraseu);
    leafletMap.flyToBounds(bounds, { padding: [40, 40], maxZoom: 8 });

    setTimeout(() => { leafletMap.invalidateSize(); }, 200);
}

function toggleFullscreen() {
    const mapContainer = document.getElementById('map-container');
    if (!document.fullscreenElement) {
        if (mapContainer.requestFullscreen) { mapContainer.requestFullscreen(); } 
        else if (mapContainer.webkitRequestFullscreen) { mapContainer.webkitRequestFullscreen(); } 
        else if (mapContainer.msRequestFullscreen) { mapContainer.msRequestFullscreen(); }
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); }
    }
}

window.onbeforeunload = () => { window.speechSynthesis.cancel(); };

async function incarcaBiblia() {
    try {
        const response = await fetch(XML_FILE);
        if (!response.ok) throw new Error("Fișierul XML nu a fost găsit!");
        const xmlText = await response.text();
        xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");
        afiseazaMeniulCarti(xmlDoc.getElementsByTagName("book"));
    } catch (error) {
        console.error("Eroare XML:", error);
    }
}

function afiseazaMeniulCarti(carti) {
    window.speechSynthesis.cancel();
    const nav = document.getElementById('books-nav');
    nav.innerHTML = "";
    let noulTestamentinceput = false;

    const vtLabel = document.createElement('div');
    vtLabel.className = 'testament-label';
    vtLabel.textContent = 'Vechiul Testament';
    nav.appendChild(vtLabel);

    Array.from(carti).forEach(carte => {
        const id = carte.getAttribute("id");
        const nume = carte.getElementsByTagName("h")[0]?.textContent || id;

        if (!noulTestamentinceput && (id === "MAT" || nume.toLowerCase().includes("matei"))) {
            const ntLabel = document.createElement('div');
            ntLabel.className = 'testament-label';
            ntLabel.textContent = 'Noul Testament';
            nav.appendChild(ntLabel);
            noulTestamentinceput = true;
        }

        const btn = document.createElement('button');
        btn.textContent = nume;
        btn.onclick = () => afiseazaCapitole(carte, nume);
        nav.appendChild(btn);
    });
}

function afiseazaCapitole(carteNode, nume) {
    window.speechSynthesis.cancel();
    const container = document.getElementById('bible-content');
    const capitole = carteNode.getElementsByTagName("c");
    
    let html = `<h2>${nume}</h2><div class="chapter-grid">`;
    Array.from(capitole).forEach(cap => {
        const capId = cap.getAttribute("id");
        html += `<button class="chapter-btn" onclick="incarcaVerset('${nume}', '${capId}')">${capId}</button>`;
    });
    html += `</div><div style="text-align:center"><button onclick="location.reload()">⬅ Înapoi</button></div>`;
    
    container.innerHTML = html;
    document.getElementById('bible-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function incarcaVerset(numeCarte, nrCap) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    currentFontSize = 1.1;

    const container = document.getElementById('bible-content');
    const carti = Array.from(xmlDoc.getElementsByTagName("book"));
    const carteNode = carti.find(b => (b.getElementsByTagName("h")[0]?.textContent || b.getAttribute("id")) === numeCarte);

    let html = `<h2>${numeCarte} - Capitolul ${nrCap}</h2>
                <div class="accessibility-controls">
                    <button title="Micșorează Textul" onclick="changeFontSize(-1)">A-</button>
                    <button title="Mărește Textul" onclick="changeFontSize(1)">A+</button>
                    <button title="Citește Audio" onclick="toggleSpeech()" id="tts-btn">🔊 Ascultă Capitolul</button>
                </div>`;
    
    let gasitCapitol = false;
    const paragrafe = carteNode.getElementsByTagName("p");
    
    Array.from(paragrafe).forEach(p => {
        p.childNodes.forEach(node => {
            if (node.nodeName === "c" && node.getAttribute("id") === nrCap) {
                gasitCapitol = true;
            } else if (node.nodeName === "c" && node.getAttribute("id") !== nrCap) {
                gasitCapitol = false;
            }

            if (gasitCapitol && node.nodeName === "v") {
                const vNum = node.getAttribute("id");
                const vText = node.nextSibling ? node.nextSibling.textContent : "";
               html += `<p id="verset-${vNum}" class="verse" style="font-size: ${currentFontSize}rem"><span class="verse-number">${vNum}</span>${vText}</p>`;
            }
        });
    });

    html += `<div style="text-align:center; margin-top:30px;">
                <button onclick="window.scrollTo(0,0)">⬆ Sus</button>
                <button onclick="location.reload()">🏠 Acasă</button>
             </div>`;
    
    container.innerHTML = html;
    document.getElementById('bible-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function changeFontSize(step) {
    currentFontSize += step * 0.1;
    if(currentFontSize < 0.8) currentFontSize = 0.8;
    if(currentFontSize > 2.0) currentFontSize = 2.0;
    
    document.querySelectorAll('.verse').forEach(v => {
        v.style.fontSize = `${currentFontSize}rem`;
    });
}

function toggleSpeech() {
    const btn = document.getElementById('tts-btn');
    
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        btn.innerHTML = "🔊 Ascultă Capitolul";
    } else {
        const verses = Array.from(document.querySelectorAll('.verse'));
        // Excludem steluța din textul citit
        const textToSpeak = verses.map(v => v.textContent.replace('⭐', '')).join(' ');
        
        let utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'ro-RO';
        
        utterance.onend = () => {
            isSpeaking = false;
            if(btn) btn.innerHTML = "🔊 Ascultă Capitolul";
        };
        
        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
        btn.innerHTML = "⏹ Oprește Citirea";
    }
}
    function scrolleazaLaVerset(numarVerset) {
    const elementVerset = document.getElementById(`verset-${numarVerset}`);
    
    if (elementVerset) {
        // Face scroll fin până la verset, aducându-l în mijlocul ecranului
        elementVerset.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        // Efect vizual temporar (opțional, dar recomandat)
        elementVerset.classList.add('verset-evidentiat');
        setTimeout(() => {
            elementVerset.classList.remove('verset-evidentiat');
        }, 2000);
    }
}
function cautaInBiblie() {
    const query = document.getElementById('search-input').value.trim().toLowerCase();
    if (!query) {
        alert("Te rugăm să introduci un termen de căutare!");
        return;
    }
    if (!xmlDoc) {
        alert("Baza de date a Bibliei se încarcă, te rugăm să reîncerci în câteva secunde.");
        return;
    }

    window.speechSynthesis.cancel();
    const container = document.getElementById('bible-content');
    container.innerHTML = `<h2>Rezultatele căutării pentru: "${query}"</h2><div id="search-results" class="search-results-list"></div>`;
    const resultsList = document.getElementById('search-results');

    const books = xmlDoc.getElementsByTagName("book");
    let totalRezultate = 0;

    Array.from(books).forEach(book => {
        const bookName = book.getElementsByTagName("h")[0]?.textContent || book.getAttribute("id");
        const paragrafe = book.getElementsByTagName("p");
        let currentChapter = "1";
        
        Array.from(paragrafe).forEach(p => {
            p.childNodes.forEach(node => {
                if (node.nodeName === "c") {
                    currentChapter = node.getAttribute("id");
                }
                if (node.nodeName === "v") {
                    const vNum = node.getAttribute("id");
                    const vText = node.nextSibling ? node.nextSibling.textContent : "";
                    
                    if (vText.toLowerCase().includes(query)) {
                        totalRezultate++;
                        if (totalRezultate <= 100) {
                            const resDiv = document.createElement('div');
                            resDiv.className = 'search-item';
                            resDiv.innerHTML = `
                                <div class="search-item-header">${bookName} - Capitolul ${currentChapter}, Versetul ${vNum}</div>
                                <p class="search-item-text">... ${vText.replace(new RegExp(query, 'gi'), match => `<mark>${match}</mark>`)} ...</p>
                            `;
                            resDiv.onclick = () => incarcaVerset(bookName, currentChapter);
                            resultsList.appendChild(resDiv);
                        }
                    }
                }
            });
        });
    });

    if (totalRezultate === 0) {
        resultsList.innerHTML = `<p style="text-align:center; color:#8b949e; margin: 20px 0;">Nu s-au găsit versete care să conțină acest termen.</p>`;
    } else if (totalRezultate > 100) {
        const infoText = document.createElement('p');
        infoText.style.cssText = "text-align:center; color:#79c0ff; font-size:0.9rem; margin-top:20px;";
        infoText.textContent = `S-au găsit în total ${totalRezultate} rezultate. Se afișează primele 100.`;
        resultsList.appendChild(infoText);
    }
    
    const backBtnDiv = document.createElement('div');
    backBtnDiv.style.cssText = "text-align:center; margin-top:30px;";
    backBtnDiv.innerHTML = `<button onclick="location.reload()">🏠 Înapoi la Cărți</button>`;
    container.appendChild(backBtnDiv);
    
    window.scrollTo(0, 0);
}

function schimbaMuzica() {
    const audio = document.getElementById('bg-audio');
    const selector = document.getElementById('music-selector');
    const status = document.getElementById('music-status');
    const playBtn = document.getElementById('play-pause-btn');

    if (selector.value === "") {
        audio.pause();
        audio.currentTime = 0;
        if(status) status.innerText = "Liniște ambientală";
        playBtn.innerHTML = "▶️ Start";
        return;
    }

    audio.src = selector.value;
    audio.play()
        .then(() => { 
            if(status) status.innerText = "Se redă: " + selector.options[selector.selectedIndex].text;
            playBtn.innerHTML = "⏸ Pauză"; 
        })
        .catch(err => {
            if(status) status.innerText = "Apasă pe Start pentru a asculta.";
        });
}

function toggleMuzica() {
    const audio = document.getElementById('bg-audio');
    const selector = document.getElementById('music-selector');
    const playBtn = document.getElementById('play-pause-btn');

    if (selector.value === "") {
        alert("Te rugăm să alegi mai întâi o cântare din lista alăturată!");
        return;
    }

    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = "⏸ Pauză";
    } else {
        audio.pause();
        playBtn.innerHTML = "▶️ Start";
    }
}

function schimbaVolum() {
    const audio = document.getElementById('bg-audio');
    const volCtrl = document.getElementById('volume-control');
    audio.volume = volCtrl.value;
}

function toggleApostoli() {
    const submenu = document.getElementById('apostoli-submenu');
    if (submenu.style.display === 'none') {
        submenu.style.display = 'flex';
    } else {
        submenu.style.display = 'none';
    }
}

/* ==================== SISTEM QUIZ BIBLIC ==================== */
const bancaDeIntrebari = {
    usor: [
        { intrebare: "Cine a construit arca pentru a scăpa de Potop?", optiuni: ["Avraam", "Moise", "Noe", "David"], raspunsCorect: 2 },
        { intrebare: "Câte zile a durat crearea lumii?", optiuni: ["3", "6", "7", "40"], raspunsCorect: 1 },
        { intrebare: "În ce oraș S-a născut Iisus Hristos?", optiuni: ["Ierusalim", "Nazaret", "Betleem", "Ierihon"], raspunsCorect: 2 },
        { intrebare: "Cine l-a trădat pe Iisus?", optiuni: ["Petru", "Iuda", "Toma", "Matei"], raspunsCorect: 1 },
        { intrebare: "Ce pasăre a adus o ramură de măslin la corabia lui Noe?", optiuni: ["Porumbelul", "Corbul", "Vulturul", "Vrăbiuța"], raspunsCorect: 0 },
        { intrebare: "Cine a învins uriașul Goliat?", optiuni: ["Saul", "Samson", "David", "Solomon"], raspunsCorect: 2 },
        { intrebare: "Câte porunci a primit Moise pe Muntele Sinai?", optiuni: ["7", "10", "12", "40"], raspunsCorect: 1 },
        { intrebare: "Care este prima carte a Bibliei?", optiuni: ["Exodul", "Geneza (Facerea)", "Psalmii", "Evanghelia după Matei"], raspunsCorect: 1 },
        { intrebare: "Cine a fost înghițit de un pește mare?", optiuni: ["Iona", "Iov", "Ilie", "Daniel"], raspunsCorect: 0 },
        { intrebare: "Cum se numea mama lui Iisus?", optiuni: ["Marta", "Maria", "Magdalena", "Elisabeta"], raspunsCorect: 1 },
        { intrebare: "Câți ucenici (apostoli) apropiați a ales Iisus?", optiuni: ["7", "10", "12", "40"], raspunsCorect: 2 },
{ intrebare: "Ce mare s-a deschis în două pentru a lăsa israeliții să scape de egipteni?", optiuni: ["Marea Moartă", "Marea Roșie", "Marea Mediterană", "Marea Galileii"], raspunsCorect: 1 },
{ intrebare: "Din ce a fost creată prima femeie, Eva?", optiuni: ["Din țărână", "Dintr-o coastă a lui Adam", "Dintr-o piatră", "Din lumină"], raspunsCorect: 1 },
{ intrebare: "Cine a fost fratele mai mic al lui Iacov, vândut de frații săi în Egipt?", optiuni: ["Iosif", "Beniamin", "Ruben", "Iuda"], raspunsCorect: 0 },
{ intrebare: "În ce oraș a crescut Iisus în timpul copilăriei Sale?", optiuni: ["Ierusalim", "Betleem", "Nazaret", "Capernaum"], raspunsCorect: 2 },
{ intrebare: "Cine a fost omul înzestrat de Dumnezeu cu o forță uriașă în părul său?", optiuni: ["David", "Samson", "Ghedeon", "Saul"], raspunsCorect: 1 },
{ intrebare: "Ce prieten al lui Iisus a fost înviat după ce stătuse patru zile în mormânt?", optiuni: ["Lazăr", "Iair", "Petru", "Toma"], raspunsCorect: 0 },
{ intrebare: "Care a fost primul miracol (minune) făcut de Iisus în public?", optiuni: ["Mersul pe apă", "Vindecarea unui orb", "Transformarea apei în vin", "Înmulțirea pâinilor"], raspunsCorect: 2 },
{ intrebare: "Cine a primit o haină pestriță (în multe culori) de la tatăl său, Iacov?", optiuni: ["Iisus", "Iosif", "Moise", "David"], raspunsCorect: 1 },
{ intrebare: "Cum se numește ultima carte din structura Bibliei?", optiuni: ["Psalmii", "Evanghelia după Ioan", "Epistola către Romani", "Apocalipsa"], raspunsCorect: 3 }
    ],
    mediu: [
        { intrebare: "La ce vârstă a murit Matusalem?", optiuni: ["969 de ani", "120 de ani", "850 de ani", "900 de ani"], raspunsCorect: 0 },
        { intrebare: "Care apostol era vameș înainte de a fi chemat de Iisus?", optiuni: ["Luca", "Ioan", "Matei", "Andrei"], raspunsCorect: 2 },
        { intrebare: "Unde au fost încurcate limbile oamenilor?", optiuni: ["Sodoma", "Turnul Babel", "Egipt", "Ierihon"], raspunsCorect: 1 },
        { intrebare: "Cine a fost aruncat în groapa cu lei?", optiuni: ["Daniel", "Iosif", "Ieremia", "Șadrac"], raspunsCorect: 0 },
        { intrebare: "Câți ani au rătăcit israeliții în pustiu?", optiuni: ["20", "30", "40", "50"], raspunsCorect: 2 },
        { intrebare: "Cum se numea fratele lui Moise?", optiuni: ["Iosua", "Aaron", "Caleb", "Miriam"], raspunsCorect: 1 },
        { intrebare: "Ce minune a făcut Iisus la nunta din Cana Galileii?", optiuni: ["Înmulțirea pâinilor", "Vindecarea orbului", "Transformarea apei în vin", "Învierea lui Lazăr"], raspunsCorect: 2 },
        { intrebare: "Cine a tăiat părul lui Samson?", optiuni: ["Dalila", "Rut", "Estera", "Rahav"], raspunsCorect: 0 },
        { intrebare: "Ce meserie avea Iosif, tatăl purtător de grijă al lui Iisus?", optiuni: ["Pescar", "Fierar", "Tâmplar", "Păstor"], raspunsCorect: 2 },
        { intrebare: "Care Evanghelie nu face parte din cele Sinoptice?", optiuni: ["Matei", "Marcu", "Luca", "Ioan"], raspunsCorect: 3 },
        { intrebare: "Care este singurul evanghelist care menționează pilda fiului risipitor?", optiuni: ["Matei", "Marcu", "Luca", "Ioan"], raspunsCorect: 2 },
{ intrebare: "Ce rege a ordonat masacrul pruncilor din Betleem după nașterea lui Iisus?", optiuni: ["Irod cel Mare", "Irod Antipa", "Irod Agrippa", "Cezar August"], raspunsCorect: 0 },
{ intrebare: "Din ce material a fost construit Chivotul Legământului?", optiuni: ["Lemn de cedru", "Lemn de salcâm", "Lemn de măslin", "Aur masiv"], raspunsCorect: 1 },
{ intrebare: "Cine a fost judecătorul care l-a învins de unul singur pe uriașul Goliat?", optiuni: ["Samson", "Ghedeon", "David", "Saul"], raspunsCorect: 2 },
{ intrebare: "Cum se numea muntele pe care Avraam a fost trimis să îl jertfească pe Isaac?", optiuni: ["Moria", "Sinai", "Horeb", "Tabor"], raspunsCorect: 0 },
{ intrebare: "Ce animal i-a vorbit proorocului Balaam pentru a-l opri din drumul său?", optiuni: ["Un leu", "O măriță (măgăriță)", "Un șarpe", "Un vultur"], raspunsCorect: 1 },
{ intrebare: "Care dintre ucenici s-a îndoit de învierea lui Iisus până nu I-a văzut rănile?", optiuni: ["Petru", "Iacov", "Toma", "Filip"], raspunsCorect: 2 },
{ intrebare: "Cum se numea mama profetului Samuel, care s-a rugat intens la Templu pentru un copil?", optiuni: ["Ana", "Elisabeta", "Penina", "Noemi"], raspunsCorect: 0 },
{ intrebare: "Ce pedeapsă a primit Zaharia pentru că nu a crezut cuvintele îngerului Gavriil?", optiuni: ["A orbit", "A amuțit", "A fost alungat", "A paralizat"], raspunsCorect: 1 },
{ intrebare: "În ce râu a fost botezat Iisus Hristos de către Ioan Botezătorul?", optiuni: ["Nil", "Eufrat", "Iordan", "Tigru"], raspunsCorect: 2 }
    ],
    greu: [
        { intrebare: "Cine a fost primul rege al Israelului?", optiuni: ["David", "Saul", "Solomon", "Roboam"], raspunsCorect: 1 },
        { intrebare: "În ce islandă a scris Sfântul Ioan cartea Apocalipsei?", optiuni: ["Cipru", "Creta", "Patmos", "Malta"], raspunsCorect: 2 },
        { intrebare: "Cum se numea slujitorul căruia Petru i-a tăiat urechea în Ghetsimani?", optiuni: ["Malhus", "Corneliu", "Zacheu", "Caiafa"], raspunsCorect: 0 },
        { intrebare: "Câți prooroci ai lui Baal a înfruntat Ilie pe muntele Carmel?", optiuni: ["100", "300", "450", "850"], raspunsCorect: 2 },
        { intrebare: "Cine a fost tatăl lui Ioan Botezătorul?", optiuni: ["Zaharia", "Simeon", "Iosif", "Zebedei"], raspunsCorect: 0 },
        { intrebare: "Din ce seminție a lui Israel făcea parte apostolul Pavel?", optiuni: ["Iuda", "Beniamin", "Levi", "Simeon"], raspunsCorect: 1 },
        { intrebare: "Cine i-a luat locul lui Iuda Iscarioteanul în rândul celor 12 apostoli?", optiuni: ["Pavel", "Barnaba", "Matia", "Ștefan"], raspunsCorect: 2 },
        { intrebare: "Cum se numea soția lui Moise?", optiuni: ["Sefora", "Rahela", "Lea", "Rebeca"], raspunsCorect: 0 },
        { intrebare: "Care este cel mai scurt verset din Biblie (în versiunea clasică)?", optiuni: ["Să nu furi.", "Iisus a plâns.", "Rugați-vă neîncetat.", "Domnul este Păstorul meu."], raspunsCorect: 1 },
        { intrebare: "Ce rege babilonian a cucerit Ierusalimul și a distrus primul Templu?", optiuni: ["Cirus", "Darius", "Belșațar", "Nebucadnețar (Nabucodonosor)"], raspunsCorect: 3 },
        { intrebare: "Care a fost numele primului om care nu a cunoscut moartea, fiind luat la cer de Dumnezeu?", optiuni: ["Ioan" ,"Saul", "Enoh", "Matia"], raspunsCorect: 2 },
        { intrebare: "Ce rege a murit fiind mâncat de viermi după ce nu I-a dat slavă lui Dumnezeu?", optiuni: ["Irod Antipa", "Irod cel Mare", "Irod Agrippa I", "Ahaz"], raspunsCorect: 2 },
{ intrebare: "Cine a fost singura femeie judecător din Israel menționată în Vechiul Testament?", optiuni: ["Rut", "Debora", "Estera", "Iael"], raspunsCorect: 1 },
{ intrebare: "Cum se numea tatăl lui Avraam?", optiuni: ["Terah", "Nahor", "Haran", "Nenrod"], raspunsCorect: 0 },
{ intrebare: "Ce râu a trebuit să treacă Iosua și poporul Israel pentru a intra în Canaan?", optiuni: ["Nil", "Eufrat", "Iordan", "Tigru"], raspunsCorect: 2 },
{ intrebare: "În ce oraș din Grecia a predicat Pavel în Areopag?", optiuni: ["Corint", "Atena", "Tesalonic", "Filipi"], raspunsCorect: 1 },
{ intrebare: "Care este singura carte din Noul Testament adresată unei femei (Alesei Doamne)?", optiuni: ["Iacov", "1 Ioan", "2 Ioan", "Filimon"], raspunsCorect: 2 },
{ intrebare: "Câți oameni au fost salvați pe corabia lui Noe în timpul potopului?", optiuni: ["2", "4", "8", "12"], raspunsCorect: 2 },
{ intrebare: "Ce meserie avea evanghelistul Luca?", optiuni: ["Vameș", "Medic", "Pescar", "Corturar"], raspunsCorect: 1 },
{ intrebare: "Cine a fost mama lui Solomon?", optiuni: ["Batșeba", "Abigaela", "Mical", "Agat"], raspunsCorect: 0 },
{ intrebare: "Pe ce munte a murit Moise fără să poată intra în Țara Promisă?", optiuni: ["Sinai", "Nebo", "Ararat", "Carmel"], raspunsCorect: 1 }
    ]
};

let intrebariCurente = [];
let indexIntrebareCurenta = 0;
let scor = 0;
const numarMaxIntrebari = 8; 
let raspunsDat = false;

function amestecaArray(array) {
    let arrayCopie = [...array];
    for (let i = arrayCopie.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayCopie[i], arrayCopie[j]] = [arrayCopie[j], arrayCopie[i]];
    }
    return arrayCopie;
}
function startQuiz(dificultate) {
    const toateIntrebarile = bancaDeIntrebari[dificultate];
    
    // 1. Amestecăm mai întâi întrebările și selectăm numărul maxim (așa cum făceai deja)
    const intrebariSelectate = amestecaArray(toateIntrebarile).slice(0, numarMaxIntrebari);
    
    // 2. Pentru fiecare întrebare selectată, amestecăm și opțiunile de răspuns
    intrebariCurente = intrebariSelectate.map(item => {
        // Salvăm textul răspunsului corect înainte de amestecare (ex: "Noe")
        const textRaspunsCorect = item.optiuni[item.raspunsCorect];
        
        // Amestecăm opțiunile folosind funcția ta existentă
        const optiuniAmestecate = amestecaArray(item.optiuni);
        
        // Găsim noul index (poziție) al răspunsului corect în lista proaspăt amestecată
        const noulIndexCorect = optiuniAmestecate.indexOf(textRaspunsCorect);
        
        // Returnăm un nou obiect pentru întrebare, cu opțiunile și indexul corect actualizate
        return {
            intrebare: item.intrebare,
            optiuni: optiuniAmestecate,
            raspunsCorect: noulIndexCorect
        };
    });
    
    // Resetăm variabilele de stare pentru noul joc
    indexIntrebareCurenta = 0;
    scor = 0;
    
    // Schimbăm ecranele în interfață
    document.getElementById('quiz-menu').style.display = 'none';
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-area').style.display = 'block';
    
    // Încărcăm prima întrebare complet randomizată
    incarcaIntrebare();
}

function incarcaIntrebare() {
    raspunsDat = false;
    document.getElementById('next-btn').style.display = 'none';
    
    const intrebareData = intrebariCurente[indexIntrebareCurenta];
    
    document.getElementById('quiz-progress').innerText = `Întrebarea ${indexIntrebareCurenta + 1} / ${numarMaxIntrebari}`;
    document.getElementById('quiz-score-live').innerText = `Scor: ${scor}`;
    document.getElementById('question-text').innerText = intrebareData.intrebare;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    intrebareData.optiuni.forEach((optiune, index) => {
        const btn = document.createElement('button');
        btn.innerText = optiune;
        btn.onclick = () => verificaRaspuns(index, btn);
        optionsContainer.appendChild(btn);
    });
}

function verificaRaspuns(indexSelectat, butonApasat) {
    if (raspunsDat) return; 
    raspunsDat = true;
    
    const intrebareData = intrebariCurente[indexIntrebareCurenta];
    const indexCorect = intrebareData.raspunsCorect;
    const butoane = document.getElementById('options-container').children;
    
    if (indexSelectat === indexCorect) {
        butonApasat.classList.add('correct');
        scor++;
        document.getElementById('quiz-score-live').innerText = `Scor: ${scor}`;
    } else {
        butonApasat.classList.add('wrong');
        butoane[indexCorect].classList.add('correct');
    }
    
    document.getElementById('next-btn').style.display = 'inline-block';
}

function urmatoareaIntrebare() {
    indexIntrebareCurenta++;
    if (indexIntrebareCurenta < intrebariCurente.length) {
        incarcaIntrebare();
    } else {
        afiseazaRezultatFinal();
    }
}

function afiseazaRezultatFinal() {
    document.getElementById('quiz-area').style.display = 'none';
    const rezultatDiv = document.getElementById('quiz-result');
    rezultatDiv.style.display = 'block';
    
    document.getElementById('final-score-text').innerText = `Ai obținut ${scor} din ${numarMaxIntrebari} puncte!`;
    
    let mesaj = "";
    if (scor === numarMaxIntrebari) mesaj = "Perfect! Ești un adevărat teolog!";
    else if (scor >= numarMaxIntrebari / 2) mesaj = "Foarte bine! Ai cunoștințe biblice solide.";
    else mesaj = "Mai ai de aprofundat, dar ești pe drumul cel bun. Continuă să citești Scriptura!";
    
    document.getElementById('final-message').innerText = mesaj;
}

function reseteazaQuiz() {
    document.getElementById('quiz-result').style.display = 'none';
    document.getElementById('quiz-menu').style.display = 'block';
}


    