import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkAddblank',
  standalone: true
})
export class LinkAddblankPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (value) {
      const modifiedValue = value.replace(/<a /g, '<a target="_blank" ');
      return this.sanitizer.bypassSecurityTrustHtml(modifiedValue);
    }
    return value;
  }

}