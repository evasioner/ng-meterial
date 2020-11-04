import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalAlignFilterComponent } from './hotel-modal-align-filter.component';

describe('HotelModalAlignFilterComponent', () => {
  let component: HotelModalAlignFilterComponent;
  let fixture: ComponentFixture<HotelModalAlignFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalAlignFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalAlignFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
