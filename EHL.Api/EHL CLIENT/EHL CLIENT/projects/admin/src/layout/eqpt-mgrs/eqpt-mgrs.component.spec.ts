import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqptMgrsComponent } from './eqpt-mgrs.component';

describe('EqptMgrsComponent', () => {
  let component: EqptMgrsComponent;
  let fixture: ComponentFixture<EqptMgrsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EqptMgrsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EqptMgrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
