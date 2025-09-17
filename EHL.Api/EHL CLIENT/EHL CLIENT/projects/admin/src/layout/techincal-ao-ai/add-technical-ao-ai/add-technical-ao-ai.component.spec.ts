import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechnicalAoAiComponent } from './add-technical-ao-ai.component';

describe('AddTechnicalAoAiComponent', () => {
  let component: AddTechnicalAoAiComponent;
  let fixture: ComponentFixture<AddTechnicalAoAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTechnicalAoAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTechnicalAoAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
