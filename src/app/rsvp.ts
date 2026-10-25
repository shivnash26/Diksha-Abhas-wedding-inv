// @ts-nocheck
import { invitation } from './config';

/*
 * Sends one RSVP to the Google Sheet (via the Apps Script web app URL in config).
 * Resolves when the reply has been sent; rejects if the network request fails.
 */
export async function sendRsvp(data) {
  const url = invitation.rsvpSheetUrl;
  if (!url) {
    console.warn('RSVP not saved: add your Google Apps Script URL to rsvpSheetUrl in config.', data);
    return;
  }
  const body = new URLSearchParams({
    name: data.name || '',
    attending: data.attending === 'no' ? 'Regretfully declines' : 'Joyfully accepts',
    guests: data.guests || '',
    days: (data.days || []).join(', '),
    note: data.note || '',
  });
  // 'no-cors' lets the browser post to Google without CORS errors.
  await fetch(url, { method: 'POST', mode: 'no-cors', body });
}
