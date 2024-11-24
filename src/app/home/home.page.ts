import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  email: string;
  password: string;
  role: 'student' | 'teacher';
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  loginForm: FormGroup;
  error: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  verifyUser(email: string, password: string): User | null {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    return users.find(user => user.email === email && user.password === password) || null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      const user = this.verifyUser(email, password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.role === 'student') {
          this.router.navigate(['/estudiante']);
        } else if (user.role === 'teacher') {
          this.router.navigate(['/profesor']);
        }
      } else {
        this.error = 'Correo electrónico o contraseña incorrectos';
        setTimeout(() => {
          this.error = '';
        }, 5000); // El mensaje de error desaparecerá después de 5 segundos
      }
    }
  }
}
