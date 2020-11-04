import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightModalChildrenInformaionComponent } from './flight-modal-children-informaion.component';

describe('FlightModalChildrenInformaionComponent', () => {
  let component: FlightModalChildrenInformaionComponent;
  let fixture: ComponentFixture<FlightModalChildrenInformaionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightModalChildrenInformaionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightModalChildrenInformaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
