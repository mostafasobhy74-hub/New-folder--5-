import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  submittedData: any = null;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(5)]],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
          ],
        ],
        mobile: [
          '',
          [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)],
        ],
        additionalMobiles: this.fb.array([]),
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    const errors = group.get('confirmPassword')?.errors;
    if (errors) {
      delete errors['passwordMismatch'];
      if (Object.keys(errors).length === 0) {
        group.get('confirmPassword')?.setErrors(null);
      }
    }
    return null;
  }

  get additionalMobiles(): FormArray {
    return this.registerForm.get('additionalMobiles') as FormArray;
  }

  addMobile(): void {
    this.additionalMobiles.push(
      this.fb.control('', [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ])
    );
  }

  removeMobile(index: number): void {
    this.additionalMobiles.removeAt(index);
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.valid && (field.dirty || field.touched) : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  
  isMobileValid(index: number): boolean {
    const control = this.additionalMobiles.at(index);
    return control ? control.valid && (control.dirty || control.touched) : false;
  }

  isMobileInvalid(index: number): boolean {
    const control = this.additionalMobiles.at(index);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  resetForm(): void {
    this.registerForm.reset();
    this.additionalMobiles.clear();
    this.submittedData = null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.submittedData = {
        fullName: this.registerForm.value.fullName,
        email: this.registerForm.value.email,
        mobile: this.registerForm.value.mobile,
        additionalMobiles: this.registerForm.value.additionalMobiles,
        password: this.registerForm.value.password,
      };
      this.registerForm.reset();
      this.additionalMobiles.clear();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
