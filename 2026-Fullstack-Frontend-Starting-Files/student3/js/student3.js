const API_BASE_URL = 'https://devops-project-backend-zy1h.onrender.com';

// Aangeklikte membership al invullen in de form
const urlParams = new URLSearchParams(window.location.search);
const membership = urlParams.get('membership')
if(membership) {
    const selectElement = document.getElementById('membership')
    selectElement.value = membership
}


// RANDOM REVIEW
function renderReview(reviews) {
    if (!reviews || reviews.length === 0) {
        return `
            <p> No reviews yet</p>
    `;
    }
    let results = '';
    reviews.forEach(review => {
        results += `
            <p class="review_naam">${review.firstName} ${review.lastName}</p>
            <p>${review.review}</p>
            `
    });
    return results;
}
function fetchReview() {
    const container = document.getElementById('random_review');

    if (!container) return; // In case the element is not found, exit the function

    // Spinner
    container.innerHTML = `
     <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
     </div>
    `;

    // Fetch review
    fetch(`${API_BASE_URL}/random_review`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch review');
            }
        })
        .then(data => {
            container.innerHTML = renderReview(data);
        })
        .catch(err => {
            console.error('Error fetching list:', err);
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-danger d-inline-block shadow-sm">
                        <strong>⚠️ Connection Error:</strong> Failed to load reviews. Please verify the backend is running.
                    </div>
                </div>
            `;
        });
}


// TRAINERS DROPDOWN
function renderAvailableTrainers(trainers) {
    if (!trainers || trainers.length === 0) {
        return `
            <option disabled> No trainers available</option>
    `;
    }
    let results = '<option value="" selected>Geen trainer</option>';
    trainers.forEach(trainer => {
        results += `
            <option value="${trainer.trainerID}">${trainer.firstName} ${trainer.lastName} (${trainer.speciality})</option>
            `
    });
    return results;
}
function fetchAvailableTrainers() {
    const container = document.getElementById('trainer');

    if (!container) return; // In case the element is not found, exit the function

    // Fetch review
    fetch(`${API_BASE_URL}/get_available_trainers`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to fetch trainers');
            }
        })
        .then(data => {
            container.innerHTML = renderAvailableTrainers(data);
        })
        .catch(err => {
            console.error('Error fetching list:', err);
            container.innerHTML = `
                <option disabled>Failed to load trainers. Please verify the backend is running.</option>
            `;
        });
}

// effectief 1 keer aanroepen bij het laden van de pagina
fetchReview()
fetchAvailableTrainers()


// Voor form door te sturen, e.preventDefault() zorgt ervoor dat de pagina niet laadt bij het submitten van de form
//Je kan ook de button disablen na dat er al op geklikt is, zodat er niet meerdere keren op geklikt kan worden
// value.trim zorgt ervoor dat er geen spaties in de input staan, want dat kan ook een lege string zijn
// -> Zie testJSfrontend javascript file voor voorbeeld (bij deel 4) voor post


const formContainer = document.getElementById('form-container');
const successContainer = document.getElementById('success-container');
const orderForm = document.getElementById("membership-form")
orderForm.addEventListener('submit', e => {
    e.preventDefault();

    const submitBtn = document.getElementById('submit-membership-form');
    if (!submitBtn) return; // In case the element is not found, exit the function

    submitBtn.disabled = true;
    submitBtn.innerHTML = `
     <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
     </div>
    `;

    const payload = {
        lastName: document.getElementById('lastName').value.trim(),
        firstName: document.getElementById('firstName').value.trim(),
        email: document.getElementById('email').value.trim(),
        membershipID: document.getElementById('membership').value,
    };
    let trainer = document.getElementById('trainer').value
    if (trainer === "") {
        trainer = null; // trainer is optioneel, dus als er geen trainer geselecteerd is, zetten we het op null
    }
    else {
        payload.trainerID = trainer
    }

    if (!payload.firstName) {
        alert('Vul alstublieft een voornaam in.');
        return;
    }
    if (!payload.lastName) {
        alert('Vul alstublieft een achternaam in.');
        return;
    }
    fetch(`${API_BASE_URL}/create_member`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) throw new Error('Aanmelden mislukt');
            return res.json();
        })
        .then(data => {
            document.getElementById('success-firstname').textContent = data.firstName
            document.getElementById('success-lastname').textContent = data.lastName
            let membershipText = '';
            switch (data.membershipID) {
                case 1: membershipText += 'Basic'; break;
                case 2: membershipText += 'Premium'; break;
                case 3: membershipText += 'Gigachad'; break;
            }
            document.getElementById('success-membership').textContent = membershipText
            let trainerText = "";
            document.getElementById('success-trainer').textContent = "laden...";
                if (trainer) {
                    fetch(`${API_BASE_URL}/get_available_trainers`)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Failed to fetch trainers');
                            }
                        })
                        .then(data => {
                            console.log("All trainers data:", data); // Log the entire trainers data for debugging
                            const selectedTrainer = data.find(t => t.trainerID == trainer);
                            trainerText += `${selectedTrainer.firstName} ${selectedTrainer.lastName} (${selectedTrainer.speciality})`
                                document.getElementById('success-trainer').textContent = trainerText;
                        })
                        .catch(err => {
                            console.error('Error fetching list:', err);
                        });
                }
                else {
                    trainerText = "Geen trainer"
                    document.getElementById('success-trainer').textContent = trainerText
                }
            console.log("trainerID:", trainer)
            console.log("trainer:", trainerText)
            document.getElementById('success-email').textContent = data.email

            formContainer.classList.add('d-none');
            successContainer.classList.remove('d-none');
        })
        .catch(err => {
            console.error('Submit error:', err);
            alert('iets ging mis. Controleer of je backend server draait en probeer het opnieuw.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Aanmelden";
        })
})