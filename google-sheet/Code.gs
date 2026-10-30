/**
 * Wedding RSVP → Google Sheet
 *
 * Paste this into Extensions → Apps Script of your Google Sheet, then
 * Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone).
 * Every RSVP from the invitation is added as a new row in the "RSVPs" tab.
 */
const SHEET_NAME = 'RSVPs';
const HEADERS = ['Submitted at', 'Name', 'Attending', 'Guests', 'Days', 'Note', 'Side', 'Bringing someone', 'Attendees', 'Travel'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000); // avoid two replies writing the same row
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    // writes the header row on a new sheet, and adds any new column names to an older one
    if (sheet.getLastRow() === 0 || sheet.getLastColumn() < HEADERS.length) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    const p = e.parameter || {};
    sheet.appendRow([
      new Date(),
      clean(p.name),
      clean(p.attending),
      clean(p.guests),
      clean(p.days),
      clean(p.note),
      clean(p.side),
      clean(p.plusOne),
      clean(p.attendees),
      clean(p.travel),
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// Stops text like "=SUM(...)" from being treated as a formula, and trims long input.
function clean(value) {
  let v = String(value || '').slice(0, 1000);
  if (/^[=+\-@]/.test(v)) v = "'" + v;
  return v;
}
