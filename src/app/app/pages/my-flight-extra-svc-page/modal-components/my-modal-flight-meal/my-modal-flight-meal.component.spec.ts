import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightMealComponent } from './my-modal-flight-meal.component';

describe('MyModalFlightMealComponent', () => {
  let component: MyModalFlightMealComponent;
  let fixture: ComponentFixture<MyModalFlightMealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightMealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightMealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
