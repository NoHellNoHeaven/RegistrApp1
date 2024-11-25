import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface User {
  name: string;
  lastName: string;
  email: string;
  role: string;
}


@Component({
  selector: 'app-profesor',
  templateUrl: './profesor.page.html',
  styleUrls: ['./profesor.page.scss'],
})
export class ProfesorPage implements OnInit {
  user: User | null = null;
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    // Obtener datos del usuario del localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }
}
