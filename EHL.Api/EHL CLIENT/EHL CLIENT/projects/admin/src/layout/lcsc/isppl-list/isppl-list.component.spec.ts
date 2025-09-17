import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IspplListComponent } from './isppl-list.component';

describe('IspplListComponent', () => {
  let component: IspplListComponent;
  let fixture: ComponentFixture<IspplListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IspplListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IspplListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
