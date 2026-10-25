import { Component } from '@angular/core';

@Component({
  selector: 'app-events',
  standalone: true,
  templateUrl: './events.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class EventsComponent {
}
