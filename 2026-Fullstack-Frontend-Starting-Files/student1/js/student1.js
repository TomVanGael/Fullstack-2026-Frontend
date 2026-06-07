// ==========================================================
//     Name: Van Gael Tom
//     Class: 1WT Toegepaste Informatica
//     R-number: r1114549
//  Automatische pagina-detectie + API-configuratie
// ==========================================================

const page = document.body.dataset.page;
const API_BASE_URL = 'https://devops-project-backend-zy1h.onrender.com';


// ==========================================================
//  PAGE 1 — TIPS
// ==========================================================
if (page === "page1") {

    // -------------------------------
    // Render tips
    // -------------------------------
    function renderTips(tips) {
        if (!tips || tips.length === 0) {
            return `
                <div class="col-12 text-center py-5">
                    <p class="text-secondary fs-5">No tips found.</p>
                </div>
            `;
        }

        return tips.map(tip => `
            <div class="col-lg-3 col-md-6">
                <div class="tip-card">
                    <div class="tip-icon">${tip.icon}</div>
                    <h4>${tip.title}</h4>
                    <p>${tip.description}</p>
                </div>
            </div>
        `).join("");
    }

    // -------------------------------
    // Fetch + render tips
    // -------------------------------
    function fetchAndRenderTips() {
        const container = document.getElementById('tipsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2 text-secondary">Loading tips...</p>
            </div>
        `;

        fetch(`${API_BASE_URL}/four_random_tips`)
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => container.innerHTML = renderTips(data.tips))
            .catch(() => {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="alert alert-danger shadow-sm">
                            <strong>⚠️ Connection Error:</strong> Failed to load tips.
                        </div>
                    </div>
                `;
            });
    }

    // Initial load
    fetchAndRenderTips();
}

