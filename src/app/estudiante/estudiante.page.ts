import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  name: string;
  lastName: string;
  email: string;
  role: string;
}

interface Attendance {
  date: string;
  course: string;
  status: 'Presente' | 'Ausente';
}

@Component({
  selector: 'app-estudiante',
  templateUrl: './estudiante.page.html',
  styleUrls: ['./estudiante.page.scss'],
})
export class EstudiantePage implements OnInit {
  user: User | null = null;
  attendances: Attendance[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadUserData();
    this.loadMockAttendances();
  }

  loadUserData() {
    // Obtener datos del usuario del localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

  loadMockAttendances() {
    // Simular datos de asistencia
    const mockAttendances: Attendance[] = [
      { date: '2023-05-01', course: 'Matemáticas', status: 'Presente' },
      { date: '2023-05-02', course: 'Historia', status: 'Ausente' },
      { date: '2023-05-03', course: 'Ciencias', status: 'Presente' },
      { date: '2023-05-04', course: 'Literatura', status: 'Presente' },
      { date: '2023-05-05', course: 'Educación Física', status: 'Presente' },
    ];
    this.attendances = mockAttendances;
  }

  goToNuevaAsistencia() {
    this.router.navigate(['/estudiante/nueva-asistencia']);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }
}
