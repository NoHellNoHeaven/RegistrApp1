import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NuevaAsistenciaPage } from './nueva-asistencia.page';

const routes: Routes = [
  {
    path: '',
    component: NuevaAsistenciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NuevaAsistenciaPageRoutingModule {}
