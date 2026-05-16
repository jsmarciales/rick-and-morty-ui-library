import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiSelectComponent } from './select';

describe('UiSelectComponent', () => {
  let component: UiSelectComponent;
  let fixture: ComponentFixture<UiSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiSelectComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('options', []);
    fixture.componentRef.setInput('label', 'Test');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
