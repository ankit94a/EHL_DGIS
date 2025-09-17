import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MrlsDistComponent } from './mrls-dist.component';

describe('MrlsDistComponent', () => {
  let component: MrlsDistComponent;
  let fixture: ComponentFixture<MrlsDistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MrlsDistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MrlsDistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
