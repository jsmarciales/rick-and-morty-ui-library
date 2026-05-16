import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiTableComponent } from './table';

describe('UiTableComponent', () => {
  let component: UiTableComponent;
  let fixture: ComponentFixture<UiTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiTableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UiTableComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', []);
    fixture.componentRef.setInput('rows', []);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
