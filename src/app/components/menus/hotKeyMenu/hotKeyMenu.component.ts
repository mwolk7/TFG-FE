import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotkey-menu',
  templateUrl: './hotKeyMenu.component.html',
  styleUrls: ['./hotKeyMenu.component.scss']
})
export class HotKeyMenuComponent implements OnInit, OnDestroy {

  @Input() hotKeyList: MenuHotKeys[] = [];

  hotKeysAvailable: HotKey[] = [
    {
      id: MenuHotKeys.NEW_PROJECT, text: 'New Project', onClick: this.newProjectOnClick, color: 'magenta'
    },
    {
      id: MenuHotKeys.NEW_TESTSUITE, text: 'New TestSuite', onClick: this.newTestSuiteOnClick, color: 'orange'
    },
    {
      id: MenuHotKeys.NEW_TESTRUNNER, text: 'New TestRunner', onClick: this.newTestRunnerOnClick, color: 'geekblue'
    }
  ];

  hotKeyToShow: HotKey[] = [];

  constructor(
      private router: Router,
  ) {
  }

  ngOnInit() {
    this.hotKeyList.forEach(item => {
      this.hotKeyToShow.push(this.hotKeysAvailable.find(element => element.id === item))
    });
  }

  ngOnDestroy() {
  }

  // On click functions
  newProjectOnClick() {
    console.log("newProjectOnClick")
  }

  newTestSuiteOnClick() {
    console.log("newTestSuiteOnClick")
  }

  newTestRunnerOnClick() {
    console.log("newTestRunnerOnClick")
  }
}

class HotKey {
  id: MenuHotKeys;
  text: string;
  color: any;
  onClick: any;
}

// ENUM WITH HOTKEY
export enum MenuHotKeys {
  NEW_PROJECT,
  NEW_TESTSUITE,
  NEW_TESTRUNNER
}

