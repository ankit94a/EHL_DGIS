import { AbstractControl, ValidatorFn } from '@angular/forms';

export function complexPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

    return pattern.test(value) ? null : { complexPassword: true };
  };
}
