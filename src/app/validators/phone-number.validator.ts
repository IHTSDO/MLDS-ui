import { AbstractControl, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const phoneNumber = control.value;


    if (!phoneNumber) {
      return null;
    }
    
    if (phoneNumber && typeof phoneNumber === 'object' && phoneNumber.number) {
      const number = phoneNumber.number;
      
      const pattern = /^[+\d\s()/-]+$/;

      
      if (!pattern.test(number)) {
        return { invalidPhoneNumber: true };
      }
    } else {
     
      return { invalidPhoneNumber: true };
    }

    return null;
  };
}
