import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalRentConfirmationComponent } from './my-modal-rent-confirmation.component';

describe('MyModalRentConfirmationComponent', () => {
  let component: MyModalRentConfirmationComponent;
  let fixture: ComponentFixture<MyModalRentConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalRentConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalRentConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
