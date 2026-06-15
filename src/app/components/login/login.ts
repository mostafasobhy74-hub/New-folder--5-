import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  @ViewChild('loginForm') authForm!: NgForm;

  userEmail: string = '';
  userPassword: string = '';
  formData: any = null;

  resetForm(): void {
    this.authForm.resetForm();
    this.formData = null;
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      this.formData = {
        email: this.userEmail,
        password: this.userPassword,
      };
      userForm.resetForm();
    }
  }
}
