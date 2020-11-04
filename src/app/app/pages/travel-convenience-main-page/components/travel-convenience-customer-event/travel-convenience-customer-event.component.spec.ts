import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceCustomerEventComponent } from './travel-convenience-customer-event.component';

describe('TravelConvenienceCustomerEventComponent', () => {
  let component: TravelConvenienceCustomerEventComponent;
  let fixture: ComponentFixture<TravelConvenienceCustomerEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceCustomerEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceCustomerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
