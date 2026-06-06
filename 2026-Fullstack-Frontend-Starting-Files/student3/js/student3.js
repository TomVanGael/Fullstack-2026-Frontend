const API_BASE_URL = 'https://devops-project-backend-zy1h.onrender.com';
const API_TEST_URL = 'http://localhost:31622';

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
            console.log('Fetched review:', data);
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
    let results = '<option value="geen" selected>Geen trainer</option>';
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
                throw new Error('Failed to fetch review');
            }
        })
        .then(data => {
            container.innerHTML = renderAvailableTrainers(data);
            console.log('Fetched trainerdata:', data);
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
