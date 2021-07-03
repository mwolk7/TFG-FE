import {Component, OnInit, Input, Output} from '@angular/core';
import {ProjectDto} from '@codegen/mtsuite-api/model/projectDto';
import {Router} from '@angular/router';

class integer {
}

@Component({
  selector: 'app-row-proyect',
  templateUrl: './proyect.component.html',
  styleUrls: ['./proyect.component.scss']
})
export class ProyectComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() project: ProjectDto;

  ngOnInit() {
  }
  // New
  projectClick() {
    this.router.navigate(['projects/' + this.project.id.toString()]);
  }

}
