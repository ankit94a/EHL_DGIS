import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingListComponent } from './wing-list.component';

describe('WingListComponent', () => {
  let component: WingListComponent;
  let fixture: ComponentFixture<WingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
