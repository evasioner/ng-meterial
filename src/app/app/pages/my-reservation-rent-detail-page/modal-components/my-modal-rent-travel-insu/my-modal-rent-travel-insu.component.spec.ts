import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalRentTravelInsuComponent } from './my-modal-rent-travel-insu.component';

describe('MyModalRentTravelInsuComponent', () => {
  let component: MyModalRentTravelInsuComponent;
  let fixture: ComponentFixture<MyModalRentTravelInsuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalRentTravelInsuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalRentTravelInsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
