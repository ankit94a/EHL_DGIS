import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefectReportAddComponent } from './defect-report-add.component';

describe('DefectReportAddComponent', () => {
  let component: DefectReportAddComponent;
  let fixture: ComponentFixture<DefectReportAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefectReportAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DefectReportAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
