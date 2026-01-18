let searchResults = [];
let currentEditingId = null;
let userLocation = null;

function requestLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                };
                console.log("Loc ok");
            },
            (err) => console.warn("Loc err")
        );
    }
}

/* // Initialize Geolocation immediately
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLocation = {
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            console.log("ðŸ“ Location acquired:", userLocation);
        },
        (error) => {
            console.warn("⚠️ Location access denied or error:", error.message);
        }
    );
} else {
    console.warn("⚠️ Geolocation not supported by this browser.");
}

*/
// Search Modal Control
const searchResultsModal = document.getElementById('searchResultsModal');

function openSearchResultsModal() {
    searchResultsModal.classList.add('open');
}

function closeSearchResultsModal() {
    searchResultsModal.classList.remove('open');
}

// Search Logic - Google Maps Direct
function searchNearMe() {
    const term = searchInput.value.trim();

    // Visual feedback
    venueList.innerHTML = '<div class="empty-state"><p>ðŸš€ Abriendo Google Maps...</p></div>';

    const query = term.length > 0 ? term : 'restaurantes y bares';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    // Open in new tab
    window.open(url, '_blank');
}

// Legacy search functions removed for stability


// DOM Elements
const searchInput = document.getElementById('searchInput');
const venueList = document.getElementById('venueList');
const modal = document.getElementById('detailModal');

// Inputs
const inputName = document.getElementById('inputName');
const inputAddress = document.getElementById('inputAddress');
const inputPhone = document.getElementById('inputPhone');
const inputEmail = document.getElementById('inputEmail');
const inputNotes = document.getElementById('inputNotes');
const btnCall = document.getElementById('btnCall');
const btnEmail = document.getElementById('btnEmail');


// === SEARCH LOGIC ===
let debounceTimer;
searchInput.addEventListener('input', (e) => {
    // Ask for location when typing starts
    if (!userLocation) requestLocation();

    clearTimeout(debounceTimer);
    const query = e.target.value.trim();

    if (query.length < 3) return;

    debounceTimer = setTimeout(() => {
        performSearch(query);
    }, 600);
});

async function performSearch(query) {
    venueList.innerHTML = '<div class="empty-state"><p>Buscando...</p></div>';
    openSearchResultsModal(); // Show loading in modal

    try {
        // Strategy 1: Search in Extremadura first
        let data = await runNominatimSearch(`${query} Extremadura`);

        // Strategy 2: If no results, search globally
        if (!data || data.length === 0) {
            venueList.innerHTML = '<div class="empty-state"><p>Buscando fuera de Extremadura...</p></div>';
            data = await runNominatimSearch(query);
        }

        // Process Data
        let processedData = data.map(item => {
            const lat = parseFloat(item.lat);
            const lon = parseFloat(item.lon);
            let dist = null;

            if (userLocation) {
                dist = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lon, lat, lon);
            }

            // Extract contact info if available
            const extras = item.extratags || {};
            // Try specific keys for phone
            const phone = extras.phone || extras['contact:phone'] || extras['contact:mobile'] || '';
            // Try specific keys for email
            const email = extras.email || extras['contact:email'] || '';
            const website = extras.website || extras['contact:website'] || '';

            // Append website to notes if found, useful for sales rep
            let autoNotes = '';
            if (website) autoNotes = `Web: ${website}`;

            return {
                id: 'nom_' + item.place_id,
                name: item.name || item.display_name.split(',')[0],
                address: item.display_name,
                lat: lat,
                lon: lon,
                distance: dist,
                phone: phone,
                email: email,
                notes: autoNotes
            };
        });

        // Sort by distance (nearest first)
        if (userLocation) {
            processedData.sort((a, b) => a.distance - b.distance);
        }

        searchResults = processedData;
        try {
            localStorage.setItem('lastSearchResults', JSON.stringify(searchResults));
        } catch (e) {
            console.warn("Storage full?", e);
        }
        renderList(searchResults);
        openSearchResultsModal(); // Open modal with results
    } catch (error) {
        console.error(error);
        venueList.innerHTML = '<div class="empty-state"><p>Error al buscar. Intenta de nuevo.</p></div>';
        openSearchResultsModal();
    }
}


// === AI MAGIC REWRITE ===
async function runNominatimSearch(q) {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&addressdetails=1&extratags=1&limit=40`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
}

// Haversine Formula for distance
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

// === RENDER LOGIC ===
function renderList(data) {
    venueList.innerHTML = '';

    if (data.length === 0) {
        venueList.innerHTML = '<div class="empty-state"><p>No se encontraron resultados.</p></div>';
        return;
    }

    data.forEach(item => {
        // Format distance badge
        let distBadge = '';
        if (item.distance !== null && item.distance !== undefined) {
            const d = item.distance < 1 ? (item.distance * 1000).toFixed(0) + ' m' : item.distance.toFixed(1) + ' km';
            distBadge = `<span style="font-size:0.75rem; color:var(--success); background:rgba(0,255,136,0.1); padding:2px 6px; border-radius:4px; margin-left:8px;">${d}</span>`;
        }

        const card = document.createElement('div');
        card.className = 'venue-card';
        card.innerHTML = `
            <div class="venue-header">
                <div>
                    <span class="venue-name">${item.name}</span>
                    ${distBadge}
                </div>
            </div>
            <div class="venue-address">
                <i class="fa-solid fa-location-dot"></i>
                <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.address}</span>
            </div>
            <div class="actions">
                <button onclick="openDetail('${item.id}')" class="action-btn btn-primary">
                    VER FICHA
                </button>
                <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.name + ' ' + item.address)}" target="_blank" class="action-btn btn-secondary">
                    MAPA
                </a>
            </div>
        `;
        venueList.appendChild(card);
    });
}

// === MODAL & DATA ===
function openDetail(id) {
    const item = searchResults.find(i => i.id === id);
    if (!item) return;

    currentEditingId = id;

    // Fill fields
    document.getElementById('modalTitle').innerText = item.name;
    inputName.value = item.name;
    inputAddress.value = item.address;
    inputPhone.value = item.phone || '';
    inputEmail.value = item.email || '';

    // Load Notes: Prefer user saved notes over API notes
    const savedNotes = JSON.parse(localStorage.getItem('venueNotes') || '{}');
    if (savedNotes[id] !== undefined) {
        inputNotes.value = savedNotes[id];
    } else {
        inputNotes.value = item.notes || '';
    }

    updateActionLinks();

    modal.classList.add('open');
}

function closeModal() {
    modal.classList.remove('open');
    currentEditingId = null;
}

function updateActionLinks() {
    btnCall.href = inputPhone.value ? `tel:${inputPhone.value}` : '#';
    btnEmail.href = inputEmail.value ? `mailto:${inputEmail.value}` : '#';
}

function openMap() {
    const addr = inputAddress.value;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`, '_blank');
}


