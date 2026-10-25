import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-music-button',
  standalone: true,
  templateUrl: './music-button.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class MusicButtonComponent {
  @Output() toggle = new EventEmitter<void>();
}
