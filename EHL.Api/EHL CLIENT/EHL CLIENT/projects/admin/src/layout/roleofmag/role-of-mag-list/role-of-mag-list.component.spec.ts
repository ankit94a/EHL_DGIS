import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleOfMagListComponent } from './role-of-mag-list.component';

describe('RoleOfMagListComponent', () => {
  let component: RoleOfMagListComponent;
  let fixture: ComponentFixture<RoleOfMagListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleOfMagListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleOfMagListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
