import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlumnosDocentePage } from './alumnos-docente.page';

describe('AlumnosDocentePage', () => {
  let component: AlumnosDocentePage;
  let fixture: ComponentFixture<AlumnosDocentePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnosDocentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
