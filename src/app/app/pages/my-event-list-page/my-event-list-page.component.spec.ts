import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventListPageComponent } from './my-event-list-page.component';

describe('MyEventListPageComponent', () => {
  let component: MyEventListPageComponent;
  let fixture: ComponentFixture<MyEventListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEventListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEventListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
