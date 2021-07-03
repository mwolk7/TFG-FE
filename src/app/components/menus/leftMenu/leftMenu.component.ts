import { Component, OnInit, OnDestroy } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-left-menu',
  templateUrl: './leftMenu.component.html',
  styleUrls: ['./leftMenu.component.scss']
})
export class LeftMenuComponent implements OnInit, OnDestroy {

  isCollapsed = true;

  constructor(
      private router: Router
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }


  homeClick() {
    this.router.navigate(['projects']);
  }

}
