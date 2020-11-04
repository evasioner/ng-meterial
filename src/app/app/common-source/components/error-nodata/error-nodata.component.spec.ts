import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorNodataComponent } from './error-nodata.component';

describe('ErrorNodataComponent', () => {
  let component: ErrorNodataComponent;
  let fixture: ComponentFixture<ErrorNodataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorNodataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorNodataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
