import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { LoadingController, ToastController } from '@ionic/angular';

interface Attendance {
  date: string;
  course: string;
  status: 'Presente';
}

@Component({
  selector: 'app-nueva-asistencia',
  templateUrl: './nueva-asistencia.page.html',
  styleUrls: ['./nueva-asistencia.page.scss'],
})
export class NuevaAsistenciaPage {
  presentCount: number = 0; // Contador de alumnos presentes
  message: string = '';

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController, private router: Router) {
    this.checkResetCondition();
  }

  checkResetCondition() {
    const storedTime = localStorage.getItem('presentCountTime');
    if (storedTime) {
      const previousTime = new Date(storedTime);
      const currentTime = new Date();
      const hoursDifference = Math.abs(currentTime.getTime() - previousTime.getTime()) / 36e5;

      if (hoursDifference >= 24) {
        // Resetear el contador después de 24 horas
        localStorage.removeItem('presentCount');
        localStorage.setItem('presentCountTime', currentTime.toISOString());
      } else {
        // Cargar el contador existente
        const count = localStorage.getItem('presentCount');
        this.presentCount = count ? parseInt(count, 10) : 0;
      }
    } else {
      // Guardar la hora actual si no existe
      localStorage.setItem('presentCountTime', new Date().toISOString());
    }
  }

  async scan() {
    const result = await CapacitorBarcodeScanner.scanBarcode({ hint: CapacitorBarcodeScannerTypeHint.ALL });
    if (result) {
      this.onQrCodeScanned(result.ScanResult);
    }
  }

  async onQrCodeScanned(qrCode: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando asistencia...',
    });
    loading.present();

    const currentDate = new Date().toLocaleDateString();
    const storedUsers = localStorage.getItem('users');
    const users = storedUsers ? JSON.parse(storedUsers) : [];

    const user = users.find((u: any) => u.email === qrCode);

    if (user) {
      const attendance: Attendance = {
        date: currentDate,
        course: user.course || 'Curso no especificado',
        status: 'Presente',
      };

      let storedAttendances = localStorage.getItem('attendances');
      let attendances = storedAttendances ? JSON.parse(storedAttendances) : [];

      attendances.push(attendance); // Agregar la nueva asistencia
      localStorage.setItem('attendances', JSON.stringify(attendances)); // Guardar la lista actualizada en el local storage

      this.presentCount++; // Incrementar el contador de alumnos presentes
      localStorage.setItem('presentCount', this.presentCount.toString()); // Guardar el contador en el local storage

      this.message = `Asistencia registrada para ${user.name} ${user.lastName}. Alumnos presentes: ${this.presentCount}`;
      this.showToast(this.message);
    } else {
      this.message = 'Código QR no válido o usuario no encontrado';
      this.showToast(this.message);
    }

    loading.dismiss();
  }

  async showToast(texto: string) {
    const toast = await this.toastCtrl.create({
      message: texto,
      duration: 3000,
      position: 'bottom',
      cssClass: 'rounded-toast',
    });
    await toast.present();
  }

  goBack() {
    this.router.navigate(['/estudiante']);
  }
}
