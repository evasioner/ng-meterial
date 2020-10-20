import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFaqListPageComponent } from './my-faq-list-page.component';

describe('MyFaqListPageComponent', () => {
  let component: MyFaqListPageComponent;
  let fixture: ComponentFixture<MyFaqListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFaqListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFaqListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
