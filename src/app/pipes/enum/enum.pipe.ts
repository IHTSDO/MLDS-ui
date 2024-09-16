import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';

@Pipe({
  name: 'enum',
  standalone: true
})
export class EnumPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}
  transform(enumValue: string | null, translateKeyPrefix: string): Observable<string> {
    if (enumValue) {
      const combinedKey = `${translateKeyPrefix}${enumValue}`;
      // Use TranslateService.get() to get the translated value asynchronously
      return this.translateService.get(combinedKey).pipe(
        map(translation => translation || combinedKey) // Fallback to key if translation is not found
      );
    }
    return new Observable<string>(observer => observer.next(''));
  }
}