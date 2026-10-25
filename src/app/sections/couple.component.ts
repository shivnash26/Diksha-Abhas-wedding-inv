import { Component } from '@angular/core';

@Component({
  selector: 'app-couple',
  standalone: true,
  templateUrl: './couple.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class CoupleComponent {
}
