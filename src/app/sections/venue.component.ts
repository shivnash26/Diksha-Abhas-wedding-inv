import { Component } from '@angular/core';

@Component({
  selector: 'app-venue',
  standalone: true,
  templateUrl: './venue.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class VenueComponent {
}
