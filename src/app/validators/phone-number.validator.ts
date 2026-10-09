import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined) {
      return { required: true };
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) {
        return { required: true };
      }
      const digitsOnly = trimmed.replace(/\D/g, '');
      if (digitsOnly.length === 0) {
        return { required: true };
      }
      if (trimmed.startsWith('+') && digitsOnly.length <= 4 && trimmed.length <= 5) {
        return { required: true };
      }
      return null;
    }

    if (typeof value === 'object') {
      const nationalDigits = (value.nationalNumber || '').toString().replace(/\D/g, '');
      if (nationalDigits.length > 0) {
        return null;
      }

      const dialCodeDigits = (value.dialCode || '').toString().replace(/\D/g, '');
      const numberStr = (value.number || '').toString().trim();
      const numberDigits = numberStr.replace(/\D/g, '');

      let subscriberDigits = '';
      if (numberDigits.length > 0) {
        if (dialCodeDigits && numberDigits.startsWith(dialCodeDigits)) {
          subscriberDigits = numberDigits.slice(dialCodeDigits.length);
        } else if (numberDigits !== dialCodeDigits) {
          subscriberDigits = numberDigits;
        }
      }

      if (subscriberDigits.length > 0) {
        return null;
      }

      const intlStr = (value.internationalNumber || '').toString().trim();
      const intlDigits = intlStr.replace(/\D/g, '');
      let intlSubscriberDigits = '';
      if (intlDigits.length > 0) {
        if (dialCodeDigits && intlDigits.startsWith(dialCodeDigits)) {
          intlSubscriberDigits = intlDigits.slice(dialCodeDigits.length);
        } else if (intlDigits !== dialCodeDigits) {
          intlSubscriberDigits = intlDigits;
        }
      }

      if (intlSubscriberDigits.length > 0) {
        return null;
      }

      return { required: true };
    }

    return null;
  };
}

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber = control.value;

    if (!phoneNumber) {
      return null;
    }

    if (typeof phoneNumber === 'object' && phoneNumber.number) {
      const number = phoneNumber.number;
      const pattern = /^[+\d\s()/-]+$/;

      if (!pattern.test(number)) {
        return { invalidPhoneNumber: true };
      }
    } else if (typeof phoneNumber === 'string') {
      const pattern = /^[+\d\s()/-]+$/;
      if (!pattern.test(phoneNumber)) {
        return { invalidPhoneNumber: true };
      }
    } else {
      return { invalidPhoneNumber: true };
    }

    return null;
  };
}
