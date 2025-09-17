import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmerAddComponent } from './emer-add.component';

describe('EmerAddComponent', () => {
  let component: EmerAddComponent;
  let fixture: ComponentFixture<EmerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmerAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
