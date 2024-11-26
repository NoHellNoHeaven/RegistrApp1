import { Component } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-nueva-asistencia',
  templateUrl: './nueva-asistencia.page.html',
  styleUrls: ['./nueva-asistencia.page.scss'],
})
export class NuevaAsistenciaPage {
  presentCount: number = 0; // Contador de alumnos presentes
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

    if (qrCode.startsWith('BaseDeDatos')) {
      this.presentCount++; // Incrementar el contador de alumnos presentes
      localStorage.setItem('presentCount', this.presentCount.toString()); // Guardar el contador en el local storage
      this.message = `Asistencia registrada. Alumnos presentes: ${this.presentCount}`;
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
