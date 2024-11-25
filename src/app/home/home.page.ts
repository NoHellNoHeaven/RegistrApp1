import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  email: string;
  password: string;
  role: 'student' | 'teacher';
  course?: string;
  school?: string;
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
      role: ['', [Validators.required]],
      course: [''],
      school: ['']
    });

    // Watch for changes on the 'role' field to show/hide additional fields
    this.loginForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'teacher') {
        this.loginForm.get('course')?.setValidators([Validators.required]);
        this.loginForm.get('school')?.setValidators([Validators.required]);
      } else {
        this.loginForm.get('course')?.clearValidators();
        this.loginForm.get('school')?.clearValidators();
      }
      this.loginForm.get('course')?.updateValueAndValidity();
      this.loginForm.get('school')?.updateValueAndValidity();
    });
  }

  verifyUser(email: string, password: string): User | null {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    return users.find(user => user.email === email && user.password === password) || null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password, role, course, school } = this.loginForm.value;
      const user = this.verifyUser(email, password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (role === 'student') {
          this.router.navigate(['/estudiante']);
        } else if (role === 'teacher') {
          // Save additional fields for teachers
          user.course = course;
          user.school = school;
          localStorage.setItem('currentUser', JSON.stringify(user));
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
