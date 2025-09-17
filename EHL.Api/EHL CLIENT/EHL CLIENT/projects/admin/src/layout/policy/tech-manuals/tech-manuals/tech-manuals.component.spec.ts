import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechManualsComponent } from './tech-manuals.component';

describe('TechManualsComponent', () => {
  let component: TechManualsComponent;
  let fixture: ComponentFixture<TechManualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechManualsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechManualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
