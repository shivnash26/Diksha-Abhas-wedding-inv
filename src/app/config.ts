// Animation settings (these were the editable "Motion" props in Claude Design)
export const invitation = {
  envelopeIntro: true,   // show the envelope screen before the invitation
  petalCount: 38,        // falling petals/leaves (0 to turn off)
  cursorSparkle: true,   // sparkle trail behind the mouse on desktop
  weddingDate: '2026-12-03T18:00:00+05:30', // countdown target (IST)

  // Background music: put an .mp3 in public/audio/ and set its path, e.g. 'audio/wedding-song.mp3'.
  // Leave empty to use the soft generated tone. It starts when the guest opens the envelope.
  musicSrc: 'audio/Din Shagna Da Phillauri 128 Kbps.mp3',
  musicVolume: 0.5,      // 0 (silent) to 1 (full)
  musicOnOpen: true,     // start playing as soon as the envelope is opened

  // RSVP: paste your Google Apps Script web app URL here (see README → "Save RSVPs to a spreadsheet")
  rsvpSheetUrl: 'https://script.google.com/macros/s/AKfycbxDokjSBkK4SF-UrqfjdGUR3j6dmgp84Lec5A_xCxxulbHGBdhke2Oz_yDcjgQSiL33/exec',
};
