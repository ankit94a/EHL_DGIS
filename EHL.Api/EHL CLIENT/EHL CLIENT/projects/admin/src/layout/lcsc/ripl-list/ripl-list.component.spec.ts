import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiplListComponent } from './ripl-list.component';

describe('RiplListComponent', () => {
  let component: RiplListComponent;
  let fixture: ComponentFixture<RiplListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiplListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiplListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
