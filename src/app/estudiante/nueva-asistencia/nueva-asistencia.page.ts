import { Component } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { LoadingController } from '@ionic/angular';

interface Student {
  id: string;
  name: string;
  email: string;
  present?: boolean; // Nueva propiedad para indicar asistencia
}

@Component({
  selector: 'app-nueva-asistencia',
  templateUrl: './nueva-asistencia.page.html',
  styleUrls: ['./nueva-asistencia.page.scss'],
})
export class NuevaAsistenciaPage {
  students: Student[] = JSON.parse(localStorage.getItem('students') || '[]'); // Cargar estudiantes del local storage
  message: string = '';
  toast: any;

  constructor(private loadingCtrl: LoadingController) {}

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

    const student = this.students.find(s => s.id === qrCode);
    if (student) {
      student.present = true;
      localStorage.setItem('students', JSON.stringify(this.students)); // Actualizar la lista de estudiantes en el local storage
      this.message = `Asistencia registrada para: ${student.name}`;
      this.showToast(this.message);
    } else {
      this.message = 'Código QR no válido';
      this.showToast(this.message);
    }

    loading.dismiss();
  }

  async showToast(texto: string) {
    const toast = await this.toast.create({
      message: texto,
      duration: 3000,
      position: 'bottom',
      cssClass: 'rounded-toast'
    });
    await toast.present();
  }
}
