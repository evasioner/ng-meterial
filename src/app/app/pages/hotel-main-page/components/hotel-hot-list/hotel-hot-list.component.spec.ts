import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelHotListComponent } from './hotel-hot-list.component';

describe('HotelHotListComponent', () => {
  let component: HotelHotListComponent;
  let fixture: ComponentFixture<HotelHotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelHotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelHotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
