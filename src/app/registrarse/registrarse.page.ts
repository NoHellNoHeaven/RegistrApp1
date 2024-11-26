import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface User {
  name: string;
  lastName: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  course?: string;
  school?: string;
  carrer?: string;
  sede?: string;
}

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage {
  registrarseForm: FormGroup;
  message: string = '';
  isSuccess: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registrarseForm = this.fb.group({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', [Validators.required]],
      course: [''],
      school: [''],
      carrer: [''],
      sede: ['']
    });

    // Watch for changes on the 'role' field to show/hide additional fields
    this.registrarseForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'teacher') {
        this.registrarseForm.get('course')?.setValidators([Validators.required]);
        this.registrarseForm.get('school')?.setValidators([Validators.required]);
        this.registrarseForm.get('carrer')?.clearValidators();
        this.registrarseForm.get('sede')?.clearValidators();
      } else if (role === 'student') {
        this.registrarseForm.get('carrer')?.setValidators([Validators.required]);
        this.registrarseForm.get('sede')?.setValidators([Validators.required]);
        this.registrarseForm.get('course')?.clearValidators();
        this.registrarseForm.get('school')?.clearValidators();
      } else {
        this.registrarseForm.get('course')?.clearValidators();
        this.registrarseForm.get('school')?.clearValidators();
        this.registrarseForm.get('carrer')?.clearValidators();
        this.registrarseForm.get('sede')?.clearValidators();
      }
      this.registrarseForm.get('course')?.updateValueAndValidity();
      this.registrarseForm.get('school')?.updateValueAndValidity();
      this.registrarseForm.get('carrer')?.updateValueAndValidity();
      this.registrarseForm.get('sede')?.updateValueAndValidity();
    });
  }

  onSubmit() {
    if (this.registrarseForm.valid) {
      const { name, lastName, email, password, role, course, school, carrer, sede } = this.registrarseForm.value;
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: User) => u.email === email)) {
        this.message = 'Este correo electrónico ya está registrado';
        this.isSuccess = false;
        return;
      }
      const newUser: User = { name, lastName, email, password, role, course, school, carrer, sede };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      this.message = 'Registro exitoso';
      this.isSuccess = true;
      setTimeout(() => {
        this.router.navigate(['/home']); // Redirigir a la página de inicio
      }, 2000);
    }
  }




  goHome() {
    this.router.navigate(['/home']);
  }
}
