import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentBookedDetailPageComponent } from './rent-booked-detail-page.component';

describe('RentBookedDetailPageComponent', () => {
  let component: RentBookedDetailPageComponent;
  let fixture: ComponentFixture<RentBookedDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentBookedDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentBookedDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
