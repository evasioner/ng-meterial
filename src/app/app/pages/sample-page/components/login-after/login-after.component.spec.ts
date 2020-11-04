import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAfterComponent } from './login-after.component';

describe('LoginAfterComponent', () => {
  let component: LoginAfterComponent;
  let fixture: ComponentFixture<LoginAfterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginAfterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginAfterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
