import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

export class DomHelper<T> {
  debugEl: DebugElement;
  constructor(fixture: ComponentFixture<T>) {
    this.debugEl = fixture.debugElement;
  }

  judgeClasses(classList) {
    for (let i = 0; i < classList.length; i++) {
      if (!this.debugEl.query(By.css(classList[i]))) {
        return false;
      }
    }

    return true;
  }
}
