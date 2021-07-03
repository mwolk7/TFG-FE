import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ProfileService} from '@codegen/mtsuite-api/api/profile.service';
import {CurrentUserDto} from '@codegen/mtsuite-api/model/currentUserDto';
import {HttpErrorResponse} from '@angular/common/http';
import {retry} from 'rxjs/operators';

@Component({
    selector: 'app-waiting',
    templateUrl: './waiting.component.html',
    styleUrls: ['./waiting.component.scss']
})
export class WaitingComponent implements OnInit {

    loading: boolean = true;
    currentUser: CurrentUserDto;

    constructor(
        private router: Router,
        private profileService: ProfileService) { }


    ngOnInit() {
        this.getUser();
        this.redirect();
    }

    getUser() {
        this.profileService.getCurrentUser().pipe(retry(5)).subscribe(data => {
            if (data) {
                this.currentUser = data;
                this.loading = false;
                console.log('CURRENT USER', this.currentUser)
            }
        }, error => {
            throw new HttpErrorResponse(error);
        });
    }

    redirect() {
        this.router.navigate(['/projects'])
    }

}

