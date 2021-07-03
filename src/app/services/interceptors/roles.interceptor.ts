import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class RolesInterceptor implements HttpInterceptor {

    constructor(private userService: UserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(`request url: ${req.url}`);

        const devCredentials = environment.mock.username + ';' + environment.mock.username  + ';' + environment.mock.roles+ ';' + environment.mock.roles;

        const customRequest = req.clone({ headers: req.headers.set('X-Dev-Authorization', devCredentials) });

        return next.handle(customRequest);
    }
}
