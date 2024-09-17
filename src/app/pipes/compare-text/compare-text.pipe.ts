import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'compareText',
  standalone: true
})
export class CompareTextPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(translatedText: string, staticText: string): string {
    // Get the current language
    const currentLang = this.translateService.currentLang;

    // Convert both texts to lowercase for case-insensitive comparison
    const lowerTranslatedText = (translatedText || '').toLowerCase();
    const lowerStaticText = (staticText || '').toLowerCase();

    // Handle special case where IHTSDO and SNOMED are considered the same
    if (lowerTranslatedText === 'snomed releases' && lowerStaticText === 'ihtsdo releases') {
      return translatedText;
    }

    // If the language is English and both texts are the same, return only one
    if (currentLang === 'en' && lowerTranslatedText === lowerStaticText) {
      return translatedText;
    }

    // If the language is not English, return only the translated text (ignore static text)
    if (currentLang !== 'en') {
      return translatedText;
    }

    // Otherwise, return both if the language is English and they are different
    return `${translatedText} (${staticText})`;
  }
}