/*!
  * Javascript to get dynamic data from database of our fitness
*/

window.onload = updateLessons();

function increaseAttendants(attendantsId, actualAttendants, maxAttendants) {
    console.log("AttendantsId: " + attendantsId);
    console.log("Actual attendants: " + actualAttendants);
    console.log("Maximum attendants: " + maxAttendants)

    // Check planning and grouplessons for maximum attendants
    actualAttendants += 1;
    console.log("New actual attendants: " + actualAttendants);

    now = new Date();
    lessonDate = now.getFullYear() + "-" + formatTime(now.getMonth() + 1) + "-" + formatTime(now.getDate());

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
}


function formatTime(number) {
    return number < 10 ? '0' + number : number;
}

async function updateLessons() {
    // Get the weekday
    const now = new Date();
    weekDay = now.getDay();
    console.log ("Weekday: " + weekDay);

    // Get the time, use formatTime to create leading zeros
    hours = formatTime(now.getHours());
    minutes = formatTime(now.getMinutes());
    time = `${hours}:${minutes}`;
    console.log("Current Time: " + time);

    // Call the API to retrieve data from database
    const response =  await fetch("https://devops-project-backend-zy1h.onrender.com/actual_lessons?weekday=" + weekDay + "&time=" + time);
    const data  =   await response.json()
    actualLessons = data.lessons;

    // Get the table element to add the lessons to
    var table = document.getElementById("table-busy");

    // Loop through the received data and add the lessons to the table

    // Structure / example of output:
    //     <tr>
    //         <td>Gym</td>
    //         <td>
    //             <meter className="s4-bustle-meter" value="78" min="0" max="100" low="50" high="80" optimum="20"
    //                    title="5min wachttijd"></meter>
    //         </td>
    //     </tr>

    for (let lesson of actualLessons) {
        console.log(lesson);
        // Build the DOM elements to show the lessons and the busy-ness of the location
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerText = lesson[0];

        // Get actual attendants for a lesson and calculate the percentage of max attendants to show in the meter
        lessonDate = now.getFullYear() + "-" + formatTime(now.getMonth() + 1) + "-" + formatTime(now.getDate());
        console.log("LessonDate: " + lessonDate);
        const response = await fetch("https://devops-project-backend-zy1h.onrender.com/actual_attendants?planningid=" + lesson[6] + "&lessondate=" + lessonDate);
        const data = await response.json();
        attendantInformation = data.attendants[0];

        actualAttendants = attendantInformation[0];
        actualAttendantsId = attendantInformation[1];
        console.log("Actual attendants: " + actualAttendants);

        // Meter is configured from 0 to 100; so we've to calculate the amount of people as a percentage of max attendants...
        maxAttendants = lesson[2];  // this is 100% of the capacity
        percAttendants = (actualAttendants / maxAttendants) * 100;
        cell2.innerHTML = "<meter id='mtr-" + actualAttendantsId + "' class='s4-bustle-meter' value='" + percAttendants + "' min='0' max='100' low='50' high='80' optimum='20' title='" + actualAttendants + " van de maximaal " + maxAttendants + "'></meter>";

        // Cell 3 contains a button to indicate you're coming to the lesson, so the attendants can be counted in the database and the meter can be updated for other users
        if (actualAttendants >= maxAttendants) {
            cell3.innerHTML = "<button disabled class='btn-accent'>Volzet</buttona>"
        } else {
            cell3.innerHTML = "<button id='btn-" + actualAttendantsId + "' onclick='increaseAttendants(" + actualAttendantsId + "," + actualAttendants + "," +  maxAttendants + ")' class='btn-accent'>Ik kom!</buttona>"
        }
    }
}
