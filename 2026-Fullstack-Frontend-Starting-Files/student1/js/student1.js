// Check welke pagina javascript nodig heeft
const page = document.body.dataset.page;
const API_BASE_URL = 'https://devops-project-backend-zy1h.onrender.com';

if (page === "page1") {
    // Javascript voor de tipcards
    // Helper to auto generate tips on student1page1
    function renderTips(tips){
        if (!tips || tips.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-secondary fs-5">No tips found.</p>
                </div>
            `;
            return;
        }
        let result = "";
        tips.forEach(tip => {
            result += `
                <div class="col-lg-3 col-md-6">
                    <div class="tip-card">
                        <div id="tip-icon" class="tip-icon">${tip.icon}</div>
                        <h4 id="tip-title">${tip.title}</h4>
                        <p id="tip-description">${tip.description}</p>
                    </div>
                </div>
            `;
        });
        return result;
    }

    // 1. Fetch and render 4 tips on page load
    function fetchAndRenderTips() {
        const container = document.getElementById('tipsContainer');
        if (!container) return;

        // Show loading spinner
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-secondary">Loading tips...</p>
            </div>
        `;

        fetch(`${API_BASE_URL}/four_random_tips`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch tips');
                }
            })
            .then(data => {
                container.innerHTML = renderTips(data.tips);
            })
            .catch(err => {
                console.error('Error fetching list:', err);
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="alert alert-danger d-inline-block shadow-sm">
                            <strong>⚠️ Connection Error:</strong> Failed to load tips. Please verify the backend is running.
                        </div>
                    </div>
                `;
            });
    }

    // Initial list fetch
    fetchAndRenderTips();
}

if (page === "page2") {
    // Javascript voor de coachcards
    // Helper to auto generate coaches on student1page2
    function renderCoaches(coaches){
        if (!coaches || coaches.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <p class="text-secondary fs-5">No coaches found.</p>
                </div>
            `;
            return;
        }
        let result = "";
        coaches.forEach(coach => {
            result += `
                <div class="col-lg-3 col-md-6">
                    <div class="coach-card">
                        <div id="coach-icon">${coach.icon}</div>
                        <h4 id="coach-voornaam">${coach.voornaam}</h4>
                        <h6 id="coach-naam">${coach.naam}</h6>
                        <p id="coach-specialisatie">${coach.specialisatie}</p>
                    </div>
                </div>
            `;
        });
        return result;
    }

    // 1. Fetch and render 4 tips on page load
    function fetchAndRenderCoaches() {
        const container = document.getElementById('coachesContainer');
        if (!container) return;

        // Show loading spinner
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-secondary">Loading tips...</p>
            </div>
        `;

        fetch(`${API_BASE_URL}/four_random_coaches`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error('Failed to fetch coaches');
                }
            })
            .then(data => {
                container.innerHTML = renderCoaches(data.coaches);
            })
            .catch(err => {
                console.error('Error fetching list:', err);
                container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <div class="alert alert-danger d-inline-block shadow-sm">
                            <strong>⚠️ Connection Error:</strong> Failed to load coaches. Please verify the backend is running.
                        </div>
                    </div>
                `;
            });
    }
    // Javascript voor de coachlist
    async function loadCoaches() {
        // const response = await fetch("http://localhost:8000/coach_list");
        const response = await fetch(`${API_BASE_URL}/coach_list`);
        const data = await response.json();

        const select = document.getElementById("coachSelect");

        data.coaches.forEach(coach => {
            const option = document.createElement("option");
            option.value = coach.CoachID;
            option.textContent = `${coach.icon} ${coach.voornaam} - specialisatie: ${coach.specialisatie}`;
            select.appendChild(option);
        });
    }


    document.addEventListener("DOMContentLoaded", () => {
        loadCoaches();

        // Datum in het verleden niet toegestaan
        const vandaag = new Date().toISOString().split("T")[0];
        document.getElementById("datum").setAttribute("min", vandaag);
    });


    // Form submit handler
    document.getElementById("afspraakForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const coachId = document.getElementById("coachSelect").value;
        const klantNaam = document.getElementById("klantNaam").value;
        const datum = document.getElementById("datum").value;

        if (!coachId || !klantNaam || !datum) {
            alert("Gelieve alle velden in te vullen.");
            return;
        }


        //TODO CHECK  res
        // const response = await fetch("http://localhost:8000/afspraak", {
        const response = await fetch(`${API_BASE_URL}/afspraak`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                coachid: parseInt(coachId),
                klantnaam: klantNaam,
                datum: datum
            })
        });

        // const result = await response.json();

        // Popup tonen
        showAfsprakenPopup();

        // Formulier leegmaken
        document.getElementById("coachSelect").value = "";
        document.getElementById("klantNaam").value = "";
        document.getElementById("datum").value = "";

    });

    // afspraak popup
    document.getElementById("closePopup").addEventListener("click", () => {
        document.getElementById("afsprakenPopup").style.display = "none";
    });

    async function showAfsprakenPopup() {
        const popup = document.getElementById("afsprakenPopup");
        const list = document.getElementById("afsprakenList");
        const response = await fetch(`${API_BASE_URL}/afspraken`);
        const data = await response.json();

        console.log("AFSPRAKEN API:", data.afspraken); // <--- DIT

        list.innerHTML = ""; // leegmaken

        data.afspraken.forEach(a => {
            const div = document.createElement("div");
            div.classList.add("afspraak-item");

            div.innerHTML = `
            <p><strong>${a[5]} ${a[3]} ${a[4]}</strong></p>
            <p>Klant: ${a[1]}</p>
            <p>Datum: ${a[2]}</p>
            <hr>
        `;

            list.appendChild(div);
        });

        popup.style.display = "flex";
    }

    // verwijder afspraak
    document.getElementById("openDeletePopup").addEventListener("click", async () => {
        const popup = document.getElementById("deletePopup");
        const list = document.getElementById("deleteList");

        // const response = await fetch("http://localhost:8000/afspraken");
        const response = await fetch(`${API_BASE_URL}/afspraken`);
        const data = await response.json();

        list.innerHTML = "";

        data.afspraken.forEach(a => {
            const div = document.createElement("div");
            div.classList.add("afspraak-item");

            div.innerHTML = `
                <label class="d-flex align-items-center gap-2">
                    <input type="radio" name="deleteChoice" value="${a[0]}">
                    <span>${a[5]} ${a[3]} ${a[4]} — ${a[1]} — ${a[2]}</span>
                </label>
                <hr>
            `;

            list.appendChild(div);
        });

        popup.style.display = "flex";
    });

    // Sluiten van de popups
    document.getElementById("closePopup").addEventListener("click", () => {
        document.getElementById("afsprakenPopup").style.display = "none";
    });
    document.getElementById("closeDeletePopup").addEventListener("click", () => {
        document.getElementById("deletePopup").style.display = "none";
    });

    // Verwijderen van een afspraak
    document.getElementById("deleteSelected").addEventListener("click", async () => {
        const selected = document.querySelector("input[name='deleteChoice']:checked");

        if (!selected) {
            alert("Selecteer eerst een afspraak.");
            return;
        }

        const afspraakid = selected.value;

        // await fetch(`http://localhost:8000/afspraak/${afspraakid}`, {
        await fetch(`${API_BASE_URL}/afspraak/${afspraakid}`, {
            method: "DELETE"
        });

        //alert("Afspraak verwijderd.");

        // Popup sluiten
        document.getElementById("deletePopup").style.display = "none";

        // popup opnieuw tonen met geüpdatete lijst
        //showAfsprakenPopup();
    });

    // Laad verschillende afbeeldingen
    const coachImages = [
        "assets/coaches_1.webp",
        "assets/coaches_2.webp",
        "assets/coaches_3.webp"
    ];

    let currentIndex = 0;

    // Toon meteen de eerste coachfoto
    document.getElementById("coachImage").src = coachImages[currentIndex];
    setInterval(() => {
        currentIndex = (currentIndex + 1) % coachImages.length;
        document.getElementById("coachImage").src = coachImages[currentIndex];
    }, 5000);// wisselt elke 5 seconden

    // Initial list fetch
    fetchAndRenderCoaches();
}