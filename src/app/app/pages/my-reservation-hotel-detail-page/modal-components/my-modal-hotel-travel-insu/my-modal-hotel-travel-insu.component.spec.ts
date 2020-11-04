import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalHotelTravelInsuComponent } from './my-modal-hotel-travel-insu.component';

describe('MyModalHotelTravelInsuComponent', () => {
  let component: MyModalHotelTravelInsuComponent;
  let fixture: ComponentFixture<MyModalHotelTravelInsuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalHotelTravelInsuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalHotelTravelInsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
