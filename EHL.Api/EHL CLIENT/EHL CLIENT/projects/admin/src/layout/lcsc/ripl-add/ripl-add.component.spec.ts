import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiplAddComponent } from './ripl-add.component';

describe('RiplAddComponent', () => {
  let component: RiplAddComponent;
  let fixture: ComponentFixture<RiplAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiplAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiplAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
