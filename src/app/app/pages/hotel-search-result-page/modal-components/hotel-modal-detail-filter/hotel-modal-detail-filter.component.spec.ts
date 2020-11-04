import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelModalDetailFilterComponent } from './hotel-modal-detail-filter.component';

describe('HotelModalDetailFilterComponent', () => {
  let component: HotelModalDetailFilterComponent;
  let fixture: ComponentFixture<HotelModalDetailFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelModalDetailFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelModalDetailFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
