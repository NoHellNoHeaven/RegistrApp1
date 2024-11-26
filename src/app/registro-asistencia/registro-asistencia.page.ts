import { Component, OnInit } from '@angular/core';

interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher';
  present?: boolean; // Propiedad para indicar asistencia
}

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {
  users: User[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.users = JSON.parse(localStorage.getItem('users') || '[]').filter((u: User) => u.role === 'student');
  }
}
