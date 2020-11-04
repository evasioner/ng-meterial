import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalSeatmapComponent } from './my-modal-seatmap.component';

describe('MyModalSeatmapComponent', () => {
  let component: MyModalSeatmapComponent;
  let fixture: ComponentFixture<MyModalSeatmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalSeatmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalSeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
