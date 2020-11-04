import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFaqComponent } from './all-faq.component';

describe('AllFaqComponent', () => {
  let component: AllFaqComponent;
  let fixture: ComponentFixture<AllFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllFaqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
