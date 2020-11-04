import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightSeatmapComponent } from './my-modal-flight-seatmap.component';

describe('MyModalFlightSeatmapComponent', () => {
  let component: MyModalFlightSeatmapComponent;
  let fixture: ComponentFixture<MyModalFlightSeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightSeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightSeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
