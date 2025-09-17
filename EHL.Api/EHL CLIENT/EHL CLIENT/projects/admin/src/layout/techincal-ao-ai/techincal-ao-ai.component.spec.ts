import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechincalAoAiComponent } from './techincal-ao-ai.component';

describe('TechincalAoAiComponent', () => {
  let component: TechincalAoAiComponent;
  let fixture: ComponentFixture<TechincalAoAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechincalAoAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechincalAoAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
