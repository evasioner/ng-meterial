import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalActivityTravelInsuComponent } from './my-modal-activity-travel-insu.component';

describe('MyModalActivityTravelInsuComponent', () => {
  let component: MyModalActivityTravelInsuComponent;
  let fixture: ComponentFixture<MyModalActivityTravelInsuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalActivityTravelInsuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalActivityTravelInsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
