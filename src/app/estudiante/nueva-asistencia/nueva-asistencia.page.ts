import { Component } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerTypeHint } from '@capacitor/barcode-scanner';

@Component({
  selector: 'app-nueva-asistencia',
  templateUrl: './nueva-asistencia.page.html',
  styleUrls: ['./nueva-asistencia.page.scss'],
})
export class NuevaAsistenciaPage {
  toast: any;
  async scan(){
    CapacitorBarcodeScanner.scanBarcode({hint: CapacitorBarcodeScannerTypeHint.ALL})
    .then((data)=>{
      this.showToast(data.ScanResult)
    
    })
  }

  async showToast(texto: string) {
    const toast = await this.toast.create({
      message: texto,
      duration: 3000,
      positionAnchor: 'footer2',
      cssClass: 'rounded-toast'
    });
    await toast.present();
  }
  
}