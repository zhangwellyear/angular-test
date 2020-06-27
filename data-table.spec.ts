import { By } from '@angular/platform-browser';
import { SelectModule } from './../select/select.module';
import { InputNumberModule } from './../input-number/input-number.module';
import { DatepickerModule } from './../datepicker/datepicker.module';
import { I18nModule } from './../i18n/i18n.module';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from './data-table.component';
import { DataTableModule } from './data-table.module';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { SourceType, originSource, genderSource, editableOriginSource } from './demo/mock-data';
import { Component, DebugElement, ViewChild } from '@angular/core';

@Component({
  template: `
    <d-data-table [dataSource]="basicDataSource" [scrollable]="true" [type]="'striped'" [checkable]="checkable">
      <d-column field="$index" header="#" [width]="'50px'"></d-column>
      <d-column
        *ngFor="let colOption of dataTableOptions.columns"
        [field]="colOption.field"
        [header]="colOption.header"
        [fieldType]="colOption.fieldType"
        [width]="'150px'"
      >
      </d-column>
    </d-data-table>
  `
})
class TestDataTableComponent {
  basicDataSource: Array<SourceType> = JSON.parse(JSON.stringify(originSource.slice(0, 6)));
  dataTableOptions = {
    columns: [
      {
        field: 'firstName',
        header: 'First Name',
        fieldType: 'text'
      },
      {
        field: 'lastName',
        header: 'Last Name',
        fieldType: 'text'
      },
      {
        field: 'gender',
        header: 'gender',
        fieldType: 'text'
      },
      {
        field: 'dob',
        header: 'Date of birth',
        fieldType: 'date'
      }
    ]
  };
  checkable = false;
}

@Component({
  template: `
    <d-data-table #dataTable [dataSource]="basicDataSource" (cellEditEnd)="thisCellEditEnd($event)" [scrollable]="true">
      <d-column field="lastName" header="Last Name" [width]="'100px'" [editable]="true">
        <d-cell-edit>
          <ng-template let-rowItem="rowItem" let-column="column">
            <div class="customized-editor edit-padding-fix">
              <input class="devui-form-control" [(ngModel)]="rowItem[column.field]" maxlength="5" />
            </div>
          </ng-template>
        </d-cell-edit>
      </d-column>
      <d-column field="dob" header="Date of birth" [editable]="true" [width]="'150px'">
        <d-cell>
          <ng-template let-cellItem="cellItem">
            {{ cellItem | i18nDate: 'full':false }}
          </ng-template>
        </d-cell>
        <d-cell-edit>
          <ng-template let-rowItem="rowItem" let-column="column">
            <form class="form-inline edit-padding-fix">
              <div class="devui-form-group">
                <div class="devui-input-group">
                  <input
                    class="devui-form-control search"
                    [name]="column.field"
                    [(ngModel)]="rowItem[column.field]"
                    dDatepicker
                    appendToBody
                    [dateFormat]="YYYY / MM / DD"
                    #datePicker="datepicker"
                    [showTime]="true"
                    [autoOpen]="true"
                  />
                  <div class="devui-input-group-addon" (click)="datePicker.toggle($event, true)">
                    <i class="icon icon-calendar"></i>
                  </div>
                </div>
              </div>
            </form>
          </ng-template>
        </d-cell-edit>
      </d-column>
      <d-column field="age" header="Age" [width]="'100px'" [editable]="true">
        <d-cell-edit>
          <ng-template let-rowItem="rowItem" let-column="column">
            <div class="customized-editor edit-padding-fix">
              <d-input-number [(ngModel)]="rowItem[column.field]" class="input-number"></d-input-number>
            </div>
          </ng-template>
        </d-cell-edit>
      </d-column>
      <d-column field="gender" header="Gender" [width]="'100px'" [editable]="true">
        <d-cell>
          <ng-template let-cellItem="cellItem">
            {{ cellItem.label }}
          </ng-template>
        </d-cell>
        <d-cell-edit>
          <ng-template let-rowItem="rowItem" let-column="column">
            <div class="customized-editor edit-padding-fix">
              <d-select
                [options]="genderSource"
                isSearch="true"
                [filterKey]="'label'"
                autoFocus="true"
                toggleOnFocus="true"
                [(ngModel)]="rowItem[column.field]"
                (ngModelChange)="finishEdit()"
              >
                <ng-template let-option="option" let-filterKey="filterKey"> gender:{{ option[filterKey] }} </ng-template>
              </d-select>
            </div>
          </ng-template>
        </d-cell-edit>
      </d-column>
    </d-data-table>
  `
})
class TestDataTableEditComponent {
  @ViewChild(DataTableComponent, { static: true }) dataTable: DataTableComponent;
  genderSource = genderSource;
  basicDataSource: Array<SourceType> = JSON.parse(JSON.stringify(editableOriginSource.slice(0, 6)));

  thisCellEditEnd = jasmine.createSpy('cell edit end');

  finishEdit() {
    this.dataTable.cancelEditingStatus();
  }
}

describe('data-table', () => {
  describe('basic', () => {
    let fixture: ComponentFixture<TestDataTableComponent>;
    let debugEl: DebugElement;
    let component: TestDataTableComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DataTableModule],
        declarations: [TestDataTableComponent]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDataTableComponent);
      debugEl = fixture.debugElement;
      component = fixture.componentInstance;
    });

    it('should create correctly', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('edit', () => {
    let fixture: ComponentFixture<TestDataTableEditComponent>;
    let debugEl: DebugElement;
    let component: TestDataTableEditComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule, DataTableModule, I18nModule, DatepickerModule, InputNumberModule, SelectModule],
        declarations: [TestDataTableEditComponent]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDataTableEditComponent);
      debugEl = fixture.debugElement;
      component = fixture.componentInstance;
    });

    it('should edit input display', fakeAsync(() => {
        fixture.detectChanges();
        const lastNameEditEl = debugEl.query(By.css('.devui-table tbody tr .cell-editable')).nativeElement;
        lastNameEditEl.dispatchEvent(new Event('click'));
        fixture.detectChanges();
        tick();
        fixture.detectChanges();

        const inputEl = debugEl.query(By.css('.customized-editor.edit-padding-fix'));
        expect(inputEl).toBeTruthy();
    }));
  });
});
