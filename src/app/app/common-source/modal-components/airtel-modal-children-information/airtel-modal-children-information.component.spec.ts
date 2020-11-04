import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirtelModalChildrenInformationComponent } from './airtel-modal-children-information.component';

describe('AirtelModalChildrenInformationComponent', () => {
  let component: AirtelModalChildrenInformationComponent;
  let fixture: ComponentFixture<AirtelModalChildrenInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirtelModalChildrenInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirtelModalChildrenInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
