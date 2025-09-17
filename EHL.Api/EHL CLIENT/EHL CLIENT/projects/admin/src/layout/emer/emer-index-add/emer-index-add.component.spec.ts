import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmerIndexAddComponent } from './emer-index-add.component';

describe('EmerIndexAddComponent', () => {
  let component: EmerIndexAddComponent;
  let fixture: ComponentFixture<EmerIndexAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmerIndexAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmerIndexAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
