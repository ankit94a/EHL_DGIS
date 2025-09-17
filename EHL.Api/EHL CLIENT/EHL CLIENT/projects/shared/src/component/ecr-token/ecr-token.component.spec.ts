import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcrTokenComponent } from './ecr-token.component';

describe('EcrTokenComponent', () => {
  let component: EcrTokenComponent;
  let fixture: ComponentFixture<EcrTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcrTokenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcrTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
