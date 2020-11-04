import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelConvenienceSellerComponent } from './travel-convenience-seller.component';

describe('TravelConvenienceSellerComponent', () => {
  let component: TravelConvenienceSellerComponent;
  let fixture: ComponentFixture<TravelConvenienceSellerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelConvenienceSellerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelConvenienceSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
