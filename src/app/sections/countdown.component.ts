import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone } from '@angular/core';

@Component({
  selector: 'app-countdown',
  standalone: true,
  templateUrl: './countdown.component.html',
  // render children directly so the page layout is identical to the original
  host: { style: 'display: contents' },
})
export class CountdownComponent implements AfterViewInit, OnDestroy {
  @ViewChild('foil') foilRef!: ElementRef<HTMLCanvasElement>;
  revealed = false;

  private ctx: CanvasRenderingContext2D | null = null;
  private scratching = false;
  private last: { x: number; y: number } | null = null;
  private moves = 0;
  private cleanups: (() => void)[] = [];

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    const cv = this.foilRef.nativeElement;
    this.ctx = cv.getContext('2d');
    if (!this.ctx) return this.reveal();

    // wait for the script font so the foil lettering renders in Great Vibes
    const fonts = (document as any).fonts;
    (fonts?.load ? fonts.load('40px "Great Vibes"').catch(() => {}) : Promise.resolve()).then(() => this.paintFoil());

    this.zone.runOutsideAngular(() => {
      const on = (type: string, fn: (e: any) => void) => {
        cv.addEventListener(type, fn);
        this.cleanups.push(() => cv.removeEventListener(type, fn));
      };
      on('pointerdown', (e: PointerEvent) => {
        this.scratching = true;
        this.last = this.point(e);
        cv.setPointerCapture?.(e.pointerId);
        this.scratch(this.last);
      });
      on('pointermove', (e: PointerEvent) => {
        if (!this.scratching) return;
        this.scratch(this.point(e));
      });
      const stop = () => { this.scratching = false; this.last = null; this.checkCleared(); };
      on('pointerup', stop);
      on('pointercancel', stop);

      // keep the foil sharp on resize, as long as nobody has scratched it yet
      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(() => { if (!this.moves && !this.revealed) this.paintFoil(); });
        ro.observe(cv);
        this.cleanups.push(() => ro.disconnect());
      }
    });
  }

  ngOnDestroy() {
    this.cleanups.forEach((fn) => fn());
  }

  reveal() {
    if (this.revealed) return;
    this.zone.run(() => (this.revealed = true));
  }

  private paintFoil() {
    const cv = this.foilRef.nativeElement;
    const ctx = this.ctx!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = cv.clientWidth, h = cv.clientHeight;
    cv.width = Math.round(w * dpr);
    cv.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // brushed gold
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#c9a066');
    g.addColorStop(.3, '#e9cd92');
    g.addColorStop(.48, '#f3dca4');
    g.addColorStop(.7, '#c79a5c');
    g.addColorStop(1, '#b8874a');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255,240,205,.16)';
    ctx.lineWidth = 1;
    for (let x = -h; x < w; x += 6) {
      ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(x + h, 0); ctx.stroke();
    }
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = `rgba(255,248,225,${(.15 + Math.random() * .4).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.8 + .4, 0, Math.PI * 2); ctx.fill();
    }

    // seal
    const cx = w / 2, sy = h * .3;
    const sg = ctx.createRadialGradient(cx - 4, sy - 5, 2, cx, sy, 14);
    sg.addColorStop(0, '#fff7e4'); sg.addColorStop(.6, '#ecd6a8'); sg.addColorStop(1, '#c9a368');
    ctx.fillStyle = sg;
    ctx.shadowColor = 'rgba(90,60,25,.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 2;
    ctx.beginPath(); ctx.arc(cx, sy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#6b3a22';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '13px Georgia, serif';
    ctx.fillText('✦', cx, sy + 1);

    // lettering
    ctx.fillStyle = '#6b2f1f';
    ctx.font = `${Math.min(40, w / 9)}px "Great Vibes", cursive`;
    ctx.fillText('Scratch to reveal', cx, h * .56);
    ctx.fillStyle = 'rgba(95,60,30,.6)';
    ctx.font = '9px "Cormorant Garamond", Georgia, serif';
    (ctx as any).letterSpacing = '3px';
    ctx.fillText('DRAG ACROSS THE PANEL', cx, h * .76);
    (ctx as any).letterSpacing = '0px';
  }

  private point(e: PointerEvent) {
    const r = this.foilRef.nativeElement.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  private scratch(p: { x: number; y: number }) {
    const ctx = this.ctx;
    if (!ctx || this.revealed) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = '#000';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 38;
    ctx.beginPath();
    const from = this.last ?? p;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x + .01, p.y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    this.last = p;
    if (++this.moves % 12 === 0) this.checkCleared();
  }

  // once most of the foil is gone, fade the rest away
  private checkCleared() {
    const cv = this.foilRef.nativeElement;
    if (!this.ctx || this.revealed || !cv.width) return;
    const data = this.ctx.getImageData(0, 0, cv.width, cv.height).data;
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 64) { total++; if (data[i] < 40) clear++; }
    if (clear / total > .5) this.reveal();
  }
}
