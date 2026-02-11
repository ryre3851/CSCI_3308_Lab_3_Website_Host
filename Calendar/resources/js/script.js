const events = [];

// extra credit functions
let editingIndex = null;
function openEventForEditing(index) {
  editingIndex = index;
  const event = events[index];

  // fill form fields with appropriate data
  document.getElementById("event_name").value = event.name;
  document.getElementById("event_weekday").value = event.weekday;
  document.getElementById("event_time").value = event.time;
  document.getElementById("event_modality").value = event.modality;
  document.getElementById("event_category").value = event.category;

  // only show appropriate fields
  updateLocationOptions();

  if (event.modality === "in_person") {
    document.getElementById("event_location").value = event.location;
  } else {
    document.getElementById("event_remote_url").value = event.remote_url;
  }

  document.getElementById("event_attendees").value = event.attendees;

  // open the modal
  const modal = bootstrap.Modal.getOrCreateInstance(
    document.getElementById("event_modal")
  );
  modal.show();
}
function refreshCalendarUI() {
  const days = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
  days.forEach(day => {
    const col = document.getElementById(day);
    col.innerHTML = `<div class="h6 text-center position-relative py-2 day">${day.charAt(0).toUpperCase() + day.slice(1)}</div>`;
  });

  events.forEach(event => addEventToCalendarUI(event));
}



// resets the form back to blank fields
function prepareNewEventForm() {
  document.getElementById("event_form").reset();
  document.getElementById("event_modality").value = "";
  document.getElementById("event_weekday").value = "";
  document.getElementById("location_group").style.display = "none";
  document.getElementById("remote_url_group").style.display = "none";
  document.getElementById("attendees_group").style.display = "none";
  document.getElementById("event_category").value = "";
}

// updates the options displayed on form based on modality
function updateLocationOptions() {
  // grab modality
  const modality = document.getElementById("event_modality").value;

  // get fields
  const locationGroup = document.getElementById("location_group");
  const remoteUrlGroup = document.getElementById("remote_url_group");
  const attendeesGroup = document.getElementById("attendees_group");
  locationGroup.style.display = "none";
  remoteUrlGroup.style.display = "none";
  attendeesGroup.style.display = "none";

  // display fields based on modality
  if (modality === "in_person") {
    locationGroup.style.display = "block";
    attendeesGroup.style.display = "block";
  } else if (modality === "remote") {
    remoteUrlGroup.style.display = "block";
    attendeesGroup.style.display = "block";
  }
}

// saves the event to the calendar
function saveEvent() {
  const name = document.getElementById("event_name").value;
  const weekday = document.getElementById("event_weekday").value;
  const time = document.getElementById("event_time").value;
  const modality = document.getElementById("event_modality").value;
  const category = document.getElementById("event_category").value;

  let location = null;
  let remote_url = null;

  if (modality === "in_person") {
    location = document.getElementById("event_location").value;
  } else {
    remote_url = document.getElementById("event_remote_url").value;
  }

  const attendees = document.getElementById("event_attendees").value;

  const eventDetails = {
    name,
    weekday,
    time,
    modality,
    location,
    remote_url,
    attendees,
    category
  };
  // new event
  if (editingIndex === null) {
    eventDetails.index = events.length;
    events.push(eventDetails);
  // existing event
  } else {
    eventDetails.index = editingIndex;
    events[editingIndex] = eventDetails;
  }

  console.log(events);

  // refresh the UI
  refreshCalendarUI();
  editingIndex = null;

  // close the modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("event_modal")
  );
  modal.hide();

  // reset the form
  document.getElementById("event_form").reset();
  document.getElementById("location_group").style.display = "none";
  document.getElementById("remote_url_group").style.display = "none";
  document.getElementById("attendees_group").style.display = "none";
}


function createEventCard(eventDetails) {
  let event_element = document.createElement('div');
  event_element.classList = 'event row border rounded m-1 py-1';
  event_element.dataset.eventIndex = eventDetails.index;

  event_element.onclick = function () {
    openEventForEditing(eventDetails.index);
  };


  // set background color from category
  let categoryColors = {
    academic: '#c6c47f',
    work: '#58ca70',
    personal: '#625dc7',
    meeting: '#cc68da'
  };

  event_element.style.backgroundColor = categoryColors[eventDetails.category] || '#ffffff';

  let info = document.createElement('div');

  info.innerHTML = `
    <strong>${eventDetails.name}</strong><br>
    Time: ${eventDetails.time}<br>
    Category: ${eventDetails.category}<br>
    Modality: ${eventDetails.modality === "in_person" ? "In-Person" : "Remote"}<br>
    ${eventDetails.location ? `Location: ${eventDetails.location}<br>` : ""}
    ${eventDetails.remote_url ? `URL: ${eventDetails.remote_url}<br>` : ""}
    Attendees: ${eventDetails.attendees}
  `;

  event_element.appendChild(info);
  return event_element;
}


// adds the event to the calendar
function addEventToCalendarUI(eventInfo) {
  let event_card = createEventCard(eventInfo);
  let dayColumn = document.getElementById(eventInfo.weekday);
  dayColumn.appendChild(event_card);
}


