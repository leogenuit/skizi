
import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

const updateUserShift = (id, start, end) => {
  fetch(`/user_shifts/${id}`, {
    method: "PATCH",
    headers: {
      "X-CSRF-Token": document.querySelector("[name='csrf-token']").content,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ start: start, end: end})
  })
}

const JobColors = {
  runner: '#036375',
  barman: '#F46036',
  padder: '#947EB0'
}

const userShiftToEvent = (userShift) => {
  return {
    id: `${userShift.id}`,
    title: `${userShift.title}`,
    start: `${userShift.start}`,
    end: `${userShift.end}`,
    color: `${JobColors[userShift.job]}`,
    resourceEditable: true,
  }
}
const shiftToEvent = (shift) => {
  return {
    id: `${shift.id}`,
    start: `${shift.started_at}`,
    end: `${shift.ended_at}`,
    display: 'background',
    color: 'red'
  }
}

const events = () => {
  const call = document.getElementById("calendar")
  const user_shifts = JSON.parse(call.dataset.user_shifts);
  const shifts = JSON.parse(call.dataset.shifts);

  const eventUserShifts = user_shifts.map(userShiftToEvent)
  const eventShifts = shifts.map(shiftToEvent)

  return (eventUserShifts.concat(eventShifts));
}

const eventDrop = (info) => {
  updateUserShift(info.event.id, info.event.start, info.event.end)

  // alert(info.event.title + " was dropped on " + info.event.start.toISOString());

  // if (!confirm("Are you sure about this change?")) {
  //   info.revert();
  // }
}




const initCalendar = () => {
  let calendarEl = document.getElementById('calendar');
  const containerEl = document.getElementById('thumbnail_dragdrop');

  if (!calendarEl)
    return

  console.log("je usis la")
  console.log(events())

  const calendar = new Calendar(calendarEl, {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    droppable: true,
    editable: true,
    dayMaxEventRows: true,
    navLinks: true,
    eventStartEditable:true,
    eventDurationEditable:true,
    initialView: 'timeGridWeek',
    eventDrop: eventDrop,
    views: {
      timeGrid: {
        dayMaxEventRows: 6
      }
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'addEventButton dayGridMonth,timeGridWeek,listWeek'
    },
    customButtons: {
      addEventButton: {
        text: 'add shift',
        click: function () {
          const dateStr = prompt('Enter a date in YYYY-MM-DD format');
          const date = new Date(dateStr + 'T00:00:00'); // will be in local time
          const namestr = prompt('Enter the employee name ');

          if (!isNaN(date.valueOf())) { // valid?
            calendar.addEvent({
              title: namestr,
              start: date,
              allDay: true
            });
            alert('Great. Now, update your database...');
          } else {
            alert('Invalid date.');
          }
        }
      }
    },
    events: events(),
    navLinkDayClick: function (date, jsEvent) {
      console.log('day', date.toISOString());
      console.log('coords', jsEvent.pageX, jsEvent.pageY);
    },
  });

  new Draggable(containerEl, {
    itemSelector: '.fc-event',
    eventData: function (eventEl) {

      // TOTO get an user_shit id by user + shit

      return {
        title: eventEl.innerText,
      };
    }
  });

  calendar.render()

}
;

export default initCalendar;
