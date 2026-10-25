import { Component } from '@angular/core';

@Component({
  selector: 'app-countdown',
  standalone: true,
  templateUrl: './countdown.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class CountdownComponent {
}
