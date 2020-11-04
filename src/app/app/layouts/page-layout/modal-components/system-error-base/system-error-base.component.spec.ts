import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemErrorBaseComponent } from './system-error-base.component';

describe('SystemErrorBaseComponent', () => {
  let component: SystemErrorBaseComponent;
  let fixture: ComponentFixture<SystemErrorBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemErrorBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemErrorBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
