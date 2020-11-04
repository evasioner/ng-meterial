import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalMapFilterComponent } from './hotel-modal-map-filter.component';

describe('HotelModalMapFilterComponent', () => {
  let component: HotelModalMapFilterComponent;
  let fixture: ComponentFixture<HotelModalMapFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalMapFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalMapFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
