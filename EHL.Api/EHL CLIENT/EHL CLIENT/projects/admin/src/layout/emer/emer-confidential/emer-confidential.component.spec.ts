import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmerConfidentialComponent } from './emer-confidential.component';

describe('EmerConfidentialComponent', () => {
  let component: EmerConfidentialComponent;
  let fixture: ComponentFixture<EmerConfidentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmerConfidentialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmerConfidentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
