import { Component } from '@angular/core';

@Component({
  selector: 'app-families',
  standalone: true,
  templateUrl: './families.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class FamiliesComponent {
}
