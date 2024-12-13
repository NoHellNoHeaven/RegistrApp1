import { Component, OnInit } from '@angular/core';

interface Attendance {
  date: string;
  course: string;
  status: 'Presente' | 'Ausente';
  student: {
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {
  attendances: Attendance[] = [];

  constructor() {}

  ngOnInit() {
    this.loadAttendances();
  }

  loadAttendances() {
    const storedAttendances = localStorage.getItem('attendances');
    this.attendances = storedAttendances ? JSON.parse(storedAttendances) : [];
  }
}
