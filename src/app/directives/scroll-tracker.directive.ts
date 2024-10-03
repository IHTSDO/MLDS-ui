import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appScrollTracker]',
  standalone: true
})
export class ScrollTrackerDirective {
  @Output() scrollingFinished = new EventEmitter<void>();

  private emitted = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    // Calculate whether the user has scrolled to the bottom of the page
    const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 100); // Offset for slight threshold

    if (nearBottom && !this.emitted) {
      this.emitted = true; // Prevents multiple emissions
      this.scrollingFinished.emit(); // Emit event
    } else if (!nearBottom) {
      this.emitted = false; // Reset if not near bottom
    }
  }
}