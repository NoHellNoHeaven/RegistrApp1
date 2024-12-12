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
    this.loadAttendances();
  }

  loadUserData() {
    // Obtener datos del usuario del localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

  loadAttendances() {
    // Cargar las asistencias del localStorage
    const storedAttendances = localStorage.getItem('attendances');
    if (storedAttendances) {
      this.attendances = JSON.parse(storedAttendances);
    }
  }

  goToNuevaAsistencia() {
    this.router.navigate(['./nueva-asistencia']);
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }
}
