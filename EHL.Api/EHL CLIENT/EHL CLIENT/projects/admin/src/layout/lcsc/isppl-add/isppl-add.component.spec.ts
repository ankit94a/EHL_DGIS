import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IspplAddComponent } from './isppl-add.component';

describe('IspplAddComponent', () => {
  let component: IspplAddComponent;
  let fixture: ComponentFixture<IspplAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IspplAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IspplAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
