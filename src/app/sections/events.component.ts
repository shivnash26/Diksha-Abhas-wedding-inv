import { Component } from '@angular/core';
import { googleCalendarUrl, icsUrl } from '../calendar';

interface Place { label: string; url: string; }

// Home: 647B/I-P-6-7/1 (KH-1017), opposite Capital Public School, Jankipuram Garden, Lucknow 226021
const HOME: Place = { label: 'Home', url: 'https://maps.app.goo.gl/W9qRuXn5QEiHahtf8' };
const VENUE: Place = { label: 'Lotus Portico Club', url: 'https://maps.google.com/?q=Lotus%20Portico%20Club%20Lucknow' };

// small circle as an SVG path (used for flowers, notes)
const dot = (x: number, y: number, r: number) => `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

// line-art icons (24×24), drawn in each card's colour
const ICONS: Record<string, string[]> = {
  // bowl of turmeric with a marigold
  haldi: ['M4 13h16a8 6 0 0 1-16 0z', 'M7.5 13c1-2.2 2.7-3.2 4.5-3.2s3.5 1 4.5 3.2', dot(12, 5, 1.2),
    dot(14.3, 5, 1), dot(13.15, 7, 1), dot(10.85, 7, 1), dot(9.7, 5, 1), dot(10.85, 3, 1), dot(13.15, 3, 1)],
  // dholak with music notes
  sangeet: ['M4 15.5c0-2 1-3 2-3h9c1 0 2 1 2 3s-1 3-2 3H6c-1 0-2-1-2-3z', 'M6 12.5v6M15 12.5v6', 'M8 12.5l2 6M10.5 12.5l2 6',
    'M17 4.5v5', 'M21 3.5v5', 'M17 4.5l4-1', dot(16, 9.5, 1), dot(20, 8.5, 1)],
  // kalash with a drop of oil
  tel: ['M8.5 11c-2 1.4-3.2 3.3-3.2 5.3 0 2.8 3 4.7 6.7 4.7s6.7-1.9 6.7-4.7c0-2-1.2-3.9-3.2-5.3z', 'M9.5 9h5v2h-5z', 'M7.5 15.5h9',
    'M12 2.5c1.3 1.8 2 2.8 2 3.6a2 2 0 0 1-4 0c0-.8.7-1.8 2-3.6z'],
  // diya with flame
  matra: ['M3 14.5c2 3 5 4.5 9 4.5s7-1.5 9-4.5c-2 .6-4.5.9-9 .9s-7-.3-9-.9z', 'M9 21.5h6',
    'M12 4c1.8 2.3 2.6 3.8 2.6 5.1a2.6 2.6 0 0 1-5.2 0c0-1.3.8-2.8 2.6-5.1z'],
  // varmala (flower garland)
  baraat: ['M5 3c0 9 3 14.5 7 14.5S19 12 19 3', dot(12, 19.6, 1.6)],
  // doli (palanquin)
  vidaai: ['M7 10c0-3 2.2-5 5-5s5 2 5 5', 'M12 3v2', 'M7 10h10v7H7z', 'M10 10v7M14 10v7', 'M2 12.5h5M17 12.5h5', 'M8 17l-1 3M16 17l1 3'],
};

interface WeddingEvent {
  numeral: string;   // big faded number behind the card
  theme: string;     // card colours: haldi | sangeet | tel | matra | baraat | vidaai
  date: string;
  title: string;
  subtitle: string;
  time: string;
  colours?: string[];  // dress-code swatches (leave out to hide the row)
  note?: string;       // dress-code line
  place: Place;        // where it happens (links to Google Maps)
  calendar?: boolean;  // show the "Add to calendar" buttons
  image?: string;      // illustration shown when art = 'pictures'
}

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class EventsComponent {
  // 'icons' = small line icon on every card · 'pictures' = illustration (falls back to the icon)
  art: 'icons' | 'pictures' = 'pictures';
  readonly icons = ICONS;

  readonly googleCalendarUrl = googleCalendarUrl;
  readonly icsUrl = icsUrl;

  readonly events: WeddingEvent[] = [
    {
      numeral: 'I', theme: 'haldi', image: 'images/events/haldi.webp', date: 'Sun · 29 Nov 2026',
      title: 'Haldi', subtitle: 'The Golden Morning — turmeric, marigold and far too much laughter.',
      time: '1:00 PM – 2:00 PM', place: HOME,
      colours: ['#F2C94C', '#E8952E', '#8FB8A3', '#F4B6C8', '#AFCBEA'],
      note: 'Comfy pastels & marigold yellows',
    },
    {
      numeral: 'II', theme: 'sangeet', image: 'images/events/sangeet.webp', date: 'Sun · 29 Nov 2026',
      title: 'Sangeet', subtitle: 'The Night of Song — both families have been rehearsing in secret.',
      time: '7:00 PM onwards', place: HOME,
      colours: ['#1F6E7E', '#3E7D5A', '#C69A3E', '#1E1E1E', '#C9CCCF'],
      note: 'Glamorous cocktail & jewel tones',
    },
    {
      numeral: 'III', theme: 'tel', image: 'images/events/tel.webp', date: 'Wed · 2 Dec 2026',
      title: 'Tel Poojan', subtitle: 'Purification and glow — oil, blessings and a little pampering.',
      time: '12:00 PM onwards', place: HOME,
      colours: ['#F2C94C', '#E8952E', '#8FB8A3'],
      note: 'Comfy pastels & marigold yellows',
    },
    {
      numeral: 'IV', theme: 'matra', image: 'images/events/matra.webp', date: 'Wed · 2 Dec 2026',
      title: 'Matra Poojan', subtitle: 'Seeking the blessings of the mothers who came before us.',
      time: '2:00 PM onwards', place: HOME,
      colours: ['#F2C94C', '#E8952E', '#8FB8A3'],
      note: 'Comfy pastels & marigold yellows',
    },
    {
      numeral: 'V', theme: 'baraat', image: 'images/events/varmala.webp', date: 'Thu · 3 Dec 2026',
      title: 'Band, Baaja & Baraat', subtitle: 'The exchange of garlands — the big moment is finally here.',
      time: '6:00 PM onwards', place: VENUE, calendar: true,
      colours: ['#7A1F3D', '#1F5E4A', '#1E3A6E', '#C9A24A', '#F3EBDD'],
      note: 'Jewel tones & festive finery — maroon, emerald, royal blue, gold',
    },
    {
      numeral: 'VI', theme: 'vidaai', image: 'images/events/vidaai.webp', date: 'Fri · 4 Dec 2026',
      title: 'Vidaai', subtitle: 'From one home to another — the softest hour of them all.',
      time: '6:00 AM', place: VENUE,
    },
  ];
}
