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
  userForm: FormGroup;
  resultData: any = null;

  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group(
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
        extraMobiles: this.formBuilder.array([]),
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.validatePasswordMatch }
    );
  }

  validatePasswordMatch(groupControl: AbstractControl): ValidationErrors | null {
    const pwd = groupControl.get('password')?.value;
    const confirmPwd = groupControl.get('confirmPassword')?.value;
    if (pwd && confirmPwd && pwd !== confirmPwd) {
      groupControl.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    const errorList = groupControl.get('confirmPassword')?.errors;
    if (errorList) {
      delete errorList['passwordMismatch'];
      if (Object.keys(errorList).length === 0) {
        groupControl.get('confirmPassword')?.setErrors(null);
      }
    }
    return null;
  }

  get extraMobiles(): FormArray {
    return this.userForm.get('extraMobiles') as FormArray;
  }

  addMobile(): void {
    this.extraMobiles.push(
      this.formBuilder.control('', [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ])
    );
  }

  removeMobile(idx: number): void {
    this.extraMobiles.removeAt(idx);
  }

  isFieldValid(fieldName: string): boolean {
    const ctrl = this.userForm.get(fieldName);
    return ctrl ? ctrl.valid && (ctrl.dirty || ctrl.touched) : false;
  }

  isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.userForm.get(fieldName);
    return ctrl ? ctrl.invalid && (ctrl.dirty || ctrl.touched) : false;
  }

  isMobileValid(idx: number): boolean {
    const mobileControl = this.extraMobiles.at(idx);
    return mobileControl ? mobileControl.valid && (mobileControl.dirty || mobileControl.touched) : false;
  }

  isMobileInvalid(idx: number): boolean {
    const mobileControl = this.extraMobiles.at(idx);
    return mobileControl
      ? mobileControl.invalid && (mobileControl.dirty || mobileControl.touched)
      : false;
  }

  resetForm(): void {
    this.userForm.reset();
    this.extraMobiles.clear();
    this.resultData = null;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.resultData = {
        fullName: this.userForm.value.fullName,
        email: this.userForm.value.email,
        mobile: this.userForm.value.mobile,
        extraMobiles: this.userForm.value.extraMobiles,
        password: this.userForm.value.password,
      };
      this.userForm.reset();
      this.extraMobiles.clear();
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
