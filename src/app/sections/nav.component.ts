import { Component } from '@angular/core';

@Component({
  selector: 'app-nav',
  standalone: true,
  templateUrl: './nav.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class NavComponent {
}
