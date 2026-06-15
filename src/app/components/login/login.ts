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
  @ViewChild('loginForm') loginForm!: NgForm;

  email: string = '';
  password: string = '';
  submittedData: any = null;

  resetForm(): void {
    this.loginForm.resetForm();
    this.submittedData = null;
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      this.submittedData = {
        email: this.email,
        password: this.password,
      };
      form.resetForm();
    }
  }
}
