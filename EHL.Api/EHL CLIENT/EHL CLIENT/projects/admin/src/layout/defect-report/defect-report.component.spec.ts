import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectReportComponent } from './defect-report.component';

describe('DefectReportComponent', () => {
  let component: DefectReportComponent;
  let fixture: ComponentFixture<DefectReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefectReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefectReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
