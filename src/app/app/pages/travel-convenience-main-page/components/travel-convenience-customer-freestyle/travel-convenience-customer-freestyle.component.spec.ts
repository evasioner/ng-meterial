import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceCustomerFreestyleComponent } from './travel-convenience-customer-freestyle.component';

describe('TravelConvenienceCustomerFreestyleComponent', () => {
  let component: TravelConvenienceCustomerFreestyleComponent;
  let fixture: ComponentFixture<TravelConvenienceCustomerFreestyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceCustomerFreestyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceCustomerFreestyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
