import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NuevaAsistenciaPage } from './nueva-asistencia.page';

describe('NuevaAsistenciaPage', () => {
  let component: NuevaAsistenciaPage;
  let fixture: ComponentFixture<NuevaAsistenciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaAsistenciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
