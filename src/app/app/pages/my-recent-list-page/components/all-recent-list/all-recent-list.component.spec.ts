import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRecentListComponent } from './all-recent-list.component';

describe('AllRecentListComponent', () => {
  let component: AllRecentListComponent;
  let fixture: ComponentFixture<AllRecentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRecentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllRecentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
