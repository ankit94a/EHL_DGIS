import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsplComponent } from './ispl.component';

describe('IsplComponent', () => {
  let component: IsplComponent;
  let fixture: ComponentFixture<IsplComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsplComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsplComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
