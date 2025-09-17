import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpContractListComponent } from './ep-contract-list.component';

describe('EpContractListComponent', () => {
  let component: EpContractListComponent;
  let fixture: ComponentFixture<EpContractListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpContractListComponent]
    })
    .compileComponents();
    fixture = TestBed.createComponent(EpContractListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
