import { Component } from '@angular/core';

interface Photo { src: string; alt: string; }

@Component({
  selector: 'app-memories',
  standalone: true,
  templateUrl: './memories.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class MemoriesComponent {
  // Put photos in public/images/ and set src to e.g. 'images/us-1.jpg' (leave '' for a placeholder).
  // Portrait photos (about 4:5) look best.
  readonly together: Photo[] = [
    { src: 'images/1.webp', alt: 'Diksha and Abhas together' },
    { src: 'images/2.webp', alt: 'Diksha and Abhas together' },
    { src: 'images/3.webp', alt: 'Diksha and Abhas together' },
    { src: 'images/4.webp', alt: 'Diksha and Abhas together' },
  ];

  readonly overTheYears: Photo[] = [
    { src: 'images/5.webp', alt: 'Diksha and Abhas over the years' },
    { src: 'images/6.webp', alt: 'Diksha and Abhas over the years' },
    { src: 'images/7.webp', alt: 'Diksha and Abhas over the years' },
    { src: 'images/8.webp', alt: 'Diksha and Abhas over the years' },
  ];
}
