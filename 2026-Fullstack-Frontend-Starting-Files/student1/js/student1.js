<!--Javascript voor de tipcards-->
async function loadFourTips() {
    const response = await fetch("http://localhost:8000/four_random_tips");
    const data = await response.json();
    const tips = data.tips;

    // Tip 1
    document.getElementById("tip1-icon").textContent = tips[0].icon;
    document.getElementById("tip1-title").textContent = tips[0].title;
    document.getElementById("tip1-description").textContent = tips[0].description;

    // Tip 2
    document.getElementById("tip2-icon").textContent = tips[1].icon;
    document.getElementById("tip2-title").textContent = tips[1].title;
    document.getElementById("tip2-description").textContent = tips[1].description;

    // Tip 3
    document.getElementById("tip3-icon").textContent = tips[2].icon;
    document.getElementById("tip3-title").textContent = tips[2].title;
    document.getElementById("tip3-description").textContent = tips[2].description;

    // Tip 4
    document.getElementById("tip4-icon").textContent = tips[3].icon;
    document.getElementById("tip4-title").textContent = tips[3].title;
    document.getElementById("tip4-description").textContent = tips[3].description;
}
loadFourTips();

<!--Javascript voor de coachcards-->
async function loadFourCoaches() {
    const response = await fetch("http://localhost:8000/four_random_coaches");
    const data = await response.json();
    /** @type {{icon:string, naam:string, voornaam:string, specialisatie:string}[]} */
    const coaches = data.coaches;


    // Coach 1
    document.getElementById("coach1-icon").textContent = coaches[0].icon;
    document.getElementById("coach1-voornaam").textContent = coaches[0].voornaam;
    document.getElementById("coach1-naam").textContent = coaches[0].naam;
    document.getElementById("coach1-specialisatie").textContent = coaches[0].specialisatie;

    // Coach 2
    document.getElementById("coach2-icon").textContent = coaches[1].icon;
    document.getElementById("coach2-voornaam").textContent = coaches[1].voornaam;
    document.getElementById("coach2-naam").textContent = coaches[1].naam;
    document.getElementById("coach2-specialisatie").textContent = coaches[1].specialisatie;

    // Coach 3
    document.getElementById("coach3-icon").textContent = coaches[2].icon;
    document.getElementById("coach3-voornaam").textContent = coaches[2].voornaam;
    document.getElementById("coach3-naam").textContent = coaches[2].naam;
    document.getElementById("coach3-specialisatie").textContent = coaches[2].specialisatie;

    // Coach 4
    document.getElementById("coach4-icon").textContent = coaches[3].icon;
    document.getElementById("coach4-voornaam").textContent = coaches[3].voornaam;
    document.getElementById("coach4-naam").textContent = coaches[3].naam;
    document.getElementById("coach4-specialisatie").textContent = coaches[3].specialisatie;
}
loadFourCoaches();

<!--Javascript voor de coachlist-->
async function loadCoaches() {
    const response = await fetch("http://localhost:8000/coach_list");
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

    const response = await fetch("http://localhost:8000/afspraak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            coachid: parseInt(coachId),
            klantnaam: klantNaam,
            datum: datum
        })
    });

    const result = await response.json();

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

    const response = await fetch("http://localhost:8000/afspraken");
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

    const response = await fetch("http://localhost:8000/afspraken");
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

    await fetch(`http://localhost:8000/afspraak/${afspraakid}`, {
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
}, 5000); // wisselt elke 5 seconden
