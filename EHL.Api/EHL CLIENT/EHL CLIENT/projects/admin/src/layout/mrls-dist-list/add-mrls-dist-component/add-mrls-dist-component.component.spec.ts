import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMrlsDistComponent } from './add-mrls-dist-component.component';

describe('AddMrlsDistComponent', () => {
  let component: AddMrlsDistComponent;
  let fixture: ComponentFixture<AddMrlsDistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMrlsDistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMrlsDistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
