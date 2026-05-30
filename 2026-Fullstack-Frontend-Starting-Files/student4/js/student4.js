/*!
  * Javascript to get dynamic data from database of our fitness
*/

// If you need debug-information on the browser-console; change "DEBUG" to true, otherwise set it to false
const debugging = true;

window.onload = updateLessons();

function debug(message) {
    if (debugging) {
        console.log(message);
    }
}

function increaseAttendants(attendantsId, actualAttendants, maxAttendants) {
    debug("AttendantsId: " + attendantsId);
    debug("Actual attendants: " + actualAttendants);
    debug("Maximum attendants: " + maxAttendants)

    // Check planning and grouplessons for maximum attendants
    actualAttendants += 1;
    debug("New actual attendants: " + actualAttendants);

    const now = new Date();
    let lessonDate = now.getFullYear() + "-" + formatTime(now.getMonth() + 1) + "-" + formatTime(now.getDate());

    fetch("https://devops-project-backend-zy1h.onrender.com/update_attendants", {
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
    let meter = document.getElementById("mtr-" + attendantsId);
    meter.value = (actualAttendants / maxAttendants) * 100;
    meter.title = actualAttendants + " van de maximaal " + maxAttendants;

    // After updating; update the button as well, if the lesson is now full, disable the button and change text to "Volzet"
    let button = document.getElementById("btn-" + attendantsId);

    if (actualAttendants < maxAttendants) {
        button.setAttribute("onclick", "increaseAttendants(" + attendantsId + "," + actualAttendants + "," + maxAttendants + ")");
    } else {
        button.setAttribute("disabled", "true");
        button.innerText = "Volzet";
    }
}


function formatTime(number) {
    return number < 10 ? '0' + number : number;
}

async function updateLessons() {
    // Get the weekday
    const now = new Date();
    let weekDay = now.getDay();

    // Get the time, use formatTime to create leading zeros
    let hours = formatTime(now.getHours());
    let minutes = formatTime(now.getMinutes());
    let time = `${hours}:${minutes}`;

    debug("Weekday: " + weekDay);
    debug("Current Time: " + time);

    // Call the API to retrieve data from database
    const response =  await fetch("https://devops-project-backend-zy1h.onrender.com/actual_lessons?weekday=" + weekDay + "&time=" + time);
    const data  = await response.json()
    let actualLessons = data.lessons;

    // Get the table element to add the lessons to
    let table = document.getElementById("table-busy");

    /*
    Loop through the received data and add the lessons to the table

     Structure / example of output:
         <tr>
             <td>Gym</td>
             <td>
                 <meter className="s4-bustle-meter" value="78" min="0" max="100" low="50" high="80" optimum="20"
                        title="5min wachttijd"></meter>
             </td>
         </tr>
    */

    for (let lesson of actualLessons) {
        debug(lesson);

        // Build the DOM elements to show the lessons and the busy-ness of the location
        let row = table.insertRow(1);
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerText = lesson[0];

        // Get actual attendants for a lesson and calculate the percentage of max attendants to show in the meter
        const lessonDate = now.getFullYear() + "-" + formatTime(now.getMonth() + 1) + "-" + formatTime(now.getDate());
        debug("LessonDate: " + lessonDate);

        // Retreive data from backend
        const response = await fetch("https://devops-project-backend-zy1h.onrender.com/actual_attendants?planningid=" + lesson[6] + "&lessondate=" + lessonDate);
        const data = await response.json();
        let attendantInformation = data.attendants[0];

        let actualAttendants = attendantInformation[0];
        let actualAttendantsId = attendantInformation[1];
        debug("Actual attendants: " + actualAttendants);

        // Meter is configured from 0 to 100; so we've to calculate the amount of people as a percentage of max attendants...
        // let maxAttendants = lesson[2];  // this is 100% of the capacity
        // let percAttendants = (actualAttendants / maxAttendants) * 100;
        // cell2.innerHTML = "<meter id='mtr-" + actualAttendantsId + "' class='s4-bustle-meter' value='" + percAttendants + "' min='0' max='100' low='50' high='80' optimum='20' title='" + actualAttendants + " van de maximaal " + maxAttendants + "'></meter>";

        // let maxAttendants = lesson[2];  // this is 100% of the capacity
        // let percAttendants = (actualAttendants / maxAttendants) * 100;
        // Line below has same functionality but with less code and less variables, we can directly calculate the percentage in the value attribute of the meter and directly
        cell2.innerHTML = "<meter id='mtr-" + actualAttendantsId + "' class='s4-bustle-meter' value='" + ((actualAttendants / lesson[2]) * 100) + "' min='0' max='100' low='50' high='80' optimum='20' title='" + actualAttendants + " van de maximaal " + lesson[2] + "'></meter>";

        // Cell 3 contains a button to indicate you're coming to the lesson, so the attendants can be counted in the database and the meter can be updated for other users
        if (actualAttendants >= lesson[2]) {
            cell3.innerHTML = "<button disabled class='btn-accent'>Volzet</buttona>"
        } else {
            cell3.innerHTML = "<button id='btn-" + actualAttendantsId + "' onclick='increaseAttendants(" + actualAttendantsId + "," + actualAttendants + "," +  lesson[2] + ")' class='btn-accent'>Ik kom!</buttona>"
        }
    }
}
