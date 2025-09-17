import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsplAddComponent } from './ispl-add.component';

describe('IsplAddComponent', () => {
  let component: IsplAddComponent;
  let fixture: ComponentFixture<IsplAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsplAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsplAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
