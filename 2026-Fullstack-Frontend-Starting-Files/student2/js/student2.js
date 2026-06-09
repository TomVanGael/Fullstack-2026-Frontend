//     Name: Rene
//     Class: Van Asch
//     R-number: r1089588
//     branch dat ik werk: rene-contactpagina
//

const formulier = document.getElementById("contactForm");
const submitButton = document.getElementById("submitBtn");

//Bepalen van de API URL (afhankelijk van de omgeving)
let BASE_URL;

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {

    BASE_URL = "http://127.0.0.1:8000";

} else {
    BASE_URL = "https://devops-project-backend-zy1h.onrender.com";
}

//===================   Formulier ==========================================

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

    const contactUrl = `${BASE_URL}/contact`;

    fetch(contactUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                // Als de server een error status teruggeeft, toon de error
                throw new Error("⚠️ Er zijn problemen met de server: " + response.status);
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
            alert("⚠️ Er is een fout opgetreden bij het verzenden van het formulier. Probeer het opnieuw.")
        })
        .finally(() => {
            // Foutafhandeling => resetten
            submitButton.innerHTML = btnHTML;
            submitButton.disabled = false;
        });

});
 // ================================ MAP - OPENINGSTIJDEN ========================================
const loadHours = () => {
    const hoursContainer = document.getElementById("hoursContainer");
    const hoursUrl = `${BASE_URL}/hours`;

    fetch(hoursUrl)
        .then(response => {
            if (!response.ok) {
                // Als de server een error status teruggeeft, toon de error
                throw new Error("⚠️ Er zijn problemen met de server: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("Opening hours data:", data);

            setTimeout(() => {

                hoursContainer.innerHTML = "";
                data.forEach(item => {
                    hoursContainer.innerHTML += `
                        ${item.days}: ${item.time} <br>
                `;
                });
            }, 1000); // Simuleer een vertraging van 1 seconde voor de laadtijd
        })
        .catch(error => {
            console.error("Fout bij het laden van openingstijden:", error);
            hoursContainer.innerHTML = "<p class='text-danger'>⚠️ Er is een fout opgetreden bij het laden van de openingstijden. Probeer het later opnieuw.</p>";
        });
}

loadHours();

// ================================== FAQ  ========================================

const loadFaq = () => {
    const faqContainer = document.getElementById("faqContainer");
    const apiUrl = `${BASE_URL}/faq`;


    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                // Als de server een error status teruggeeft, toon de error
                throw new Error("⚠️ Er zijn problemen met de server: " + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log("FAQ data:", data);

            setTimeout(() => {

            faqContainer.innerHTML = "";
            data.forEach((item, index) => {
                const isFirst = index === 0;

                faqContainer.innerHTML += `
                <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#collapse${index}" aria-expanded="${isFirst ? 'true' : 'false'}" aria-controls="collapse${index}">
                                ${item.question}
                            </button>
                        </h2>
                        <div id="collapse${index}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" data-bs-parent="#faqContainer">
                            <div class="accordion-body">
                                ${item.answer}
                            </div>
                        </div>
                    </div>
                `;
            });
        }, 1000); // Simuleer een vertraging van 1 seconde voor de laadtijd
    })
        .catch(error => {
            console.error("Fout bij het laden van FAQ:", error);
            faqContainer.innerHTML = "<p class='text-danger'>⚠️ Er is een fout opgetreden bij het laden van de FAQ. Probeer het later opnieuw.</p>";
        });
}

loadFaq();
