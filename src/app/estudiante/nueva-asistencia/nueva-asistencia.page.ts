import { Component } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';
import { LoadingController, ToastController } from '@ionic/angular';

interface User {
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
  users: User[] = JSON.parse(localStorage.getItem('users') || '[]'); // Cargar usuarios del local storage
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

    const userId = qrCode.replace('BaseDeDatos', '');
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.present = true;
      localStorage.setItem('users', JSON.stringify(this.users)); // Actualizar la lista de usuarios en el local storage
      this.message = `Asistencia registrada para: ${user.name} ${user.lastName}`;
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
