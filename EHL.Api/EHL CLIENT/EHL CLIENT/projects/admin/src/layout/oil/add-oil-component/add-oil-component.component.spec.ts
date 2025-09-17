import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOilComponentComponent } from './add-oil-component.component';

describe('AddOilComponentComponent', () => {
  let component: AddOilComponentComponent;
  let fixture: ComponentFixture<AddOilComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOilComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOilComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
