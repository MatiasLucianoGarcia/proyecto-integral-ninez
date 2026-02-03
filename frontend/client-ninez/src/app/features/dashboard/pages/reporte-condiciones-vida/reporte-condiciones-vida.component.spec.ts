import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCondicionesVidaComponent } from './reporte-condiciones-vida.component';

describe('ReporteCondicionesVidaComponent', () => {
  let component: ReporteCondicionesVidaComponent;
  let fixture: ComponentFixture<ReporteCondicionesVidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteCondicionesVidaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCondicionesVidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
