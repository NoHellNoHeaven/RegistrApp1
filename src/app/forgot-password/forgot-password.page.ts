import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

interface User {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher';
  course?: string;
  school?: string;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  resetForm: FormGroup;
  verifyForm: FormGroup;
  usuarios: User[] = JSON.parse(localStorage.getItem('users') || '[]'); // Cargar usuarios del local storage
  message: string = '';
  isCodeSent: boolean = false; // Nueva variable para manejar la lógica de envío de código

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.verifyForm = this.fb.group({
      code: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async resetPassword() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando...'
    });
    const email = this.resetForm.get('email')?.value;
    for (let u of this.usuarios) {
      if (u.email === email) {
        loading.present();
        let nueva = Math.random().toString(36).slice(-6);
        u.password = nueva;
        let body = {
          "nombre": u.name,
          "app": "RegistrApp",
          "clave": nueva,
          "email": u.email
        };
        this.http.post("https://myths.cl/api/reset_password.php", body)
          .subscribe((data) => {
            loading.dismiss();
            this.message = 'Correo enviado correctamente. Por favor revisa tu email para el código de verificación.';
            this.isCodeSent = true; // Activar la sección de verificación de código
            console.log(data);
          }, error => {
            loading.dismiss();
            this.message = 'Error al enviar el correo. Por favor, inténtalo de nuevo.';
            console.error(error);
          });
        localStorage.setItem('users', JSON.stringify(this.usuarios)); // Actualizar la lista de usuarios en el local storage
        return;
      }
    }
    loading.dismiss();
    this.message = 'Correo electrónico no encontrado';
  }

  verifyCode() {
    const { code, newPassword } = this.verifyForm.value;
    const email = this.resetForm.get('email')?.value;
    for (let u of this.usuarios) {
      if (u.email === email && u.password === code) {
        u.password = newPassword;
        localStorage.setItem('users', JSON.stringify(this.usuarios)); // Actualizar la lista de usuarios en el local storage
        this.message = 'Contraseña cambiada correctamente';
        this.isCodeSent = false; // Reiniciar el formulario
        return;
      }
    }
    this.message = 'Código de verificación incorrecto';
  }
}
