import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmteSteDistrComponent } from './smte-ste-distr.component';

describe('SmteSteDistrComponent', () => {
  let component: SmteSteDistrComponent;
  let fixture: ComponentFixture<SmteSteDistrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmteSteDistrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmteSteDistrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
