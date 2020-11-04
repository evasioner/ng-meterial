import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightEticketComponent } from './my-modal-flight-eticket.component';

describe('MyModalFlightEticketComponent', () => {
  let component: MyModalFlightEticketComponent;
  let fixture: ComponentFixture<MyModalFlightEticketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightEticketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightEticketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
