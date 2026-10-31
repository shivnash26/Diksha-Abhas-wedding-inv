import { Component } from '@angular/core';

@Component({
  selector: 'app-venue',
  standalone: true,
  templateUrl: './venue.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class VenueComponent {
  // contact for guests (Indian numbers, without +91)
  readonly phones = [
    { tel: '7905378572', display: '+91 79053 78572' },
    { tel: '6394137892', display: '+91 63941 37892' },
  ];
}