// Listeners for dynamic link updates (even if read-only, good practice to keep)
inputPhone.addEventListener('input', updateActionLinks);
inputEmail.addEventListener('input', updateActionLinks);

// === DEBT NOTES LOGIC ===
const debtModal = document.getElementById('debtModal');
const debtPad = document.getElementById('debtPad');

// Filter Elements
const debtSearchName = document.getElementById('debtSearchName');
const debtSearchDate = document.getElementById('debtSearchDate');
const debtFilterGreen = document.getElementById('debtFilterGreen');
const debtFilterRed = document.getElementById('debtFilterRed');

// Add Listeners for Filters
debtSearchName.addEventListener('input', filterDebts);
debtSearchDate.addEventListener('input', filterDebts);
debtFilterGreen.addEventListener('change', filterDebts);
debtFilterRed.addEventListener('change', filterDebts);

function filterDebts() {
    const termName = debtSearchName.value.toLowerCase();
    const termDate = debtSearchDate.value.toLowerCase();
    const showGreen = debtFilterGreen.checked;
    const showRed = debtFilterRed.checked;

    const rows = debtPad.querySelectorAll('.debt-row');

    rows.forEach(row => {
        const textDiv = row.querySelector('.debt-text');
        const textContent = textDiv.textContent.toLowerCase();

        // Extract Date if present: [dd/mm]
        // Assumption: Date is usually at the start in brackets [12/05]
        // But user might type anything. We check if the text *contains* the search term.

        // Logic:
        // 1. Name Match: Check entire text content (simplest) or try to exclude date?
        //    Let's check entire content for Name input, but user knows to type name.
        // 2. Date Match: Check entire content for Date input (simplest).
        // 3. Color Match: Check class status-paid / status-pending.

        const matchesName = termName === '' || textContent.includes(termName);
        const matchesDate = termDate === '' || textContent.includes(termDate);

        let matchesColor = true;
        // If either filter is specified, we entered strict mode for colors
        if (showGreen || showRed) {
            const isPaid = textDiv.classList.contains('status-paid');
            const isPending = textDiv.classList.contains('status-pending');

            // Logic:
            // Show if (GreenChecked AND isPaid) OR (RedChecked AND isPending)
            // But wait, what if it's neither paid nor pending (no status)?
            // And what if Both are checked?

            matchesColor = false;
            if (showGreen && isPaid) matchesColor = true;
            if (showRed && isPending) matchesColor = true;

            // If item has NO status, and we are filtering, it should probably be hidden 
            // unless we want "uncolored" to show only when NO filters are active.
        }

        if (matchesName && matchesDate && matchesColor) {
            row.style.display = 'flex';
        } else {
            row.style.display = 'none';
        }
    });
}

function openDebtModal() {
    try {
        console.log("Opening Debt Modal...");
        // Load saved content if any
        const saved = localStorage.getItem('debtNotesContent');
        console.log("Saved content check:", saved);

        if (saved && saved.trim().length > 0) {
            // If content is just text (legacy), wrap it? 
            // Or if it contains 'debt-row', assume updated format.
            if (!saved.includes('debt-row')) {
                // Legacy Migration: wrap existing html in one simple row?
                // Or just reset to empty row + legacy content?
                debtPad.innerHTML = '';
                addDebtRow(saved);
            } else {
                debtPad.innerHTML = saved;
            }
        } else {
            // New clean start
            debtPad.innerHTML = '';
            addDebtRow();
        }

        // Reset filters on open
        if (debtSearchName) debtSearchName.value = '';
        if (debtSearchDate) debtSearchDate.value = '';
        if (debtFilterGreen) debtFilterGreen.checked = false;
        if (debtFilterRed) debtFilterRed.checked = false;

        // Trigger reset view
        const rows = debtPad.querySelectorAll('.debt-row');
        rows.forEach(r => r.style.display = 'flex');

        // Check if last row is empty? If not, adding a new one automatically could be annoying.
        // Let's add a "New Entry" button in HTML instead or rely on user.
        // But for now, let's just create a new row if the list is empty.
        if (debtPad.children.length === 0) {
            addDebtRow();
        }

        debtModal.classList.add('open');
        console.log("Debt Modal Class List:", debtModal.classList);
    } catch (e) {
        console.error("Error opening Debt Modal:", e);
        alert("Error al abrir Deudas: " + e.message);
    }
}


// === AI MAGIC REWRITE ===
function closeDebtModal() {
    debtModal.classList.remove('open');
}

const saveIndicatorDebt = document.getElementById('saveIndicatorDebt');

