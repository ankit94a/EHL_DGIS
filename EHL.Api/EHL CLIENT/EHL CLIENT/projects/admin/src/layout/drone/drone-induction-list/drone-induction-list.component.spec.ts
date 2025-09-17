import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DroneInductionListComponent } from './drone-induction-list.component';

describe('DroneInductionListComponent', () => {
  let component: DroneInductionListComponent;
  let fixture: ComponentFixture<DroneInductionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DroneInductionListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DroneInductionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
