import {Component, OnInit, Input, Output} from '@angular/core';
import {TestCaseDto} from '@codegen/mtsuite-api/model/testCaseDto';
import {from} from 'rxjs';
import {TestSuiteDto} from '@codegen/mtsuite-api/model/testSuiteDto';
import {Router} from '@angular/router';

@Component({
  selector: 'app-row-testsuite',
  templateUrl: './testSuite.component.html',
  styleUrls: ['./testSuite.component.scss']
})
export class TestSuiteComponent implements OnInit {

  @Input() testSuite: TestSuiteDto;

  modules = 0;
  testCases = 0;

  constructor(private router: Router) { }


  ngOnInit() {
    if ( this.testSuite.modules ) {
      this.modules = this.testSuite.modules.length;
      this.testSuite.modules.forEach(data => {
        if (data.testCases) {
          this.testCases += data.testCases.length;
        }
      });
    }
  }

  // New
  testSuiteClick() {
    this.router.navigate(['projects/' + this.testSuite.projectId + '/testSuites/' + this.testSuite.id.toString()]);
  }

  // New
  testRunnerClick() {
    this.router.navigate(['projects/' + this.testSuite.projectId + '/testSuites/' + this.testSuite.id.toString() + '/testRunners/0/editor']);
  }

  previewOnClick() {
    this.router.navigate(['projects/' + this.testSuite.projectId + '/testSuites/' + this.testSuite.id.toString()]);
  }

  testSuiteEditClick() {
    this.router.navigate(['projects/' + this.testSuite.projectId + '/testSuites/' + this.testSuite.id.toString() + '/editor']);
  }

}
