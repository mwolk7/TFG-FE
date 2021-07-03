import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectWithShortcutComponent } from './select-with-shortcut.component';

describe('SelectWithShortcutComponent', () => {
  let component: SelectWithShortcutComponent;
  let fixture: ComponentFixture<SelectWithShortcutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectWithShortcutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectWithShortcutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
