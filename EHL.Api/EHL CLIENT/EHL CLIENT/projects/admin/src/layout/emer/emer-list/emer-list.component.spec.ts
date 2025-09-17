import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmerListComponent } from './emer-list.component';

describe('EmerListComponent', () => {
  let component: EmerListComponent;
  let fixture: ComponentFixture<EmerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
