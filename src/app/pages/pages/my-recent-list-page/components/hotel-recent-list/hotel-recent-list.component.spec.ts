import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelRecentListComponent } from './hotel-recent-list.component';

describe('HotelRecentListComponent', () => {
  let component: HotelRecentListComponent;
  let fixture: ComponentFixture<HotelRecentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelRecentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelRecentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
