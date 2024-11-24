import { Component } from '@angular/core';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nueva-asistencia',
  templateUrl: './nueva-asistencia.page.html',
  styleUrls: ['./nueva-asistencia.page.scss'],
})
export class NuevaAsistenciaPage {
  constructor(private platform: Platform, private router: Router) {}

  async scanQRCode() {
    if (this.platform.is('capacitor')) {
      const status = await CapacitorBarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        await CapacitorBarcodeScanner.hideBackground(); // Oculta la vista web para una mejor experiencia de escaneo

        const result = await CapacitorBarcodeScanner.startScan(); // Inicia el escaneo

        if (result.hasContent) {
          console.log('Código QR escaneado:', result.content);
          // Aquí puedes agregar la lógica para registrar la asistencia
        } else {
          console.log('No se encontró contenido en el código QR');
        }

        await CapacitorBarcodeScanner.showBackground(); // Muestra la vista web nuevamente
      } else {
        console.log('Permiso de cámara no concedido');
      }
    } else {
      console.log('El escaneo de códigos QR solo está disponible en dispositivos móviles');
    }
  }
}
