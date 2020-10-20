import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightQnaComponent } from './flight-qna.component';

describe('FlightQnaComponent', () => {
  let component: FlightQnaComponent;
  let fixture: ComponentFixture<FlightQnaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightQnaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightQnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
