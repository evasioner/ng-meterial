import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightBagDropComponent } from './my-modal-flight-bag-drop.component';

describe('MyModalFlightBagDropComponent', () => {
  let component: MyModalFlightBagDropComponent;
  let fixture: ComponentFixture<MyModalFlightBagDropComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightBagDropComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightBagDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
