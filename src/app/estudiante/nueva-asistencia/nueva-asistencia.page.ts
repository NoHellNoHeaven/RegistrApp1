import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { LoadingController, ToastController } from '@ionic/angular';

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
  selector: 'app-nueva-asistencia',
  templateUrl: './nueva-asistencia.page.html',
  styleUrls: ['./nueva-asistencia.page.scss'],
})
export class NuevaAsistenciaPage {
  presentCount: number = 0;
  message: string = '';

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    this.checkResetCondition();
  }

  checkResetCondition() {
    const storedTime = localStorage.getItem('presentCountTime');
    if (storedTime) {
      const previousTime = new Date(storedTime);
      const currentTime = new Date();
      const hoursDifference = Math.abs(currentTime.getTime() - previousTime.getTime()) / 36e5;

      if (hoursDifference >= 24) {
        localStorage.removeItem('presentCount');
        localStorage.setItem('presentCountTime', currentTime.toISOString());
      } else {
        const count = localStorage.getItem('presentCount');
        this.presentCount = count ? parseInt(count, 10) : 0;
      }
    } else {
      localStorage.setItem('presentCountTime', new Date().toISOString());
    }
  }

  async scan() {
    const result = await CapacitorBarcodeScanner.scanBarcode({
      hint: CapacitorBarcodeScannerTypeHint.ALL,
    });

    if (result && result.ScanResult) {
      await this.onQrCodeScanned(result.ScanResult);
    }
  }

  async onQrCodeScanned(qrCode: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando asistencia...',
    });
    await loading.present();

    if (qrCode === 'BaseDeDatos') {
      const currentDate = new Date().toLocaleDateString();

      const attendance: Attendance = {
        date: currentDate,
        course: 'Curso General',
        status: 'Presente',
        student: {
          name: 'Juan Pérez', // Simulado. Podrías obtenerlo dinámicamente
          email: 'juan.perez@example.com',
        },
      };

      let storedAttendances = localStorage.getItem('attendances');
      let attendances = storedAttendances ? JSON.parse(storedAttendances) : [];

      attendances.push(attendance);
      localStorage.setItem('attendances', JSON.stringify(attendances));

      this.presentCount++;
      localStorage.setItem('presentCount', this.presentCount.toString());

      this.message = `Asistencia registrada. Alumnos presentes: ${this.presentCount}`;
      await this.showToast(this.message);

      // Navegar a la página de registro de asistencias
      this.router.navigate(['/registro-asistencia']);
    } else {
      this.message = 'Código QR no válido';
      await this.showToast(this.message);
    }

    await loading.dismiss();
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
