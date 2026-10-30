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
  @Output() tapped = new EventEmitter<void>(); // fires straight away, inside the tap, so music may start
  opening = false;

  // break the seal and lift the flap, then hand over to the page fade-out
  start() {
    if (this.opening) return;
    this.opening = true;
    this.tapped.emit();
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => this.open.emit(), reduced ? 0 : 750);
  }
}
