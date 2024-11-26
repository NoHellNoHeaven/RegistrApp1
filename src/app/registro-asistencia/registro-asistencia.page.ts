import { Component, OnInit } from '@angular/core';

interface Student {
  id: string;
  name: string;
  lastName: string;
  email: string;
  present?: boolean; // Propiedad para indicar asistencia
}

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {
  students: Student[] = [];

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.students = JSON.parse(localStorage.getItem('students') || '[]');
  }
}
