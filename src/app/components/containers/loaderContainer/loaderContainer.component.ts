import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loader-container',
  templateUrl: './loaderContainer.component.html',
  styleUrls: ['./loaderContainer.component.scss']
})
export class LoaderContainerComponent implements OnInit {

  @Input() loading = false;

  constructor() { }

  ngOnInit() {
  }

}
