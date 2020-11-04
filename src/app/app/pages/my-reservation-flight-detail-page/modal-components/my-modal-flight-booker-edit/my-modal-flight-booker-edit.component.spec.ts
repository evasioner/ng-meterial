import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightBookerEditComponent } from './my-modal-flight-booker-edit.component';

describe('MyModalFlightBookerEditComponent', () => {
  let component: MyModalFlightBookerEditComponent;
  let fixture: ComponentFixture<MyModalFlightBookerEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightBookerEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightBookerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
