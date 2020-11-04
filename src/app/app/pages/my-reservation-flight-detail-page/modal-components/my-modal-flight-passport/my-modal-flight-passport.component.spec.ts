import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightPassportComponent } from './my-modal-flight-passport.component';

describe('MyModalFlightPassportComponent', () => {
  let component: MyModalFlightPassportComponent;
  let fixture: ComponentFixture<MyModalFlightPassportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightPassportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightPassportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
