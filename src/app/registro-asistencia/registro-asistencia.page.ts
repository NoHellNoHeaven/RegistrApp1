import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-asistencia',
  templateUrl: './registro-asistencia.page.html',
  styleUrls: ['./registro-asistencia.page.scss'],
})
export class RegistroAsistenciaPage implements OnInit {
  presentCount: number = 0;
  maxStudents: number = 25;
  constructor(private router: Router){
    
  }
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
  
  } goBack() {
    this.router.navigate(['/profesor']);
  }
}
