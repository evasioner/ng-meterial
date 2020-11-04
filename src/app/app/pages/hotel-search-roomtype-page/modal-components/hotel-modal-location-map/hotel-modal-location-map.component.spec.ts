import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalLocationMapComponent } from './hotel-modal-location-map.component';

describe('HotelModalLocationMapComponent', () => {
  let component: HotelModalLocationMapComponent;
  let fixture: ComponentFixture<HotelModalLocationMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalLocationMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalLocationMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
