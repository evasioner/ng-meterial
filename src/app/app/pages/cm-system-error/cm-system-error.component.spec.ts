import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmSystemErrorComponent } from './cm-system-error.component';

describe('CmSystemErrorComponent', () => {
  let component: CmSystemErrorComponent;
  let fixture: ComponentFixture<CmSystemErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmSystemErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmSystemErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
