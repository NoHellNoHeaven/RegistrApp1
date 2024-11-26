import { Component } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { LoadingController, ToastController } from '@ionic/angular';

interface Student {
  id: string;
  name: string;
  lastName: string;
  email: string;
  present?: boolean; // Nueva propiedad para indicar asistencia
}

@Component({
  selector: 'app-nueva-asistencia',
  templateUrl: './nueva-asistencia.page.html',
  styleUrls: ['./nueva-asistencia.page.scss'],
})
export class NuevaAsistenciaPage {
  student: Student[] = JSON.parse(localStorage.getItem('students') || '[]'); // Cargar estudiantes del local storage
  message: string = '';

  constructor(private loadingCtrl: LoadingController, private toastCtrl: ToastController) {}

  async scan() {
    const result = await CapacitorBarcodeScanner.scanBarcode({hint: CapacitorBarcodeScannerTypeHint.ALL});
    if (result) {
      this.onQrCodeScanned(result.ScanResult);
    }
  }

  async onQrCodeScanned(qrCode: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando asistencia...'
    });
    loading.present();

    if (!qrCode.startsWith('BaseDeDatos')) {
      this.message = 'Código QR no válido';
      this.showToast(this.message);
      loading.dismiss();
      return;
    }

    const studentId = qrCode.replace('BaseDeDatos', '');
    const student = this.student.find(s => s.id === studentId);
    if (student) {
      student.present = true;
      localStorage.setItem('students', JSON.stringify(this.student)); // Actualizar la lista de estudiantes en el local storage
      this.message = `Asistencia registrada para: ${student.name} ${student.lastName}`;
      this.showToast(this.message);
    } else {
      this.message = 'Código QR no válido';
      this.showToast(this.message);
    }

    loading.dismiss();
  }

  async showToast(texto: string) {
    const toast = await this.toastCtrl.create({
      message: texto,
      duration: 3000,
      position: 'bottom',
      cssClass: 'rounded-toast'
    });
    await toast.present();
  }
}
