import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpContractAddComponent } from './ep-contract-add.component';

describe('EpContractAddComponent', () => {
  let component: EpContractAddComponent;
  let fixture: ComponentFixture<EpContractAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpContractAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpContractAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
