import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NuevaAsistenciaPageRoutingModule } from './nueva-asistencia-routing.module';

import { NuevaAsistenciaPage } from './nueva-asistencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NuevaAsistenciaPageRoutingModule
  ],
  declarations: [NuevaAsistenciaPage]
})
export class NuevaAsistenciaPageModule {}