// ==========================================================
//  PAGE 2 — COACHES, AFSPRAKEN, POPUPS
// ==========================================================
if (page === "page2") {

    // ======================================================
    //  BOOTSTRAP MODALS
    // ======================================================
    const afsprakenModal = new bootstrap.Modal(document.getElementById("afsprakenPopup"));
    const deleteModal = new bootstrap.Modal(document.getElementById("deletePopup"));
    const meldingModal = new bootstrap.Modal(document.getElementById("meldingPopup"));

    // ======================================================
    //  COACH CARDS
    // ======================================================
    function renderCoaches(coaches) {
        if (!coaches || coaches.length === 0) {
            return `
                <div class="col-12 text-center py-5">
                    <p class="text-secondary fs-5">No coaches found.</p>
                </div>
            `;
        }

        return coaches.map(coach => `
            <div class="col-lg-3 col-md-6">
                <div class="card coach-card h-100">
                    <div class="card-body text-center">
                        <div class="coach-icon fs-1">${coach.icon}</div>
                        <h4 class="card-title">${coach.voornaam}</h4>
                        <h6 class="card-subtitle mb-2 text-muted">${coach.naam}</h6>
                        <p class="card-text">${coach.specialisatie}</p>
                    </div>
                </div>
            </div>
        `).join("");
    }

    function fetchAndRenderCoaches() {
        const container = document.getElementById('coachesContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2 text-secondary">Loading coaches...</p>
            </div>
        `;

        fetch(`${API_BASE_URL}/four_random_coaches`)
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => container.innerHTML = renderCoaches(data.coaches))
            .catch(() => {
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="alert alert-danger shadow-sm">
                            <strong>⚠️ Connection Error:</strong> Failed to load coaches.
                        </div>
                    </div>
                `;
            });
    }

    // ======================================================
    //  COACH SELECT (dropdown)
    // ======================================================
    async function loadCoaches() {
        const select = document.getElementById("coachSelect");
        select.innerHTML = `<option value="">⏳ Coaches laden...</option>`;

        const response = await fetch(`${API_BASE_URL}/coach_list`);
        const data = await response.json();

        select.innerHTML = `<option value="">-- Kies een coach --</option>`;

        data.coaches.forEach(coach => {
            const option = document.createElement("option");
            option.value = coach.CoachID;
            option.textContent = `${coach.icon} ${coach.voornaam} ${coach.naam} — ${coach.specialisatie}`;
            select.appendChild(option);
        });
    }

    // ======================================================
    //  DOM READY
    // ======================================================
    document.addEventListener("DOMContentLoaded", () => {
        loadCoaches();
        const vandaag = new Date().toISOString().split("T")[0];
        document.getElementById("datum").setAttribute("min", vandaag);
    });

    // ======================================================
    //  AFSPRAAK AANMAKEN
    // ======================================================
    document.getElementById("afspraakForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const coachId = document.getElementById("coachSelect").value;
        const klantNaam = document.getElementById("klantNaam").value;
        const datum = document.getElementById("datum").value;

        if (!coachId || !klantNaam || !datum) {
            showMelding("Gelieve alle velden in te vullen.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/afspraak`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    coachid: parseInt(coachId),
                    klantnaam: klantNaam,
                    datum: datum
                })
            });

            if (!response.ok) throw new Error();

            const result = await response.json();
            showMelding(result.message || "Afspraak succesvol aangemaakt!");
            showAfsprakenPopup();

            document.getElementById("coachSelect").value = "";
            document.getElementById("klantNaam").value = "";
            document.getElementById("datum").value = "";

        } catch {
            showMelding("Er ging iets mis bij het aanmaken.");
        }
    });

    // ======================================================
    //  AFSPRAKEN POPUP
    // ======================================================
    async function showAfsprakenPopup() {
        const list = document.getElementById("afsprakenList");
        const response = await fetch(`${API_BASE_URL}/afspraken`);
        const data = await response.json();

        list.innerHTML = data.afspraken.map(a => `
            <p><strong>${a[5]} ${a[3]} ${a[4]}</strong></p>
            <p>Klant: ${a[1]}</p>
            <p>Datum: ${a[2]}</p>
            <hr>
        `).join("");

        afsprakenModal.show();
    }

    // ======================================================
    //  DELETE POPUP
    // ======================================================
    document.getElementById("openDeletePopup").addEventListener("click", async () => {
        const list = document.getElementById("deleteList");
        const response = await fetch(`${API_BASE_URL}/afspraken`);
        const data = await response.json();

        list.innerHTML = data.afspraken.map(a => `
            <label class="d-flex align-items-center gap-2">
                <input type="radio" name="deleteChoice" value="${a[0]}">
                <span>${a[5]} ${a[3]} ${a[4]} — ${a[1]} — ${a[2]}</span>
            </label>
            <hr>
        `).join("");

        deleteModal.show();
    });

    // ======================================================
    //  DELETE ACTION
    // ======================================================
    document.getElementById("deleteSelected").addEventListener("click", async () => {
        const selected = document.querySelector("input[name='deleteChoice']:checked");

        if (!selected) {
            showMelding("Selecteer eerst een afspraak.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/afspraak/${selected.value}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error();

            showMelding("Afspraak succesvol verwijderd!");
            deleteModal.hide();

        } catch {
            showMelding("Fout bij verwijderen.");
        }
    });

    // ======================================================
    //  MELDING POPUP
    // ======================================================
    function showMelding(text) {
        document.getElementById("meldingText").textContent = text;
        meldingModal.show();
        setTimeout(() => meldingModal.hide(), 2500);
    }

    // ======================================================
    //  COACH IMAGES ROTATION
    // ======================================================
    const coachImages = [
        "assets/coaches_1.webp",
        "assets/coaches_2.webp",
        "assets/coaches_3.webp"
    ];

    let currentIndex = 0;
    document.getElementById("coachImage").src = coachImages[currentIndex];

    setInterval(() => {
        currentIndex = (currentIndex + 1) % coachImages.length;
        document.getElementById("coachImage").src = coachImages[currentIndex];
    }, 5000);

    // ======================================================
    //  INITIAL LOAD
    // ======================================================
    fetchAndRenderCoaches();
}
