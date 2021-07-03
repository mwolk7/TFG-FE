import {Pipe, PipeTransform} from '@angular/core';
import {ModuleDto} from '@codegen/mtsuite-api/model/moduleDto';
import {TestCaseDtoPriority} from '@codegen/mtsuite-api/model/testCaseDto';

@Pipe({
    name: 'testCaseFilter'
})
export class TestCaseFilterPipe implements PipeTransform {

    initialValue: boolean = true;
    transform(modules: ModuleDto[], filterArguments: TestCaseDtoPriority[] = []): any {

        if (filterArguments.length === 0 && this.initialValue) {
            return modules

        } else {
            this.initialValue = false;
        }

        return modules.map(m => {
            m.testCases.map(tc => {
                    if (filterArguments.includes(tc.priority)) {
                        tc.run = true;
                        return tc;
                    } else {
                        tc.run = false;
                    }
                    return tc;
                }
            );

            return m;
        });
    }
}
