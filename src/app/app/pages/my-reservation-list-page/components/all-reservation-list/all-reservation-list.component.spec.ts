import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllReservationListComponent } from './all-reservation-list.component';

describe('AllReservationListComponent', () => {
  let component: AllReservationListComponent;
  let fixture: ComponentFixture<AllReservationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllReservationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllReservationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
