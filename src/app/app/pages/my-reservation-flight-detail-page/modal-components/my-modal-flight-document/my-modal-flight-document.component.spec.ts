import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyModalFlightDocumentComponent } from './my-modal-flight-document.component';

describe('MyModalFlightDocumentComponent', () => {
  let component: MyModalFlightDocumentComponent;
  let fixture: ComponentFixture<MyModalFlightDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyModalFlightDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyModalFlightDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
