import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelMainPageComponent } from './hotel-main-page.component';

describe('HotelMainPageComponent', () => {
  let component: HotelMainPageComponent;
  let fixture: ComponentFixture<HotelMainPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotelMainPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
