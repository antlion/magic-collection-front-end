import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowImageCardComponent } from './show-image-card.component';

describe('ShowImageCardComponent', () => {
  let component: ShowImageCardComponent;
  let fixture: ComponentFixture<ShowImageCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowImageCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowImageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
