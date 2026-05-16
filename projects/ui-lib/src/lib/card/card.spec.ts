import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCardComponent } from './card';

describe('UiCardComponent', () => {
  let component: UiCardComponent;
  let fixture: ComponentFixture<UiCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test card');
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
