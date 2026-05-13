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
        option.value = coach.coachid;
        option.textContent = `${coach.icon} ${coach.voornaam} - specialisatie: ${coach.specialisatie}`;
        select.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", loadCoaches);