function addDebtRow(initialText = '') {
    // Generate unique ID based on timestamp and random
    const rowId = 'row_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    // Create Date String if initialText is empty (new user line)
    if (initialText === '') {
        const now = new Date();
        const dateStr = now.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '');
        initialText = `<b>[${dateStr}]</b> `;
    }

    const div = document.createElement('div');
    div.className = 'debt-row';
    div.id = rowId;
    div.innerHTML = `
        <div class="debt-text" contenteditable="true" 
            oninput="saveDebt()" 
            onblur="saveDebt()"
            style="min-height:24px; outline:none;">
            ${initialText}
        </div>
        <div class="debt-dots">
            <button class="dot-btn dot-green" onclick="setRowStatus('${rowId}', 'paid')" title="Pagado"></button>
            <button class="dot-btn dot-red" onclick="setRowStatus('${rowId}', 'pending')" title="Pendiente"></button>
            <button class="dot-btn" style="background:#555; color:white; font-size:10px; display:flex; align-items:center; justify-content:center;" onclick="deleteRow('${rowId}')">X</button>
        </div>
    `;
    debtPad.appendChild(div);

    // Focus logic
    const textDiv = div.querySelector('.debt-text');

    // If it's a new line, place cursor at end
    if (initialText.includes(']')) {
        // This is a bit tricky with contenteditable and HTML
        // But basic focus works. User can type after tag.
    }

    saveDebt();
    return textDiv;
}

function setRowStatus(rowId, status) {
    const row = document.getElementById(rowId);
    if (!row) {
        console.error("No se encuentra la fila:", rowId);
        return;
    }
    const text = row.querySelector('.debt-text');

    // Reset classes
    text.classList.remove('status-paid', 'status-pending');

    if (status === 'paid') text.classList.add('status-paid');
    if (status === 'pending') text.classList.add('status-pending');

    saveDebt();
}

function deleteRow(rowId) {
    const row = document.getElementById(rowId);
    if (row) row.remove();
    saveDebt();
}

function clearDebtPad() {
    if (confirm('Â¿Borrar todas las notas de deuda?')) {
        debtPad.innerHTML = '';
        addDebtRow();
        saveDebt();
    }
}


// === AI MAGIC REWRITE ===
function saveDebt() {
    localStorage.setItem('debtNotesContent', debtPad.innerHTML);
    if (saveIndicatorDebt) {
        saveIndicatorDebt.style.opacity = '1';
        setTimeout(() => {
            saveIndicatorDebt.style.opacity = '0';
        }, 1500);
    }
}


// === AI MAGIC REWRITE ===
// Auto-save on input listener is removed because we use oninput inline
debtPad.addEventListener('input', () => {
    saveDebt();
});



// === CHECKLIST MODAL LOGIC ===
const checklistModal = document.getElementById('checklistModal');
function openChecklist() {
    checklistModal.classList.add('open');
}
function closeChecklist() {
    checklistModal.classList.remove('open');
}

// === ROUTES MODAL LOGIC ===
const routesModal = document.getElementById('routesModal');
function openRoutes() {
    routesModal.classList.add('open');
}
function closeRoutes() {
    routesModal.classList.remove('open');
}

// === FOCUS MODAL LOGIC ===
const focusModal = document.getElementById('focusModal');
function openFocusModal() {
    focusModal.classList.add('open');
}
function closeFocusModal() {
    focusModal.classList.remove('open');
}

// === DISTRIBUIDORES MODAL LOGIC ===
const distribuidoresModal = document.getElementById('distribuidoresModal');
function openDistribuidoresModal() {
    distribuidoresModal.classList.add('open');
}
function closeDistribuidoresModal() {
    distribuidoresModal.classList.remove('open');
}

// === ZOOM MODAL LOGIC ===
const zoomModal = document.getElementById('zoomModal');
const zoomImage = document.getElementById('zoomImage');

function openZoomModal(imageSrc) {
    zoomImage.src = imageSrc;
    zoomModal.style.display = 'flex'; // Changed to flex to use align-items
    zoomModal.classList.add('open');
}

function closeZoomModal() {
    zoomModal.style.display = 'none';
    zoomModal.classList.remove('open');
    zoomImage.src = '';
}


function saveToDebts() {
    if (!currentEditingId) return;

    // Find item
    const item = searchResults.find(i => i.id === currentEditingId);
    if (!item) return;

    const phoneStr = item.phone ? ` - ðŸ“ž ${item.phone}` : '';
    const noteText = `New: ${item.name}${phoneStr}`;

    // Add to debt list interactively
    addDebtRow(noteText);

    // Feedback
    alert(`Guardado:\n${item.name}`);
}

// === PLANES (FOLDERS) LOGIC ===
const planesModal = document.getElementById('planesModal');
const planesTitle = document.getElementById('planesTitle');
const planesContent = document.getElementById('planesContent');
const planesControls = document.getElementById('planesControls');
const saveIndicator = document.getElementById('saveIndicator');

// Note Filters
const notesSearchInput = document.getElementById('notesSearchInput');
const notesFilterGreen = document.getElementById('notesFilterGreen');
const notesFilterRed = document.getElementById('notesFilterRed');

if (notesSearchInput) notesSearchInput.addEventListener('input', filterNotes);
if (notesFilterGreen) notesFilterGreen.addEventListener('change', filterNotes);
if (notesFilterRed) notesFilterRed.addEventListener('change', filterNotes);

let currentFolderId = null;

// Ensure Planes Data Structure exists
// Structure: [ { id: 'folder_123', name: 'Ruta Enero', clients: [ { id: 'c_1', text: 'Info...', date: '...' } ] } ]
function getPlanesData() {
    const data = localStorage.getItem('planesData');
    return data ? JSON.parse(data) : [];
}

function savePlanesData(data) {
    localStorage.setItem('planesData', JSON.stringify(data));
    showSaveFeedback();
}

function showSaveFeedback() {
    if (saveIndicator) {
        saveIndicator.style.opacity = '1';
        setTimeout(() => {
            saveIndicator.style.opacity = '0';
        }, 1500);
    }
}


// === AI MAGIC REWRITE ===
function openPlanes() {
    currentFolderId = null; // Start at root
    renderFolders();
    planesModal.classList.add('open');
}

function closePlanes() {
    planesModal.classList.remove('open');
}

