import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqptComponent } from './eqpt.component';

describe('EqptComponent', () => {
  let component: EqptComponent;
  let fixture: ComponentFixture<EqptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EqptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EqptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
