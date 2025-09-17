import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSmteSteDistrComponent } from './add-smte-ste-distr.component';

describe('AddSmteSteDistrComponent', () => {
  let component: AddSmteSteDistrComponent;
  let fixture: ComponentFixture<AddSmteSteDistrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSmteSteDistrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSmteSteDistrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
