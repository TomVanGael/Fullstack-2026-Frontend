/*!
  * Javascript to get dynamic data from database of our fitness
  *
    Name: Mouws Eddy
    Class: 1WT Toegepaste Informatica
    R-number: R1118617
*/

// Use a const for the baseURL to easily switch between local and deployed backend.
// When deploying the frontend, change the baseURL to the URL of the deployed backend.
//const baseURL = "http://localhost:8000";
const baseURL = "https://devops-project-backend-zy1h.onrender.com";


// debug=true -> output to console; debug=false -> no output to console
const debug = false;


window.onload = updatePage();


function outputDebugInfo(message) {
    if (debug) {
        console.log(message);
    }
}


function formatTime(number) {
    return number < 10 ? '0' + number : number;
}


function increaseAttendants(attendantsId, actualAttendants, maxAttendants) {
    outputDebugInfo("AttendantsId: " + attendantsId);
    outputDebugInfo("Actual attendants: " + actualAttendants);
    outputDebugInfo("Maximum attendants: " + maxAttendants)

    // Check planning and grouplessons for maximum attendants
    // Only continue if the maximum attendants is not yet reached, otherwise show an alert that the lesson is already full
    // and we can't register the attendance anymore
    if (actualAttendants<maxAttendants) {
        actualAttendants += 1;
        outputDebugInfo("New actual attendants: " + actualAttendants);

        now = new Date();
        lessonDate = now.getFullYear() + "-" + formatTime(now.getMonth() + 1) + "-" + formatTime(now.getDate());

        /* Old code, without error handling; kept for reference
        fetch(baseURL + "/update_attendants", {
            method: 'POST', body: JSON.stringify({
                attendantsId: attendantsId,
                planningId: 0,  // this is not used in the backend, but we need to send it to match the expected body of the request
                lessonDate: lessonDate,
                attendants: actualAttendants
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        // after updating database; refresh the meter in the row
        var meter = document.getElementById("mtr-" + attendantsId);
        percAttendants = (actualAttendants / maxAttendants) * 100;
        meter.value = percAttendants;
        meter.title = actualAttendants + " van de maximaal " + maxAttendants;

        // After updating; update the button as well, if the lesson is now full, disable the button and change text to "Volzet"
        var button = document.getElementById("btn-" + attendantsId);

        if (actualAttendants < maxAttendants) {
            button.setAttribute("onclick", "increaseAttendants(" + attendantsId + "," + actualAttendants + "," + maxAttendants + ")");
        } else {
            button.setAttribute("disabled", "true");
            button.innerText = "Volzet";
        }

         */
        const payload = {
            attendantsId: attendantsId,
            planningId: 0,  // this is not used in the backend, but we need to send it to match the expected body of the request
            lessonDate: lessonDate,
            attendants: actualAttendants
        };

        fetch(baseURL + "/update_attendants", {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
            .then(response => {
                if (!response.ok) throw new Error("Updaten bezoekergegevens niet gelukt");
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    outputDebugInfo("Attendants updated successfully in the database.");
                }

                // after updating database; refresh the meter in the row
                var meter = document.getElementById("mtr-" + attendantsId);
                percAttendants = (actualAttendants / maxAttendants) * 100;
                meter.value = percAttendants;
                meter.title = actualAttendants + " van de maximaal " + maxAttendants;

                // After updating; update the button as well, if the lesson is now full, disable the button and change text to "Volzet"
                var button = document.getElementById("btn-" + attendantsId);

                if (actualAttendants < maxAttendants) {
                    button.setAttribute("onclick", "increaseAttendants(" + attendantsId + "," + actualAttendants + "," + maxAttendants + ")");
                } else {
                    button.setAttribute("disabled", "true");
                    button.innerText = "Volzet";
                }
            })
            .catch(err => {
                outputDebugInfo("Error updating attendants: " + err);
                alert("Er is een fout opgetreden bij het bijwerken van uw aanwezigheid. Probeer het later opnieuw.");
            });
    } else {
        alert ("Helaas, deze les is al volzet. We kunnen je aanwezigheid niet meer registreren.");
    }
}


function parseLessons(lessons, table, spinner, errorMessage) {
    // Loop through the lessons and get the necessary information to show in the table
    for (let lesson of lessons) {
        outputDebugInfo("Lesson: " + lesson);

        // First, enable the spinner. This is disabled when display an item.
        spinner.style.display = "block";

        // Build the DOM elements to show the lessons and the busy-ness of the location
        let row = table.insertRow(1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerText = lesson[0];

        // Get actual attendants for a lesson and calculate the percentage of max attendants to show in the meter
        const now = new Date();
        let lessonDate = now.getFullYear() + "-" + formatTime(now.getMonth() + 1) + "-" + formatTime(now.getDate());
        outputDebugInfo("LessonDate: " + lessonDate);

        /* Old code to fetch data (without error handling); kept for reference
        const response = fetch(baseURL + "/actual_attendants?planningid=" + lesson[6] + "&lessondate=" + lessonDate);
        const data = response.json();
        End old code */

        fetch(baseURL + "/actual_attendants?planningid=" + lesson[6] + "&lessondate=" + lessonDate)
            .then(response => {
                if (!response.ok) {
                    if (response.status >= 500) {
                        throw new Error('Server error, please try again later (HTTP ' + response.status + ')');
                    } else if (response.status >= 400) {
                        throw new Error('Client error, please check your request (HTTP ' + response.status + ')');
                    } else {
                        throw new Error('Unexpected error, status code: ' + response.status);
                    }
                } else {
                    return response.json()
                }
            })
            .then(data => {
                // data  = data.attendants[0];

                attendantInformation = data.attendants[0];

                actualAttendants = attendantInformation[0];
                actualAttendantsId = attendantInformation[1];
                outputDebugInfo("Actual attendants ID: " + actualAttendantsId);
                outputDebugInfo("Actual attendants: " + actualAttendants);
                outputDebugInfo("Max attendants: " + lesson[2]);

                // Meter is configured from 0 to 100; so we've to calculate the amount of people as a percentage of max attendants...
                maxAttendants = lesson[2];  // this is 100% of the capacity
                percAttendants = (actualAttendants / maxAttendants) * 100;
                cell2.innerHTML = "<meter id='mtr-" + actualAttendantsId + "' class='s4-bustle-meter' value='" + percAttendants + "' min='0' max='100' low='50' high='80' optimum='20' title='" + actualAttendants + " van de maximaal " + maxAttendants + "'></meter>";

                // Cell 3 contains a button to indicate you're coming to the lesson, so the attendants can be counted in the database and the meter can be updated for other users
                if (actualAttendants >= maxAttendants) {
                    cell3.innerHTML = "<button disabled class='btn-coming'>Volzet</buttona>"
                } else {
                    cell3.innerHTML = "<button id='btn-" + actualAttendantsId + "' onclick='increaseAttendants(" + actualAttendantsId + "," + actualAttendants + "," + maxAttendants + ")' class='btn-coming'>Ik kom!</buttona>"
                }
                spinner.style.display = "none";

            })
            .catch(err => {
                outputDebugInfo("Error fetching data: " + err);
                errorMessage.style.display = "block";
                errorMessage.innerHTML = `
                <div class="image-container"><img src="assets/exclamation.svg" width="50" height="50" class="color-filter" alt="error"></div>
                    <div id="error-text-container">
                        <p>
                            Er is een fout opgetreden bij het laden van de bezoekergegevens. Probeer het later opnieuw.
                        </p>
                    </div>
                </div>`;
                // Also place a disabled meter in the cell to indicate that we couldn't load the data for this lesson
                cell2.innerHTML = "<meter class='s4-bustle-meter' value='0' min='0' max='100' low='50' high='80' optimum='20' title='Fout bij laden bezettingsgraad'></meter>";
            })
    }
    // Building table is done, hide the spinner and show the table
    // spinner.style.display = "none";
    table.style.display = "table";
}




function updateLiveLessons() {
    // Get the necessary elements for spinner, table and error-message

    let spinner = document.getElementById("spinner");
    if (!spinner) {
        outputDebugInfo("Spinner element not found");
        return;
    } else {
        // Start showing the spinner during loading data and hide the table.
        spinner.style.display = "block";
    }

    let table = document.getElementById("table-busy");
    if (!table) {
        outputDebugInfo("Table element not found");
        return;
    } else {
        // Don't display the table
        table.style.display = "none";
    }

    let errorMessage = document.getElementById("error-message");
    if (!errorMessage) {
        outputDebugInfo("Error message element not found");
        return;
    } else {
        // Hide the error message
        errorMessage.style.display = "none";
    }

    // Get the weekday
    const now = new Date();
    let weekDay = now.getDay();
    outputDebugInfo ("Weekday: " + weekDay);

    // Get the time, use formatTime to create leading zeros
    let hours = formatTime(now.getHours());
    let minutes = formatTime(now.getMinutes());
    let time = `${hours}:${minutes}`;
    outputDebugInfo ("Current Time: " + time);

    // Call the API to retrieve data from database
    // Rebuild for error handling
    let actualLessons = [];

    fetch(baseURL + "/actual_lessons?weekday=" + weekDay + "&time=" + time)
        .then(response => {
            if (!response.ok) {
                if (response.status >= 500) {
                    throw new Error('Server error, please try again later (HTTP ' + response.status + ')');
                } else if (response.status >= 400) {
                    throw new Error('Client error, please check your request (HTTP ' + response.status + ')');
                } else {
                    throw new Error('Unexpected error, status code: ' + response.status);
                }
            } else {
                return response.json()
            }
        })
        .then(data => {
            actualLessons = data.lessons;
            outputDebugInfo("Actual lessons: " + actualLessons);

            if (!actualLessons || actualLessons.length === 0) {
                outputDebugInfo("No actual lessons found");
                spinner.style.display = "none";
                errorMessage.style.display = "block";
                errorMessage.textContent = "Er zijn momenteel geen lessen gepland.";
                return;
            } else {
                parseLessons(actualLessons, table, spinner, errorMessage);
            }

        })
        .catch(err => {
            // Log error, hide the spinner and display a message for the user
            outputDebugInfo("Error fetching data: " + err);
            spinner.style.display = "none";
            errorMessage.style.display = "block";
            errorMessage.textContent = "Er is een fout opgetreden bij het laden van de gegevens. Probeer het later opnieuw.";
            errorMessage.innerHTML = `
                <div class="image-container"><img src="assets/exclamation.svg" width="50" height="50" class="color-filter" alt="error"></div>
                    <div id="error-text-container">
                        <p>
                            Er is een fout opgetreden bij het laden van de gegevens. Probeer het later opnieuw.
                        </p>
                    </div>
                </div>`;
        }
        )

    //const response =  await fetch(baseURL + "/actual_lessons?weekday=" + weekDay + "&time=" + time);
    // const data  =   await response.json()
    // actualLessons = data.lessons;
}

function parseAdvantages(advantages, spinnerAdvantages) {
    // Walk through the advantages
    let i = 1;
    for (let advantage of advantages) {
        outputDebugInfo(advantage)
        item = "advantage-" + i;
        outputDebugInfo(item)

        i++;
        let itemAdvantages = document.getElementById(item);
        if (!itemAdvantages) {
            outputDebugInfo("Advantageitem "+ i + " element not found");
            return;
        } else {
            // Update the contents of this item
            html = "<h3>" + advantage[0] + "</h3>";
            html += "<p>"+ advantage[1] + "</p>"
            itemAdvantages.innerHTML = html;
        }
    }
    spinnerAdvantages.style.display = "none";
}


function updateAdvantages() {
    // Get the necessary elements
    let spinnerAdvantages = document.getElementById("spinnerAdvantages");
    if (!spinnerAdvantages) {
        outputDebugInfo("Spinner element not found");
        return;
    } else {
        // Start showing the spinner during loading data and hide the table.
        spinnerAdvantages.style.display = "block";
    }

    // Call API te retrieve three advantages for quiet trainings
    fetch(baseURL + "/advantages_for_quiet_trainings")
        .then(response => {
            if (!response.ok) {
                if (response.status >= 500) {
                    throw new Error('Server error, please try again later (HTTP ' + response.status + ')');
                } else if (response.status >= 400) {
                    throw new Error('Client error, please check your request (HTTP ' + response.status + ')');
                } else {
                    throw new Error('Unexpected error, status code: ' + response.status);
                }
            } else {
                return response.json()
            }
        })
        .then(data => {
            advantages = data.advantages;
            outputDebugInfo("Advantages: " + advantages);

            if (!advantages || advantages.length === 0) {
                outputDebugInfo("No advantages found; info already exists as fallback, will not overwrite");
                spinner.style.display = "none";
                return;
            } else {
                parseAdvantages(advantages);
            }

        })
        .catch(err => {
                // Log error, hide the spinner and display a message for the user
                outputDebugInfo("Error fetching data: " + err);
                spinnerAdvantages.style.display = "none";
            }
        )
}

function updatePage() {
    updateAdvantages()
    updateLiveLessons()
}
