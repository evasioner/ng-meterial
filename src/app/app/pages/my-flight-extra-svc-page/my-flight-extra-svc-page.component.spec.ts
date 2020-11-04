import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFlightExtraSvcPageComponent } from './my-flight-extra-svc-page.component';

describe('MyFlightExtraSvcPageComponent', () => {
  let component: MyFlightExtraSvcPageComponent;
  let fixture: ComponentFixture<MyFlightExtraSvcPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFlightExtraSvcPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFlightExtraSvcPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
