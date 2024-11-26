import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {
  presentCount: number = 0;
  maxStudents: number = 25;

  ngOnInit() {
    this.loadPresentCount();
  }

  loadPresentCount() {
    const count = localStorage.getItem('presentCount');
    if (count) {
      this.presentCount = parseInt(count, 10);
    }
  }

  getAttendancePercentage(): number {
    return (this.presentCount / this.maxStudents) * 100;
  }
}
