import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { startInvitationEffects } from './effects';
import { invitation } from './config';
import { sendRsvp } from './rsvp';
import { EnvelopeComponent } from './sections/envelope.component';
import { NavComponent } from './sections/nav.component';
import { MusicButtonComponent } from './sections/music-button.component';
import { HeroComponent } from './sections/hero.component';
import { CountdownComponent } from './sections/countdown.component';
import { CoupleComponent } from './sections/couple.component';
import { MemoriesComponent } from './sections/memories.component';
import { EventsComponent } from './sections/events.component';
import { AwaitingComponent } from './sections/awaiting.component';
import { FamiliesComponent } from './sections/families.component';
import { RsvpComponent } from './sections/rsvp.component';
import { VenueComponent } from './sections/venue.component';
import { FooterComponent } from './sections/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EnvelopeComponent, NavComponent, MusicButtonComponent, HeroComponent, CountdownComponent, CoupleComponent, MemoriesComponent, EventsComponent, AwaitingComponent, FamiliesComponent, RsvpComponent, VenueComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  opened = !invitation.envelopeIntro;
  sent = false;
  private fx: any;

  constructor(private cdr: ChangeDetectorRef) {}

  get showEnvelope() { return invitation.envelopeIntro && !this.opened; }

  ngAfterViewInit() {
    this.fx = startInvitationEffects(this.root.nativeElement, invitation);
  }

  ngOnDestroy() { this.fx?.destroy(); }

  openInvite() {
    this.fx.openEnvelope(() => { this.opened = true; this.cdr.detectChanges(); this.fx.observe(); });
  }

  onEnvelopeTap() { if (invitation.musicSrc && invitation.musicOnOpen) this.fx.startMusic(); }

  toggleMusic() { this.fx.toggleMusic(); }

  async submitRsvp(data: Record<string, unknown>) {
    const button = this.root.nativeElement.querySelector<HTMLButtonElement>('#rsvp button[type=submit]');
    if (button) { button.disabled = true; button.textContent = 'Sending…'; }
    try {
      await sendRsvp(data); // saves a row in your Google Sheet
    } catch (err) {
      alert('Sorry, your response could not be sent. Please check your connection and try again.');
      if (button) { button.disabled = false; button.textContent = 'Send Response'; }
      return;
    }
    this.sent = true;
    this.cdr.detectChanges();
    this.fx.observe();
  }
}
