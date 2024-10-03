import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationErrorCodeExtractorService {

  extractErrorCodeFromMessage(message: string): string | null {
    const errorCodePattern = /MLDS_ERR_[A-Z_]+/;
    const errorCodePatternResult = errorCodePattern.exec(message);
    return errorCodePatternResult ? errorCodePatternResult[0] : null;
  }
}
