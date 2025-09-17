import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmerIndexComponent } from './emer-index.component';

describe('EmerIndexComponent', () => {
  let component: EmerIndexComponent;
  let fixture: ComponentFixture<EmerIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmerIndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmerIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
