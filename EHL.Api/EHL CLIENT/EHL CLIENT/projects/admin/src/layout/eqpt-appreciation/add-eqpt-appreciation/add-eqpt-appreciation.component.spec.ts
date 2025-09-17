import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEqptAppreciationComponent } from './add-eqpt-appreciation.component';

describe('AddEqptAppreciationComponent', () => {
  let component: AddEqptAppreciationComponent;
  let fixture: ComponentFixture<AddEqptAppreciationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEqptAppreciationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEqptAppreciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
