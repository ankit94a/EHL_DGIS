import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleOfMagAddComponent } from './role-of-mag-add.component';

describe('RoleOfMagAddComponent', () => {
  let component: RoleOfMagAddComponent;
  let fixture: ComponentFixture<RoleOfMagAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleOfMagAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleOfMagAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
