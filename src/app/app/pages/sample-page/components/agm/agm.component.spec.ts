import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgmComponent } from './agm.component';

describe('AgmComponent', () => {
  let component: AgmComponent;
  let fixture: ComponentFixture<AgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