// RENDER FOLDERS (LEVEL 1)
function renderFolders() {
    const planes = getPlanesData();
    planesTitle.innerText = '📂 Mis Notas (Carpetas)';
    planesTitle.innerText = '📂 Mis Notas (Carpetas)';
    // Controls for Root
    planesControls.innerHTML = `
        <button onclick="createNewFolder()" class="add-btn" style="background:var(--primary-gradient);"><i class="fa-solid fa-folder-plus"></i> Nueva Carpeta</button>
        <button onclick="syncFromNotion()" class="add-btn" style="background:#333; border: 1px solid #777;" title="Bajar datos de Notion"><i class="fa-solid fa-cloud-arrow-down"></i> Importar Notion</button>
        <button onclick="exportBackup()" class="add-btn" style="background:#555;" title="Descargar archivo"><i class="fa-solid fa-download"></i> Copia</button>
        <button onclick="document.getElementById('backupInput').click()" class="add-btn" style="background:#555;"><i class="fa-solid fa-upload"></i> Restaurar</button>
    `;

    // Hide filter bar in root view (optional, but cleaner)
    const filterBar = document.querySelector('#planesModal .filter-bar');
    if (filterBar) filterBar.style.display = 'none';

    if (planes.length === 0) {
        planesContent.innerHTML = '<div class="empty-state" style="color:#aaa;">No tienes carpetas creadas.</div>';
        return;
    }

    planesContent.innerHTML = '';
    planes.forEach(folder => {
        const div = document.createElement('div');
        div.className = 'nav-item';
        div.style.cssText = `
            display: flex; align-items: center; justify-content: space-between;
            padding: 15px; margin-bottom: 10px; background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
            cursor: pointer; transition: 0.2s;
        `;
        div.innerHTML = `
            <div onclick="openFolder('${folder.id}')" style="display:flex; align-items:center; gap:15px; flex:1;">
                <i class="fa-solid fa-folder-closed" style="font-size:1.5rem; color:#ffd700;"></i>
                <span style="font-size:1.1rem; font-weight:bold; color:white;">${folder.name}</span>
                <span style="font-size:0.8rem; color:#aaa;">(${folder.clients.length} notas)</span>
            </div>
            <div style="display:flex; gap:10px;">
                <button onclick="editFolder('${folder.id}')" style="background:none; border:none; color:#aaa; cursor:pointer;"><i class="fa-solid fa-pen"></i></button>
                <button onclick="deleteFolder('${folder.id}')" style="background:none; border:none; color:#ff4444; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        planesContent.appendChild(div);
    });
}

// RENDER CLIENTS (LEVEL 2)
function openFolder(folderId) {
    currentFolderId = folderId;
    const planes = getPlanesData();
    const folder = planes.find(f => f.id === folderId);
    if (!folder) return;

    planesTitle.innerText = `📂 ${folder.name}`;

    // Controls for Folder
    planesControls.innerHTML = `
        <button onclick="renderFolders()" class="add-btn" style="background:#555; width:auto; padding:12px 15px;"><i class="fa-solid fa-arrow-left"></i></button>
        <button onclick="addClientRow()" class="add-btn"><i class="fa-solid fa-plus"></i> Nota</button>
        <button onclick="syncFolderToNotion()" class="add-btn" style="background:#333; border: 1px solid #777;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png" style="width:16px; margin-right:5px;"> 
            Sync
        </button>
        <button onclick="configureSettings()" class="add-btn" style="background:#333; border: 1px solid #777; width:auto; padding:12px 15px;" title="Configurar API (Notion y AI)">
            <i class="fa-solid fa-gear"></i>
        </button>
    `;

    // Show filter bar in folder view
    const filterBar = document.querySelector('#planesModal .filter-bar');
    if (filterBar) filterBar.style.display = 'flex';

    renderClientList(folder);
}

function renderClientList(folder) {
    planesContent.innerHTML = '';

    if (folder.clients.length === 0) {
        planesContent.innerHTML = '<div class="empty-state" style="color:#aaa;">Carpeta vacía. Añade notas.</div>';
        return;
    }

    folder.clients.forEach(client => {
        const rowId = client.id;
        // Determine classes for status
        let statusClass = '';
        if (client.status === 'paid') statusClass = 'status-paid'; // reusing 'paid' for Green/Done
        if (client.status === 'pending') statusClass = 'status-pending'; // reusing 'pending' for Red/Urgent

        const div = document.createElement('div');
        div.className = 'debt-row plane-row'; // Added plane-row class for filtering
        div.id = rowId;
        div.dataset.status = client.status || ''; // Store status in dataset
        // Set Active Note on Click
        div.onclick = function () { localStorage.setItem('activeNoteId', rowId); };

        div.innerHTML = `
            <div class="debt-text ${statusClass}" contenteditable="true" 
                oninput="saveClientEdit('${rowId}')" 
                onblur="saveClientEdit('${rowId}')"
                onfocus="localStorage.setItem('activeNoteId', '${rowId}')"
                style="min-height:24px; outline:none;">
                ${client.text}
            </div>
            <div class="debt-dots">
                <button class="dot-btn dot-green" onclick="setClientStatus('${rowId}', 'paid')" title="Hecho"></button>
                <button class="dot-btn dot-red" onclick="setClientStatus('${rowId}', 'pending')" title="Pendiente"></button>

                <button class="dot-btn" style="background:#3b82f6; color:white; font-size:10px; display:flex; align-items:center; justify-content:center;" onclick="openMoveModal('${rowId}')" title="Mover"><i class="fa-solid fa-arrow-right"></i></button>
                <button class="dot-btn" style="background:#555; color:white; font-size:10px; display:flex; align-items:center; justify-content:center;" onclick="deleteClientRow('${rowId}')" title="Borrar">X</button>
            </div>
        `;
        planesContent.appendChild(div);
    });

    // Apply filters immediately after rendering
    filterNotes();
}

function setClientStatus(rowId, status) {
    if (!currentFolderId) return;
    const planes = getPlanesData();
    const folder = planes.find(f => f.id === currentFolderId);
    if (!folder) return;

    const client = folder.clients.find(c => c.id === rowId);
    if (!client) return;

    // Toggle logic: if clicking same status, remove it
    if (client.status === status) {
        client.status = null;
    } else {
        client.status = status;
    }

    savePlanesData(planes);
    renderClientList(folder); // Re-render to show changes
}

function filterNotes() {
    const term = notesSearchInput ? notesSearchInput.value.toLowerCase() : '';
    const showGreen = notesFilterGreen ? notesFilterGreen.checked : false;
    const showRed = notesFilterRed ? notesFilterRed.checked : false;

    // Select only the rows in the current view (planesContent)
    const rows = planesContent.querySelectorAll('.plane-row');

    rows.forEach(row => {
        const textDiv = row.querySelector('.debt-text');
        const textContent = textDiv.textContent.toLowerCase();
        const status = row.dataset.status;

        const matchesText = term === '' || textContent.includes(term);

        // Color Filter Logic
        let matchesColor = true;
        if (showGreen || showRed) {
            matchesColor = false;
            if (showGreen && status === 'paid') matchesColor = true;
            if (showRed && status === 'pending') matchesColor = true;
        }

        if (matchesText && matchesColor) {
            row.style.display = 'flex';
        } else {
            row.style.display = 'none';
        }
    });

    // Special case for folders view (if we want to hide filter bar there? for now let's keep it but it won't do much on folders)
    // Actually, maybe hide filter bar when in Root Folder view?
    // Let's handle visibility in Render
}


// ACTIONS - FOLDERS
function createNewFolder() {
    const name = prompt("Nombre de la nueva carpeta:");
    if (!name) return;

    const planes = getPlanesData();
    planes.push({
        id: 'folder_' + Date.now(),
        name: name,
        clients: []
    });
    savePlanesData(planes);
    renderFolders();
}

function editFolder(id) {
    const planes = getPlanesData();
    const folder = planes.find(f => f.id === id);
    if (!folder) return;

    const newName = prompt("Nuevo nombre:", folder.name);
    if (newName) {
        folder.name = newName;
        savePlanesData(planes);
        renderFolders();
    }
}


// === AI MAGIC REWRITE ===
function deleteFolder(id) {
    if (!confirm("Â¿Seguro que quieres borrar esta carpeta y todo su contenido?")) return;
    let planes = getPlanesData();
    planes = planes.filter(f => f.id !== id);
    savePlanesData(planes);
    renderFolders();
}

// ACTIONS - CLIENTS
function addClientRow() {
    if (!currentFolderId) return;

    const planes = getPlanesData();
    const folder = planes.find(f => f.id === currentFolderId);

    const now = new Date();
    const dateStr = now.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });

    const newClient = {
        id: 'cli_' + Date.now(),
        text: `<b>[${dateStr}]</b> Nueva Nota...`,
        date: new Date().toISOString()
    };

    folder.clients.push(newClient);
    savePlanesData(planes);

    // Re-render to show new item
    renderClientList(folder);
}

function saveClientEdit(rowId) {
    if (!currentFolderId) return;

    const row = document.getElementById(rowId);
    if (!row) return;

    const textDiv = row.querySelector('.debt-text');
    if (!textDiv) return;

    const textContent = textDiv.innerHTML;

    const planes = getPlanesData();
    const folder = planes.find(f => f.id === currentFolderId);
    if (folder) {
        const client = folder.clients.find(c => c.id === rowId);
        if (client) {
            client.text = textContent;
            savePlanesData(planes);
            // Track active note for Catalog integration
            localStorage.setItem('activeNoteId', rowId);
        }
    }
}


// === AI MAGIC REWRITE ===
function deleteClientRow(rowId) {
    if (!currentFolderId) return;
    if (!confirm("Â¿Borrar nota?")) return;

    const planes = getPlanesData();
    const folder = planes.find(f => f.id === currentFolderId);
    if (folder) {
        folder.clients = folder.clients.filter(c => c.id !== rowId);
        savePlanesData(planes);
        renderClientList(folder);
    }
}


// === AI MAGIC REWRITE ===
// Initialize Data if empty
if (!localStorage.getItem('planesData')) {
    savePlanesData([
        { id: 'f1', name: 'General', clients: [] }
    ]);
}


// === BACKUP SYSTEM ===
function exportBackup() {
    const data = {
        planes: getPlanesData(),
        debts: localStorage.getItem('debtNotesContent') || ''
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `backup_hostelhub_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Copia de seguridad descargada. GuÃ¡rdala en lugar seguro.');
}

function copyBackup() {
    const data = {
        planes: getPlanesData(),
        debts: localStorage.getItem('debtNotesContent') || ''
    };

    const text = JSON.stringify(data, null, 2);

    navigator.clipboard.writeText(text).then(() => {
        alert('Â¡Copia copiada al portapapeles! ðŸ“‹\n\nAhora puedes pegarla en las Notas de tu iPad o enviÃ¡rtela por correo.');
    }).catch(err => {
        console.error('Error al copiar: ', err);
        alert('No se pudo copiar automÃ¡ticamente. Intenta usar el botón de Descarga.');
    });
}

function importBackup(input) {
    const file = input.files[0];
    if (!file) return;

    if (!confirm('ATENCIÃ“N: Esto sobrescribirÃ¡ tus datos actuales con los del archivo. Â¿Seguro?')) {
        input.value = ''; // Reset
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const data = JSON.parse(e.target.result);

            if (data.planes) {
                savePlanesData(data.planes);
            }
            if (data.debts !== undefined) {
                localStorage.setItem('debtNotesContent', data.debts);
            }

            alert('Â¡Datos restaurados con Ã©xito!');
            renderFolders(); // Refresh view

        } catch (err) {
            console.error(err);
            alert('Error al leer el archivo. AsegÃºrate de que es una copia vÃ¡lida.');
        }
        input.value = ''; // Reset
    };
    reader.readAsText(file);
}

// === MOVE CLIENT LOGIC ===
const moveClientModal = document.getElementById('moveClientModal');
const moveTargetSelect = document.getElementById('moveTargetSelect');
let clientToMoveId = null;

function openMoveModal(clientId) {
    clientToMoveId = clientId;

    // Populate Select with OTHER folders
    const planes = getPlanesData();
    const otherFolders = planes.filter(f => f.id !== currentFolderId);

    if (otherFolders.length === 0) {
        alert("No tienes otras carpetas para mover el cliente. Crea una nueva primero.");
        return;
    }

    moveTargetSelect.innerHTML = otherFolders.map(f => `<option value="${f.id}">${f.name}</option>`).join('');
    moveClientModal.classList.add('open');
}

function closeMoveModal() {
    moveClientModal.classList.remove('open');
    clientToMoveId = null;
}


// === PERSISTENCE ADDITIONS (CHECKLIST & VENUE NOTES) ===

// 1. Checklist Persistence
const checklistInputs = document.querySelectorAll('.checklist-container input[type="checkbox"]');

function loadChecklistState() {
    try {
        const saved = JSON.parse(localStorage.getItem('checklistState') || '[]');
        checklistInputs.forEach((input, index) => {
            if (saved[index]) input.checked = true;
        });
    } catch (e) {
        console.error("Error loading checklist:", e);
    }
}



function saveChecklistState() {
    const state = Array.from(checklistInputs).map(input => input.checked);
    localStorage.setItem('checklistState', JSON.stringify(state));
}

// Attach listeners to checklist
if (checklistInputs.length > 0) {
    checklistInputs.forEach(input => {
        input.addEventListener('change', saveChecklistState);
    });
    // Load on init
    loadChecklistState();
}

// 2. Venue Detail Notes Persistence
// We listen to inputNotes and save keyed by currentEditingId
if (inputNotes) {
    inputNotes.addEventListener('input', () => {
        if (currentEditingId) {
            const savedNotes = JSON.parse(localStorage.getItem('venueNotes') || '{}');
            savedNotes[currentEditingId] = inputNotes.value;
            localStorage.setItem('venueNotes', JSON.stringify(savedNotes));
        }
    });
}


function executeMove() {
    if (!clientToMoveId || !currentFolderId) return;

    const targetFolderId = moveTargetSelect.value;
    if (!targetFolderId) return;

    const planes = getPlanesData();

    // Find Source Folder and Client
    const sourceFolder = planes.find(f => f.id === currentFolderId);
    if (!sourceFolder) return;

    const clientIndex = sourceFolder.clients.findIndex(c => c.id === clientToMoveId);
    if (clientIndex === -1) return;

    // Get Client Data
    const clientData = sourceFolder.clients[clientIndex];

    // Remove from Source
    sourceFolder.clients.splice(clientIndex, 1);

    // Add to Target
    const targetFolder = planes.find(f => f.id === targetFolderId);
    if (targetFolder) {
        targetFolder.clients.push(clientData);
        savePlanesData(planes);

        closeMoveModal();
        renderClientList(sourceFolder); // Refresh current view
        alert(`Cliente movido a "${targetFolder.name}"`);
    }
}



// === RESTORE SEARCH RESULTS ===
try {
    const lastSearch = localStorage.getItem('lastSearchResults');
    if (lastSearch) {
        const parsed = JSON.parse(lastSearch);
        if (Array.isArray(parsed) && parsed.length > 0) {
            searchResults = parsed; // Update state
            renderList(searchResults); // Render
        }
    }
} catch (e) {
    console.error("Error restoring search:", e);
}
/* Calculator Logic */
let calcExpression = '';

function openCalculator() {
    document.getElementById('calculatorModal').classList.add('open');
    calcExpression = '';
    updateCalcDisplay();
}

function closeCalculator() {
    document.getElementById('calculatorModal').classList.remove('open');
}

function updateCalcDisplay() {
    const display = document.getElementById('calcDisplay');
    display.value = calcExpression || '0';
    // Auto scroll to end
    display.scrollLeft = display.scrollWidth;
}

function calcAppend(val) {
    if (val === '.' && calcExpression.slice(-1) === '.') return;
    if (['+', '-', '*', '/'].includes(val) && ['+', '-', '*', '/'].includes(calcExpression.slice(-1))) {
        // Replace operator
        calcExpression = calcExpression.slice(0, -1) + val;
    } else {
        calcExpression += val;
    }
    updateCalcDisplay();
}

function calcClear() {
    calcExpression = '';
    updateCalcDisplay();
}

function calcBackspace() {
    calcExpression = calcExpression.slice(0, -1);
    updateCalcDisplay();
}

function calcCalculate() {
    try {
        // Safe evaluation
        // Valid characters only
        if (/[^0-9+\-*/.]/.test(calcExpression)) {
            calcExpression = 'Error';
        } else {
            // Eval is safe here due to regex check above (basic calculator)
            const result = eval(calcExpression);
            if (!isFinite(result) || isNaN(result)) {
                calcExpression = 'Error';
            } else {
                calcExpression = result.toString();
            }
        }
    } catch (e) {
        calcExpression = 'Error';
    }
    updateCalcDisplay();
}

// === NOTION INTEGRATION ===
const NOTION_KEY_DEFAULT = ''; // REMOVED FOR SECURITY
const NOTION_DB_ID_DEFAULT = '2eb60cbd80db80b0ae41d3eb9f774f26';
const CORS_PROXY = 'https://corsproxy.io/?';

function configureSettings() {
    const currentKey = localStorage.getItem('notionKey') || NOTION_KEY_DEFAULT;
    const currentDb = localStorage.getItem('notionDb') || NOTION_DB_ID_DEFAULT;

    // Step 1: Notion
    const newKey = prompt("🔑 NOTION: Pega tu 'Internal Integration Secret':", currentKey);
    if (newKey === null) return;

    const newDb = prompt("🗄️ NOTION: Pega tu ID de Base de Datos:", currentDb);
    if (newDb === null) return;

    // Auto-format Notion ID
    const formatUUID = (id) => {
        if (!id || id.length !== 32) return id;
        return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(16, 4)}-${id.substr(20)}`;
    };

    localStorage.setItem('notionKey', newKey.trim());
    localStorage.setItem('notionDb', formatUUID(newDb.replace(/-/g, '').trim()));
    localStorage.removeItem('geminiKey'); // Clean up old key if exists

    if (confirm("✅ Configuración guardada.\n\n¿Quieres probar la conexión con Notion ahora?")) {
        testNotionConnection();
    }
}


// === AI MAGIC REWRITE ===
async function testNotionConnection() {
    const NOTION_KEY = localStorage.getItem('notionKey') || NOTION_KEY_DEFAULT;
    // We don't test DB connection here, only User token. 
    // But let's verify DB ID format just in case user wants to know
    const rawDb = localStorage.getItem('notionDb') || NOTION_DB_ID_DEFAULT;
    const url = `${CORS_PROXY}https://api.notion.com/v1/users/me`;

    // Show spinner on the gear button if possible, or just alert "Comprobando..."
    // Since this is triggered from prompt or button, let's just use alert flow or simple console log for now, 
    // but better user feedback is an alert that says "Checking..." then updates.
    // We can't update a JS alert. We'll verify and then alert.

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${NOTION_KEY}`,
                'Notion-Version': '2022-06-28'
            }
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.message || 'Error de conexiÃ³n');
        }

        const data = await response.json();
        alert(`🎉 ¡CONEXIÓN EXITOSA!\n\n🤖 Bot detectado: ${data.bot ? data.bot.owner.type : 'Usuario'}\n✅ Tu API Key funciona perfectamente.\n\nSi la sincronización falla, el problema es que NO has dado permiso al bot en la base de datos (Menú Copas > Conexiones).`);

    } catch (e) {
        alert(`âŒ ERROR DE CONEXIÃ“N:\n"${e.message}"\n\nEsto significa que la Clave INTERNAL INTEGRATION SECRET (Notion) está MAL copiada/pegada (No confundir con Gemini).`);
    }
}



async function syncFolderToNotion() {
    if (!currentFolderId) return;

    const formatUUID = (id) => {
        if (!id) return id;
        const clean = id.replace(/-/g, '');
        if (clean.length !== 32) return id; // Return original if not 32 hex
        return `${clean.substr(0, 8)}-${clean.substr(8, 4)}-${clean.substr(12, 4)}-${clean.substr(16, 4)}-${clean.substr(20)}`;
    };

    const NOTION_KEY = localStorage.getItem('notionKey') || NOTION_KEY_DEFAULT;
    let NOTION_DB_ID = localStorage.getItem('notionDb') || NOTION_DB_ID_DEFAULT;
    NOTION_DB_ID = formatUUID(NOTION_DB_ID);

    const planes = getPlanesData();
    const folder = planes.find(f => f.id === currentFolderId);
    if (!folder || folder.clients.length === 0) {
        alert("La carpeta está vacía.");
        return;
    }

    if (!confirm(`¿Enviar ${folder.clients.length} notas a Notion?\nEsto creará o actualizará las entradas en tu base de datos.`)) return;

    // Show loading state
    const syncBtn = planesControls.querySelector('button:last-child');
    const originalText = syncBtn.innerHTML;
    syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
    syncBtn.disabled = true;

    let successCount = 0;
    let errorCount = 0;
    let lastErrorMsg = "";

    for (const client of folder.clients) {
        try {
            await sendNoteToNotion(client, folder.name);
            successCount++;
        } catch (e) {
            console.error("Error syncing note:", client, e);
            errorCount++;
            lastErrorMsg = e.message;
        }
    }

    // Save changes (in case we added notion_ids)
    savePlanesData(planes);

    syncBtn.innerHTML = originalText;
    syncBtn.disabled = false;

    if (errorCount > 0) {
        alert(`⚠️ Problema en la sincronización:\n\n✅ Enviados: ${successCount}\nâŒ Fallos: ${errorCount}\n\n🔍 ERROR DETECTADO:\n"${lastErrorMsg}"\n\n(Revisa que las columnas en Notion se llamen exactamente "Carpeta" y "Estado")`);
    } else {
        alert(`¡Sincronización Perfecta! 🚀\n\n✅ Se han enviado ${successCount} notas a Notion.`);
    }
}


// === AI MAGIC REWRITE ===
async function sendNoteToNotion(client, folderName) {
    // Re-fetch credentials inside loop/helper (or better pass them)
    const NOTION_KEY = localStorage.getItem('notionKey') || NOTION_KEY_DEFAULT;
    let NOTION_DB_ID = localStorage.getItem('notionDb') || NOTION_DB_ID_DEFAULT;

    // Helper inside (or move to global scope properly in next refactor)
    const formatUUID = (id) => {
        if (!id) return id;
        const clean = id.replace(/-/g, '');
        if (clean.length !== 32) return id;
        return `${clean.substr(0, 8)}-${clean.substr(8, 4)}-${clean.substr(12, 4)}-${clean.substr(16, 4)}-${clean.substr(20)}`;
    };
    NOTION_DB_ID = formatUUID(NOTION_DB_ID);

    // Strip HTML from text for title
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = client.text;
    let plainText = tempDiv.textContent || tempDiv.innerText || "";

    // CLEANUP: Robust multi-step removal
    // CLEANUP: Robust multi-step removal
    // 1. Remove the date prefix [17/1] (handling leading spaces)
    plainText = plainText.replace(/^\s*\[.*?\]/, '').trim();

    // 2. Remove ANY text that ends with "..." (common prefix pattern)
    // This catches "Nueva Nota...", "Nuevo Cliente...", "Bla bla..."
    if (plainText.includes('...')) {
        plainText = plainText.replace(/^.*?\.\.\./, '').trim();
    } else {
        // Fallback for older prefixes like "Nueva Nota" without dots or just spaced
        plainText = plainText.replace(/Nu.*?Nota\.*/i, '').trim();
    }

    // 3. Remove leading dots, spaces, or punctuation left over
    plainText = plainText.replace(/^[\.\s\-\:]+/, '').trim();

    // If cleanup left it empty (user didn't type anything), put a default
    if (!plainText) plainText = "Nota sin tÃ­tulo";

    // Determine Status
    const statusName = client.status === 'paid' ? 'Hecho' : (client.status === 'pending' ? 'Pendiente' : 'Sin Estado');

    const payload = {
        parent: { database_id: NOTION_DB_ID },
        properties: {
            "Name": { // Title property
                title: [
                    { text: { content: plainText } }
                ]
            },
            "Carpeta": { // Select or Text property for Folder
                rich_text: [
                    { text: { content: folderName } }
                ]
            },
            "Estado": { // Select property
                select: { name: statusName }
            },
            "Fecha": { // Date propery (YYYY-MM-DD for no time)
                date: { start: (client.date ? client.date.split('T')[0] : new Date().toISOString().split('T')[0]) }
            }
        }
    };

    let url = `${CORS_PROXY}https://api.notion.com/v1/pages`;
    let method = 'POST';

    if (client.notion_id) {
        url = `${CORS_PROXY}https://api.notion.com/v1/pages/${client.notion_id}`;
        method = 'PATCH';
        delete payload.parent; // Parent cannot be updated in PATCH
    }

    const response = await fetch(url, {
        method: method,
        headers: {
            'Authorization': `Bearer ${NOTION_KEY}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Notion API Error');
    }

    const data = await response.json();

    // Store the Notion ID to enable updates next time
    if (!client.notion_id) {
        client.notion_id = data.id;
    }
}


// === AI MAGIC REWRITE ===
async function syncFromNotion() {
    const NOTION_KEY = localStorage.getItem('notionKey') || NOTION_KEY_DEFAULT;
    let NOTION_DB_ID = localStorage.getItem('notionDb') || NOTION_DB_ID_DEFAULT;

    // Helper inside (duplicated for now to ensure isolation)
    const formatUUID = (id) => {
        if (!id) return id;
        const clean = id.replace(/-/g, '');
        if (clean.length !== 32) return id;
        return `${clean.substr(0, 8)}-${clean.substr(8, 4)}-${clean.substr(12, 4)}-${clean.substr(16, 4)}-${clean.substr(20)}`;
    };
    NOTION_DB_ID = formatUUID(NOTION_DB_ID);

    if (!confirm("⚠️ Â¿Quieres IMPORTAR y RESTAURAR tus notas desde Notion PRO?\n\nEsto buscarÃ¡ todas las notas en tu base de datos y las recrearÃ¡ en esta aplicaciÃ³n. Ãštil si has perdido datos o cambiado de dispositivo.")) return;

    // Show loading
    const syncBtn = planesControls.querySelector('button[title="Bajar datos de Notion"]');
    let originalText = "";
    if (syncBtn) {
        originalText = syncBtn.innerHTML;
        syncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Bajando...';
        syncBtn.disabled = true;
    }

    try {
        let hasMore = true;
        let startCursor = undefined;
        let allPages = [];

        // Fetch loop for pagination
        while (hasMore) {
            const response = await fetch(`${CORS_PROXY}https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_KEY}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page_size: 100,
                    start_cursor: startCursor
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || "Error al conectar con Notion (verifica tu Clave)");
            }

            const data = await response.json();
            allPages = allPages.concat(data.results);
            hasMore = data.has_more;
            startCursor = data.next_cursor;
        }

        // Process Results
        const planes = getPlanesData();
        let restoredCount = 0;
        let updatedCount = 0;

        allPages.forEach(page => {
            const props = page.properties;

            // Extract Data
            // 1. Name (Title) - Essential
            let text = "";
            if (props.Name && props.Name.title && props.Name.title.length > 0) {
                text = props.Name.title.map(t => t.plain_text).join('');
            } else {
                return; // Skip empty names
            }

            // 2. Folder (Carpeta)
            let folderName = "General";
            if (props.Carpeta) {
                if (props.Carpeta.type === 'rich_text' && props.Carpeta.rich_text.length > 0) {
                    folderName = props.Carpeta.rich_text[0].plain_text;
                } else if (props.Carpeta.type === 'select' && props.Carpeta.select) {
                    folderName = props.Carpeta.select.name;
                }
            }

            // 3. Status (Estado)
            let status = null;
            if (props.Estado && props.Estado.select) {
                const s = props.Estado.select.name.toLowerCase();
                if (s === 'hecho' || s === 'paid') status = 'paid';
                if (s === 'pendiente' || s === 'pending') status = 'pending';
            }

            // 4. Date (Fecha)
            let dateIdx = new Date().toISOString();
            if (props.Fecha && props.Fecha.date && props.Fecha.date.start) {
                dateIdx = props.Fecha.date.start;
            }

            // Find or Create Folder
            let folder = planes.find(f => f.name.toLowerCase() === folderName.toLowerCase());
            if (!folder) {
                folder = {
                    id: 'folder_' + Date.now() + Math.random().toString(36).substr(2, 5),
                    name: folderName,
                    clients: []
                };
                planes.push(folder);
            }

            // Check if Client Exists (by Notion ID)
            let existingClient = folder.clients.find(c => c.notion_id === page.id);

            // Construct the HTML text format [DD/MM] Name
            const dObj = new Date(dateIdx);
            const dStr = dObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }).replace(',', '');
            const newTextFormatted = `<b>[${dStr}]</b> ${text}`;

            if (existingClient) {
                // UPDATE Existing
                existingClient.text = newTextFormatted;
                existingClient.status = status;
                existingClient.date = dateIdx;
                updatedCount++;
            } else {
                // CREATE New
                folder.clients.push({
                    id: 'cli_' + Date.now() + Math.random().toString(36).substr(2, 5), // generate new local ID
                    text: newTextFormatted,
                    date: dateIdx,
                    status: status,
                    notion_id: page.id
                });
                restoredCount++;
            }
        });

        savePlanesData(planes);
        renderFolders(); // Refresh View
        alert(`✅ Proceso finalizado.\n\n📥 Descargados: ${allPages.length}\n✨ Nuevos: ${restoredCount}\n🔄 Actualizados: ${updatedCount}`);

    } catch (e) {
        console.error(e);
        alert("âŒ Error al importar: " + e.message);
    } finally {
        if (syncBtn) {
            syncBtn.innerHTML = originalText || 'Importar Notion';
            syncBtn.disabled = false;
        }
    }
}


// === AI MAGIC REWRITE ===

// === AI MAGIC REWRITE (FINAL) ===
