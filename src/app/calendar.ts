// "Add to calendar" links for the wedding night (Band, Baaja & Baraat).
// Times are in UTC: 6:00 PM – midnight IST on 3 Dec 2026.
const title = 'Diksha & Abhas – Wedding (Band, Baaja & Baraat)';
const details = 'Your invitation: https://shivnash26.github.io/wedding-invite-angular/';
const location = 'Lotus Portico Club, Jankipuram Ext, Beside ORO City, Lucknow';

export const googleCalendarUrl =
  'https://calendar.google.com/calendar/render?action=TEMPLATE' +
  '&text=' + encodeURIComponent(title) +
  '&dates=20261203T123000Z/20261203T183000Z' +
  '&details=' + encodeURIComponent(details) +
  '&location=' + encodeURIComponent(location);

// Apple Calendar / Outlook: a file in public/
export const icsUrl = 'wedding.ics';
