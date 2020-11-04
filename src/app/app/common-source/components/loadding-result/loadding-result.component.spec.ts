import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaddingResultComponent } from './loadding-result.component';

describe('LoaddingResultComponent', () => {
  let component: LoaddingResultComponent;
  let fixture: ComponentFixture<LoaddingResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoaddingResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaddingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
