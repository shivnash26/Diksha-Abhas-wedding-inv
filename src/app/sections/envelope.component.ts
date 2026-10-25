import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-envelope',
  standalone: true,
  templateUrl: './envelope.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class EnvelopeComponent {
  @Output() open = new EventEmitter<void>();
}
