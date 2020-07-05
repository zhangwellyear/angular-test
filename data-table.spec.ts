import { LoadingType } from './../loading/loading.types';
import { DataTableModule } from 'ng-devui/data-table';
import { createMouseEvent } from 'ng-devui/utils/testing/event-helper';
import { By } from '@angular/platform-browser';
import { SelectModule } from './../select/select.module';
import { InputNumberModule } from './../input-number/input-number.module';
import { DatepickerModule } from './../datepicker/datepicker.module';
import { I18nModule } from './../i18n/i18n.module';
import { FormsModule } from '@angular/forms';
import { DataTableComponent } from './data-table.component';
import { ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { SourceType, originSource, genderSource, editableOriginSource } from './demo/mock-data';
import { Component, DebugElement, ViewChild } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const dataTableOptions = {
  columns: [
    {
      field: 'firstName',
      header: 'First Name',
      fieldType: 'text',
      sortable: true
    },
    {
      field: 'lastName',
      header: 'Last Name',
      fieldType: 'text',
      sortable: true
    },
    {
      field: 'gender',
      header: 'gender',
      fieldType: 'text',
      sortable: true
    },
    {
      field: 'dob',
      header: 'Date of birth',
      fieldType: 'date',
      sortable: true
    }
  ]
};

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

@Component({
  template: `
    <d-data-table
      #datatable1
      [dataSource]="maxHeightDataSource"
      fixHeader="true"
      maxHeight="400px"
      [scrollable]="true"
      [resizeable]="resizable"
    >
      <d-column field="$index" header="#" [width]="'100px'"></d-column>
      <d-column
        *ngFor="let colOption of dataTableOptions.columns"
        [field]="colOption.field"
        [header]="colOption.header"
        [sortable]="colOption.sortable"
        [fieldType]="colOption.fieldType"
        [width]="'150px'"
      >
      </d-column>
    </d-data-table>
  `
})
class TestDataTableFixHeaderComponent {
  resizable = false;
  dataTableOptions = dataTableOptions;
  maxHeightDataSource: Array<SourceType> = JSON.parse(JSON.stringify(originSource.slice()));
}

@Component({
  template: `
    <d-data-table
      #datatable
      [dataSource]="basicDataSource"
      [fixHeader]="isHeaderFixed"
      colDraggable="true"
      maxHeight="400px"
      [scrollable]="true"
    >
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
class TestDataTableColumnDragComponent {
  isHeaderFixed = false;
  dataTableOptions = dataTableOptions;
  basicDataSource: Array<SourceType> = JSON.parse(JSON.stringify(originSource.slice()));
}

@Component({
  template: `
    <d-data-table
      [type]="'striped'"
      [dataSource]="basicDataSource"
      (cellClick)="cellClick($event)"
      (cellDBClick)="cellDBClick($event)"
      (rowDBClick)="rowDBClick($event)"
      (rowClick)="rowClick($event)"
      [scrollable]="true"
      [resizeable]="resizable"
    >
      <d-column [order]="1" field="$index" header="#" [width]="'50px'"></d-column>
      <d-column
        [order]="3"
        field="firstName"
        header="First Name"
        [sortable]="true"
        [width]="'150px'"
        [advancedHeader]="[
          { header: 'Name', rowspan: 1, colspan: 2, $width: '300px' },
          { header: 'First Name', rowspan: 1, colspan: 1 }
        ]"
      >
      </d-column>
      <d-column
        [order]="5"
        field="lastName"
        header="Last Name"
        [sortable]="true"
        [width]="'150px'"
        [advancedHeader]="[
          { header: 'Name', rowspan: 1, colspan: 0 },
          { header: 'Last Name', rowspan: 1, colspan: 1 }
        ]"
      ></d-column>
      <d-column [order]="7" field="gender" header="Gender" [sortable]="true" [width]="'150px'"></d-column>
      <d-column
        [order]="2"
        field="dob"
        header="Date of birth"
        [fieldType]="'date'"
        [extraOptions]="{ dateFormat: 'MM/DD/YYYY' }"
        [width]="'200px'"
      ></d-column>
    </d-data-table>
  `
})
class TestDataTableColumnMultiHeaderComponent {
  basicDataSource: Array<SourceType> = JSON.parse(JSON.stringify(originSource.slice(0, 6)));
  resizable = false;
}

@Component({
  template: `
    <d-data-table
      [dataSource]="sortableDataSource"
      [onlyOneColumnSort]="true"
      [(multiSort)]="sortedColumn"
      [scrollable]="true"
      [resizeable]="true"
      (multiSortChange)="multiSortChange($event)"
      (pageIndexChange)="changePageContent($event)"
      (resize)="onResize($event)"
      [hideColumn]="hideColumn"
      [showSortIcon]="true"
    >
      <d-column field="$index" header="#" [width]="'50px'"></d-column>
      <d-column
        field="firstName"
        header="First Name"
        [sortable]="true"
        [width]="'150px'"
        [filterable]="true"
        [filterList]="filterListMulti"
        [beforeFilter]="beforeFilter"
        (filterChange)="filterChangeMultiple($event)"
      ></d-column>
      <d-column
        field="lastName"
        header="Last Name"
        [sortable]="true"
        [width]="'150px'"
        [minWidth]="'100px'"
        [maxWidth]="'200px'"
        [filterable]="true"
        [filterIconActive]="filterIconActive"
        [customFilterTemplate]="customFilterTemplate"
      ></d-column>
      <d-column
        field="gender"
        header="Gender"
        [sortable]="true"
        [width]="'100px'"
        [filterable]="true"
        [filterMultiple]="false"
        [filterList]="filterList2"
        (filterChange)="filterChangeRadio($event)"
      ></d-column>
      <d-column
        field="dob"
        header="Date of birth"
        [fieldType]="'date'"
        [extraOptions]="{ dateFormat: 'MM/DD/YYYY' }"
        [width]="'100px'"
      ></d-column>
      <d-column field="hidden" header="hidden" [width]="'100px'">hidden</d-column>
    </d-data-table>
    <ng-template #customFilterTemplate let-filterList="filterListDisplay" let-dropdown="dropdown">
      <div class="custom-filter-content">
        <div class="filter-options">
          <div *ngFor="let item of checkboxList" class="checkbox-group">
            <d-checkbox
              [label]="item.lastName"
              [(ngModel)]="item.chosen"
              [labelTemplate]="myCheckbox"
              (change)="onCheckboxChange($event, item.lastName)"
            >
              <ng-template #myCheckbox let-label="label">
                <d-avatar [name]="label" [width]="16" [height]="16"></d-avatar>
                <span class="label-style">{{ label }}</span>
              </ng-template>
            </d-checkbox>
          </div>
        </div>
        <div class="line"></div>
        <div>
          <span class="button-style" style="border-right: 1px solid #e8f0fd; margin-left: 10px;" (click)="filterSource(dropdown)"
            >CONFIRM</span
          >
          <span class="button-style" (click)="cancelFilter(dropdown)">CANCEL</span>
        </div>
      </div>
    </ng-template>
  `
})
class TestDataTableColumnSortableComponent {
  @ViewChild(DataTableComponent, { static: true }) datatable: DataTableComponent;
  pagerSource = JSON.parse(JSON.stringify(originSource));
  sortableDataSource: Array<SourceType> = JSON.parse(JSON.stringify(originSource.slice(0, 6)));
  filterList2 = [
    {
      name: 'Clear',
      value: 'Clear'
    },
    {
      name: 'Male',
      value: 'Male'
    },
    {
      name: 'Female',
      value: 'Female'
    }
  ];
  filterList = [
    {
      name: 'Mark',
      value: 'Mark'
    },
    {
      name: 'Jacob',
      value: 'Jacob'
    },
    {
      name: 'Danni',
      value: 'Danni'
    },
    {
      name: 'green',
      value: 'green'
    },
    {
      name: 'po',
      value: 'po'
    },
    {
      name: 'john',
      value: 'john'
    }
  ];
  filterListMulti = JSON.parse(JSON.stringify(originSource.slice(0, 6)));
  sortedColumn = [
    {
      field: 'lastName',
      direction: 'ASC'
    }
  ];
  hideColumn = ['hidden'];
  total = 20;
  next = 1;
  complete = false;
  lazyDataSource = [];
  loading: LoadingType;
  checkboxList = [];
  allChecked = false;
  halfChecked = false;
  filterIconActive = false;

  multiSortChange = jasmine.createSpy('multi sort change');
}

@Component({
  template: `
    <d-data-table #datatable [dataSource]="basicDataSource" [scrollable]="true" [checkable]="true">
      <d-column
        *ngFor="let colOption of dataTableOptions.columns"
        [field]="colOption.field"
        [header]="colOption.header"
        [fieldType]="colOption.fieldType"
        [width]="'150px'"
        [fixedLeft]="colOption?.fixedLeft || null"
        [fixedRight]="colOption?.fixedRight || null"
      >
      </d-column>
    </d-data-table>
  `
})
class TestDataTableFixColumnComponent {
  basicDataSource: Array<SourceType> = JSON.parse(JSON.stringify(originSource.slice(0, 6)));
  dataTableOptions = {
    columns: [
      {
        field: 'firstName',
        header: 'First Name',
        fieldType: 'text',
        fixedLeft: '36px'
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
      },
      {
        field: 'dob',
        header: 'Date of birth',
        fieldType: 'date'
      },
      {
        field: 'dob',
        header: 'Date of birth',
        fieldType: 'date'
      },
      {
        field: 'dob',
        header: 'Date of birth',
        fieldType: 'date'
      },
      {
        field: 'dob',
        header: 'Date of birth',
        fieldType: 'date',
        fixedRight: '0px'
      }
    ]
  };
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

describe('data-table with column', () => {
  describe('drag header', () => {
    let fixture: ComponentFixture<TestDataTableColumnDragComponent>;
    let debugEl: DebugElement;
    let component: TestDataTableColumnDragComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DataTableModule, NoopAnimationsModule],
        declarations: [TestDataTableColumnDragComponent]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDataTableColumnDragComponent);
      debugEl = fixture.debugElement;
      component = fixture.componentInstance;
    });

    it('should create correctly', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should header can be drag', fakeAsync(() => {
      fixture.detectChanges();
      headerDrag(fixture);
    }));

    it('should fixed header can be drag', fakeAsync(() => {
      component.isHeaderFixed = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      headerDrag(fixture);
    }));
  });

  describe('fix header', () => {
    let fixture: ComponentFixture<TestDataTableFixHeaderComponent>;
    let debugEl: DebugElement;
    let component: TestDataTableFixHeaderComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DataTableModule, I18nModule, NoopAnimationsModule],
        declarations: [TestDataTableFixHeaderComponent]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDataTableFixHeaderComponent);
      debugEl = fixture.debugElement;
      component = fixture.componentInstance;
    });

    it('should create correctly', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should scroll work', fakeAsync(() => {
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const scrollViewEl = debugEl.query(By.css('.devui-scrollbar.scroll-view'));
      expect(scrollViewEl).toBeTruthy();

      const { top: scrollViewTop } = scrollViewEl.nativeElement.getBoundingClientRect();

      let tbodyTrs = debugEl.queryAll(
        By.css('.devui-data-table .devui-table-view .devui-scrollbar.scroll-view table.devui-table tbody tr')
      );
      let { top: tr1Top, height: trHeight } = tbodyTrs[0].nativeElement.getBoundingClientRect();
      expect(scrollViewTop).toBe(tr1Top);

      // scroll one tr height
      scrollViewEl.nativeElement.scrollTop = trHeight;
      scrollViewEl.nativeElement.dispatchEvent(new Event('scroll'));
      tick();
      fixture.detectChanges();

      tbodyTrs = debugEl.queryAll(By.css('.devui-data-table .devui-table-view .devui-scrollbar.scroll-view table.devui-table tbody tr'));
      ({ top: tr1Top } = tbodyTrs[0].nativeElement.getBoundingClientRect());
      expect(Math.round(scrollViewTop - trHeight)).toBe(Math.round(tr1Top));

      // scroll two tr height
      scrollViewEl.nativeElement.scrollTop = 2 * trHeight;
      scrollViewEl.nativeElement.dispatchEvent(new Event('scroll'));
      tick();
      fixture.detectChanges();

      tbodyTrs = debugEl.queryAll(By.css('.devui-data-table .devui-table-view .devui-scrollbar.scroll-view table.devui-table tbody tr'));
      ({ top: tr1Top } = tbodyTrs[0].nativeElement.getBoundingClientRect());
      expect(scrollViewTop - 2 * trHeight).toBeLessThanOrEqual(tr1Top); // touch bottom, maybe tr2 part visible
      expect(tr1Top).toBeLessThan(scrollViewTop);
    }));

    it('should resize work', fakeAsync(() => {
      component.resizable = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const thsOfRow1 = debugEl.queryAll(By.css('table.devui-table thead tr:first-child th'));
      const resizeBarOfIdx = thsOfRow1[0].query(By.css('.resize-handle'));
      const { x: resizeBarX, y: resizeBarY } = resizeBarOfIdx.nativeElement.getBoundingClientRect();

      const idxWidth = thsOfRow1[0].nativeElement.getBoundingClientRect().width;

      const mouseDownEvt = createMouseEvent('mousedown', resizeBarX, resizeBarY);
      resizeBarOfIdx.nativeElement.dispatchEvent(mouseDownEvt);
      fixture.detectChanges();

      const mouseMoveEvt = createMouseEvent('mousemove', resizeBarX + 10, resizeBarY);
      document.dispatchEvent(mouseMoveEvt);
      flush();
      fixture.detectChanges();

      document.dispatchEvent(createMouseEvent('mouseup', resizeBarX + 10, resizeBarY));
      flush();
      fixture.detectChanges();

      const idxEl = debugEl.queryAll(By.css('table.devui-table thead tr:first-child th'))[0];
      const idxElWidth = idxEl.nativeElement.getBoundingClientRect().width;
      expect(idxWidth).toBeLessThan(idxElWidth);
    }));
  });

  describe('multi header', () => {
    let fixture: ComponentFixture<TestDataTableColumnMultiHeaderComponent>;
    let debugEl: DebugElement;
    let component: TestDataTableColumnMultiHeaderComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DataTableModule, I18nModule, NoopAnimationsModule],
        declarations: [TestDataTableColumnMultiHeaderComponent]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDataTableColumnMultiHeaderComponent);
      debugEl = fixture.debugElement;
      component = fixture.componentInstance;
    });

    it('should create correctly', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should have multi header', () => {
      fixture.detectChanges();
      const thead = debugEl.query(By.css('table.devui-table thead'));
      const thsOfRow1 = debugEl.queryAll(By.css('table.devui-table thead tr:first-child th'));
      expect(thsOfRow1[0].nativeElement.getBoundingClientRect().height).toBe(thsOfRow1[1].nativeElement.getBoundingClientRect().height);
      expect(thsOfRow1[1].nativeElement.getBoundingClientRect().height).toBe(thsOfRow1[3].nativeElement.getBoundingClientRect().height);
      expect(Math.round(thsOfRow1[0].nativeElement.getBoundingClientRect().height)).toBe(
        Math.round(thsOfRow1[2].nativeElement.getBoundingClientRect().height * 2)
      );

      const thsOfRow2 = debugEl.queryAll(By.css('table.devui-table thead tr:last-child th'));
      const firstNameWidth = thsOfRow2[0].nativeElement.getBoundingClientRect().width;
      const lastNameWidth = thsOfRow2[1].nativeElement.getBoundingClientRect().width;
      const nameWidth = thsOfRow1[2].nativeElement.getBoundingClientRect().width;

      expect(Math.round(firstNameWidth + lastNameWidth)).toBe(Math.round(nameWidth));
    });

    it('should multi header normal header can be resize', fakeAsync(() => {
      component.resizable = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      const thsOfRow1 = debugEl.queryAll(By.css('table.devui-table thead tr:first-child th'));
      const resizeBarOfIdx = thsOfRow1[0].query(By.css('.resize-handle'));
      const { x: resizeBarX, y: resizeBarY } = resizeBarOfIdx.nativeElement.getBoundingClientRect();

      const idxWidth = thsOfRow1[0].nativeElement.getBoundingClientRect().width;

      const mouseDownEvt = createMouseEvent('mousedown', resizeBarX, resizeBarY);
      resizeBarOfIdx.nativeElement.dispatchEvent(mouseDownEvt);
      fixture.detectChanges();

      const mouseMoveEvt = createMouseEvent('mousemove', resizeBarX + 10, resizeBarY);
      document.dispatchEvent(mouseMoveEvt);
      flush();
      fixture.detectChanges();

      document.dispatchEvent(createMouseEvent('mouseup', resizeBarX + 10, resizeBarY));
      flush();
      fixture.detectChanges();

      const idxEl = debugEl.queryAll(By.css('table.devui-table thead tr:first-child th'))[0];
      const idxElWidth = idxEl.nativeElement.getBoundingClientRect().width;
      expect(idxWidth).toBeLessThan(idxElWidth);
    }));

    it('should advanced headers parent is resizable', fakeAsync(() => {
      component.resizable = true;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      let nameEl = debugEl.queryAll(By.css('table.devui-table thead tr:first-child th'))[2].nativeElement;
      const nameElWidth = nameEl.getBoundingClientRect().width;
      const lastNameColumnDebugEl = debugEl.queryAll(By.css('table.devui-table thead tr:last-child th'))[1];
      const lastNameResizeBar = lastNameColumnDebugEl.query(By.css('.resize-handle'));
      const { x: resizeBarX, y: resizeBarY } = lastNameResizeBar.nativeElement.getBoundingClientRect();

      const mouseDownEvt = createMouseEvent('mousedown', resizeBarX, resizeBarY);
      lastNameResizeBar.nativeElement.dispatchEvent(mouseDownEvt);
      fixture.detectChanges();
      debugger;

      const mouseMoveEvt = createMouseEvent('mousemove', resizeBarX + 40, resizeBarY);
      document.dispatchEvent(mouseMoveEvt);
      flush();
      fixture.detectChanges();

      document.dispatchEvent(createMouseEvent('mouseup', resizeBarX + 40, resizeBarY));
      flush();
      fixture.detectChanges();

      nameEl = debugEl.queryAll(By.css('table.devui-table thead tr:first-child th'))[2].nativeElement;
      const nameElResizeWidth = nameEl.getBoundingClientRect().width;
      expect(nameElWidth).toBeLessThan(nameElResizeWidth);
    }));
  });

  describe('sortable', () => {
    let fixture: ComponentFixture<TestDataTableColumnSortableComponent>;
    let debugEl: DebugElement;
    let component: TestDataTableColumnSortableComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DataTableModule, I18nModule, NoopAnimationsModule],
        declarations: [TestDataTableColumnSortableComponent]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDataTableColumnSortableComponent);
      debugEl = fixture.debugElement;
      component = fixture.componentInstance;
    });

    it('should be created correctly', () => {
      expect(component).toBeTruthy();
    });

    it('should sortable icon can be click', () => {
      fixture.detectChanges();
      const thDebugEls = debugEl.queryAll(By.css('table.devui-table thead th'));
      const lastNameSortIcon = thDebugEls[2].query(By.css('.sort-clickable'));
      lastNameSortIcon.nativeElement.dispatchEvent(new Event('click'));
      expect(component.multiSortChange).toHaveBeenCalled();
      fixture.detectChanges();
      expect(component.sortedColumn[0].field).toBe('lastName');
      expect(component.sortedColumn[0].direction).toBe('DESC');

      const firstNameSortIcon = thDebugEls[1].query(By.css('.sort-clickable'));
      firstNameSortIcon.nativeElement.dispatchEvent(new Event('click'));
      fixture.detectChanges();
      expect(component.multiSortChange).toHaveBeenCalledTimes(2);
      expect(component.sortedColumn.length).toBe(1);
      expect(component.sortedColumn[0].field).toBe('firstName');
      expect(component.sortedColumn[0].direction).toBe('ASC');
    });
  });

  describe('fix column', () => {
    let fixture: ComponentFixture<TestDataTableFixColumnComponent>;
    let debugEl: DebugElement;
    let component: TestDataTableFixColumnComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DataTableModule],
        declarations: [TestDataTableFixColumnComponent]
      });
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(TestDataTableFixColumnComponent);
      debugEl = fixture.debugElement;
      component = fixture.componentInstance;
    });

    it('should created correctly', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });

    it('should scroll left and right work', () => {});
  });
});

function headerDrag(fixture: ComponentFixture<TestDataTableColumnDragComponent>) {
  const debugEl = fixture.debugElement;
  let dHeaderCells = debugEl.queryAll(By.css('.devui-data-table table.devui-table thead tr th'));
  expect(dHeaderCells[1].nativeElement.textContent).toContain('First Name');
  expect(dHeaderCells[2].nativeElement.textContent).toContain('Last Name');

  const columnFirstNameDragIcon = dHeaderCells[1].query(By.css('.drag-icon'));
  columnFirstNameDragIcon.nativeElement.style.visibility = 'visible';

  const { x: fromX, y: fromY } = columnFirstNameDragIcon.nativeElement.getBoundingClientRect();
  const { x: moveToX, y: moveToY, width, height } = dHeaderCells[2].nativeElement.getBoundingClientRect();
  const mouseDownEvt = createMouseEvent('mousedown', fromX, fromY);
  const mouseMoveEvt = createMouseEvent('mousemove', moveToX + width, moveToY + height / 2);
  const mouseUpEvt = createMouseEvent('mouseup');
  columnFirstNameDragIcon.nativeElement.dispatchEvent(mouseDownEvt);
  tick(); // emit onTap, setTimeout: wait for mousemove & mouseup addEventListener
  document.documentElement.dispatchEvent(mouseMoveEvt); // emit handleMouseMove, add event listener to grab
  tick();
  document.documentElement.dispatchEvent(mouseDownEvt); // emit grab
  tick(); // add event listener mouse move
  document.documentElement.dispatchEvent(mouseMoveEvt); // emit startBecauseMouseMoved
  tick();
  document.documentElement.dispatchEvent(mouseMoveEvt); // emit drag
  tick();
  document.documentElement.dispatchEvent(mouseUpEvt); // emit release
  flush();
  fixture.detectChanges();
  dHeaderCells = debugEl.queryAll(By.css('.devui-data-table table.devui-table thead tr th'));
  expect(dHeaderCells[1].nativeElement.textContent).toContain('Last Name');
  expect(dHeaderCells[2].nativeElement.textContent).toContain('First Name');
}
