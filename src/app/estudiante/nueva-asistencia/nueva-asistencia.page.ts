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

    // Supongamos que "BaseDeDatos" contiene información válida
    if (qrCode === 'BaseDeDatos') {
      const currentUser = localStorage.getItem('currentUser');
      const student = currentUser
        ? JSON.parse(currentUser)
        : { name: 'Desconocido', email: 'N/A' };

      const attendance: Attendance = {
        date: new Date().toLocaleDateString(),
        course: 'Curso General', // Ajusta según tu lógica de cursos
        status: 'Presente',
        student: {
          name: student.name,
          email: student.email,
        },
      };

      // Guardar la asistencia en localStorage
      let storedAttendances = localStorage.getItem('attendances');
      let attendances = storedAttendances ? JSON.parse(storedAttendances) : [];
      attendances.push(attendance);
      localStorage.setItem('attendances', JSON.stringify(attendances));

      this.presentCount++;
      localStorage.setItem('presentCount', this.presentCount.toString());

      this.message = `Asistencia registrada. Alumnos presentes: ${this.presentCount}`;
      await this.showToast(this.message);

      // Navegar de regreso al perfil del estudiante
      this.router.navigate(['/estudiante']);
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
