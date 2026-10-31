import { Component } from '@angular/core';
import { googleCalendarUrl, icsUrl } from '../calendar';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class FooterComponent {
  readonly googleCalendarUrl = googleCalendarUrl;
  readonly icsUrl = icsUrl;
}
