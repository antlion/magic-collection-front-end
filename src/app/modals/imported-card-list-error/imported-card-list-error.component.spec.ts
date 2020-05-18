import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportedCardListErrorComponent } from './imported-card-list-error.component';

describe('ImportedCardListErrorComponent', () => {
  let component: ImportedCardListErrorComponent;
  let fixture: ComponentFixture<ImportedCardListErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportedCardListErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportedCardListErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
