import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalSeatmapResultComponent } from './my-modal-seatmap-result.component';

describe('MyModalSeatmapResultComponent', () => {
  let component: MyModalSeatmapResultComponent;
  let fixture: ComponentFixture<MyModalSeatmapResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalSeatmapResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalSeatmapResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
