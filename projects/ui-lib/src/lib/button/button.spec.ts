import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiButtonComponent } from './button';

describe('UiButtonComponent', () => {
  let component: UiButtonComponent;
  let fixture: ComponentFixture<UiButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiButtonComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Click me');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
