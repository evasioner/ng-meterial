import {FormGroup} from '@angular/forms';

export function MustMatch(controlName: string, matchingControlName: string): (formGroup: FormGroup) => ({ invalid: boolean }) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return {invalid: true};
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({mustMatch: true});
      return {invalid: true};
    } else {
      matchingControl.setErrors(null);
      return {invalid: false};
    }
  };
}
