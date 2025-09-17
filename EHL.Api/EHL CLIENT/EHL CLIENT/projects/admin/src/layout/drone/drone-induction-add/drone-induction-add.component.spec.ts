import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneInductionAddComponent } from './drone-induction-add.component';

describe('DroneInductionAddComponent', () => {
  let component: DroneInductionAddComponent;
  let fixture: ComponentFixture<DroneInductionAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DroneInductionAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroneInductionAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
