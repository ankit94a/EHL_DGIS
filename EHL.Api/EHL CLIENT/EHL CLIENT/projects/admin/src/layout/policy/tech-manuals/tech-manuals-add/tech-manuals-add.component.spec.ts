import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechManualsAddComponent } from './tech-manuals-add.component';

describe('TechManualsAddComponent', () => {
  let component: TechManualsAddComponent;
  let fixture: ComponentFixture<TechManualsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechManualsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechManualsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
