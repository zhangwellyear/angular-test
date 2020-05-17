import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CheckBoxComponent } from './checkbox.component';
import { DebugElement, Component, ViewChild } from '@angular/core';
import { DomHelper } from 'ng-devui/utils/testing/dom-helper';
import { By } from '@angular/platform-browser';

@Component({
    template: `
    <d-checkbox #comp [label]="'选中状态'" [halfchecked]="halfChecked" [isShowTitle]="false" [disabled]="disabled" [ngModel]="true">
    </d-checkbox>
    `
})
class TestCheckBoxComponent {
    @ViewChild('comp', { static: true}) comp: CheckBoxComponent;

    constructor() {}

    disabled = false;
    halfChecked = false;
} 

describe('checkbox', () => {
    describe('basic', () => {
        let fixture: ComponentFixture<TestCheckBoxComponent>;
        let debugEl: DebugElement;
        let component: TestCheckBoxComponent;
        let domHelper: DomHelper<TestCheckBoxComponent>;
            
        beforeEach(() =>{
            TestBed.configureTestingModule({
                imports: [FormsModule],
                declarations: [
                    CheckBoxComponent,
                    TestCheckBoxComponent,
                ]
            })
        });

        beforeEach(() => {
            fixture = TestBed.createComponent(TestCheckBoxComponent);
            debugEl = fixture.debugElement;
            component = fixture.componentInstance;
            domHelper = new DomHelper(fixture);
            fixture.detectChanges();
        });

        it('should have content', () =>{
            expect(debugEl.nativeElement.textContent).toBe('选中状态');
        });

        it('should have correct classList', () => {
            const classList = ['.devui-checkbox', '.devui-checkbox-input', '.devui-checkbox-bg', '.devui-checkbox-tick', '.devui-tick'];
            expect(domHelper.judgeClasses(classList)).toBeTruthy();
        });

        it('shuold half checked status works', () => {
            component.halfChecked = true;
            const labelEl: HTMLElement = debugEl.query(By.css('label')).nativeElement;
            labelEl.click();
            fixture.detectChanges();

            const classList = ['.devui-checkbox', '.devui-checkbox-input', '.devui-checkbox-bg', '.devui-checkbox-tick', '.devui-tick', '.halfchecked'];
            expect(domHelper.judgeClasses(classList)).toBeTruthy();
        });

        it('should click work', () => {
            const labelEl: HTMLElement = debugEl.query(By.css('label')).nativeElement;
            labelEl.click();
            fixture.detectChanges();

            expect(component.comp.checked).toBeTruthy();

            labelEl.click();
            fixture.detectChanges();
            expect(component.comp.checked).toBeFalsy();
        });

        it('should disabled status work', () => {
            component.disabled = true;
            fixture.detectChanges();

            const labelEl: HTMLElement = debugEl.query(By.css('label')).nativeElement;
            labelEl.click();
            fixture.detectChanges();

            expect(component.comp.checked).toBeFalsy();
        });
    });
});