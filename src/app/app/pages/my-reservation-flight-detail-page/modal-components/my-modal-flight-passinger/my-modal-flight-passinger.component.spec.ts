import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightPassingerComponent } from './my-modal-flight-passinger.component';

describe('MyModalFlightPassingerComponent', () => {
  let component: MyModalFlightPassingerComponent;
  let fixture: ComponentFixture<MyModalFlightPassingerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightPassingerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightPassingerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
