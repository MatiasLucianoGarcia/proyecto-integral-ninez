import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestedPersonCardComponent } from './suggested-person-card.component';

describe('SuggestedPersonCardComponent', () => {
  let component: SuggestedPersonCardComponent;
  let fixture: ComponentFixture<SuggestedPersonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuggestedPersonCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuggestedPersonCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
