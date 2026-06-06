const formulier = document.getElementById("contactForm");
const submitButton = document.getElementById("submitBtn");

formulier.addEventListener("submit", function (event) {
    event.preventDefault();

    // Verander de tekst van de submit-knop en disable deze tijdelijk
    const btnHTML = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Laden...';
    submitButton.disabled = true;

    // Dataverwerking
    const formData = new FormData(formulier);
    const data = Object.fromEntries(formData.entries());

    data.terms_accepted = data.terms_accepted === "on"; // Converteer naar boolean

    console.log("Verwerkte data:", data);

    const apiUrl = "http://127.0.0.1:8000/contact"

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                // Als de server een errorstatus teruggeeft, toon de error
                throw new Error("Er zijn problemen met de server: " + response.status);
            }
            return response.json();
        })
        .then(result => {
            console.log("Gelukt!:", result);
            // Een succesbericht tonen
            contactForm.reset(); // Reset het formulier

            const modalElement = document.getElementById('exampleModal');
            const succesModal = bootstrap.Modal.getOrCreateInstance(modalElement);
            succesModal.show();

        })
        .catch(error => {
            console.error("Fout bij het verzenden van het formulier:", error);
            alert("Er is een fout opgetreden bij het verzenden van het formulier. Probeer het opnieuw.")
        })
        .finally(() => {
            // Foutafhandeling => resetten
            submitButton.innerHTML = btnHTML;
            submitButton.disabled = false;
        });

});

