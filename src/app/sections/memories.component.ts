import { Component } from '@angular/core';

@Component({
  selector: 'app-memories',
  standalone: true,
  templateUrl: './memories.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class MemoriesComponent {
}
