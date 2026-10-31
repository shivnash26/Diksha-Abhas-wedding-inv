import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rsvp',
  standalone: true,
  templateUrl: './rsvp.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class RsvpComponent {
  @Input() sent = false;
  @Output() submitted = new EventEmitter<Record<string, unknown>>();

  readonly sides = ['Bride', 'Groom', 'Both'];
  readonly plusOne = ['Yes', 'No', 'Not sure'];
  readonly travel = ['By car directly to the venue', 'Flying to Lucknow first', 'Coming by train to Lucknow Station', 'Need to plan'];
  readonly days = ['Haldi', 'Sangeet', 'Tel Poojan', 'Matra Poojan', 'Baraat', 'Vidaai'];

  onSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    this.submitted.emit({ ...Object.fromEntries(fd), days: fd.getAll('d') });
  }
}
