import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function numberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return typeof value === 'number' && !isNaN(value) ? null : { notANumber: true };
    };
}
