const formulier = document.getElementById("contactForm");
const submitButton = document.getElementById("submitBtn");

formulier.addEventListener("submit", function (event) {
    event.preventDefault();

    // Verander de tekst van de submit-knop en disable deze tijdelijk
    const btnTekst = submitButton.innerText;
    submitButton.innerText = "Laden...";
    submitButton.disabled = true;

    // Dataverwerking
    const formData = new FormData(formulier);
    const data = Object.fromEntries(formData.entries());

    data.terms_accepted = data.terms_accepted === "on"; // Converteer naar boolean

    console.log("Verwerkte data:", data);

    const apiUrl = "http://127.0.0.1:8000/student2page1"

});


