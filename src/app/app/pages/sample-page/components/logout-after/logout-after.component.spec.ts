import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutAfterComponent } from './logout-after.component';

describe('LogoutAfterComponent', () => {
  let component: LogoutAfterComponent;
  let fixture: ComponentFixture<LogoutAfterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutAfterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
