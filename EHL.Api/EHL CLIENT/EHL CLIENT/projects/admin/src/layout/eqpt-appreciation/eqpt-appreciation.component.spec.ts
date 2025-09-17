import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EqptAppreciationComponent } from './eqpt-appreciation.component';

describe('EqptAppreciationComponent', () => {
  let component: EqptAppreciationComponent;
  let fixture: ComponentFixture<EqptAppreciationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EqptAppreciationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EqptAppreciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
