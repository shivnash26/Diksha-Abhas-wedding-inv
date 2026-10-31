import { Component } from '@angular/core';

interface WeddingEvent {
  numeral: string;   // big faded number behind the card
  theme: string;     // card colours: haldi | sangeet | tel | matra | baraat | vidaai
  date: string;
  title: string;
  subtitle: string;
  time: string;
  colours?: string[];  // dress-code swatches (leave out to hide the row)
  note?: string;       // dress-code line
}

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class EventsComponent {
  readonly events: WeddingEvent[] = [
    {
      numeral: 'I', theme: 'haldi', date: 'Sun · 29 Nov 2026',
      title: 'Haldi', subtitle: 'The Golden Morning — turmeric, marigold and far too much laughter.',
      time: '1:00 PM – 2:00 PM',
      colours: ['#F2C94C', '#E8952E', '#8FB8A3', '#F4B6C8', '#AFCBEA'],
      note: 'Comfy pastels & marigold yellows',
    },
    {
      numeral: 'II', theme: 'sangeet', date: 'Sun · 29 Nov 2026',
      title: 'Sangeet', subtitle: 'The Night of Song — both families have been rehearsing in secret.',
      time: '7:00 PM onwards',
      colours: ['#1F6E7E', '#3E7D5A', '#C69A3E', '#1E1E1E', '#C9CCCF'],
      note: 'Glamorous cocktail & jewel tones',
    },
    {
      numeral: 'III', theme: 'tel', date: 'Wed · 2 Dec 2026',
      title: 'Tel Poojan', subtitle: 'Purification and glow — oil, blessings and a little pampering.',
      time: '12:00 PM onwards',
      colours: ['#F2C94C', '#E8952E', '#8FB8A3'],
      note: 'Comfy pastels & marigold yellows',
    },
    {
      numeral: 'IV', theme: 'matra', date: 'Wed · 2 Dec 2026',
      title: 'Matra Poojan', subtitle: 'Seeking the blessings of the mothers who came before us.',
      time: '2:00 PM onwards',
      colours: ['#F2C94C', '#E8952E', '#8FB8A3'],
      note: 'Comfy pastels & marigold yellows',
    },
    {
      numeral: 'V', theme: 'baraat', date: 'Thu · 3 Dec 2026',
      title: 'Band, Baaja & Baraat', subtitle: 'The exchange of garlands — the big moment is finally here.',
      time: '6:00 PM onwards',
      colours: ['#7A1F3D', '#1F5E4A', '#1E3A6E', '#C9A24A', '#F3EBDD'],
      note: 'Jewel tones & festive finery — maroon, emerald, royal blue, gold',
    },
    {
      numeral: 'VI', theme: 'vidaai', date: 'Fri · 4 Dec 2026',
      title: 'Vidaai', subtitle: 'From one home to another — the softest hour of them all.',
      time: '6:00 AM',
    },
  ];
}
