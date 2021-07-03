import { ErrorHandler, Injectable, Injector} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService, NzNotificationDataOptions } from 'ng-zorro-antd';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ErrorsHandler implements ErrorHandler {
  private static readonly defaultErrorTitle = 'ERROR!';
  private static readonly genericError = 'ERROR!';
  private static readonly chunkFailedMatch = /.*Loading chunk [^\s]+ failed.*/;

  constructor(private notificationService: NzNotificationService,
              private translateService: TranslateService,
              private injector: Injector) { }

  // generic error handling, will handle exceptions and network errors
  // this method is called from angular, not thought to be called maually
  handleError(error: Error | HttpErrorResponse) {
    console.log(error);
    if (!navigator.onLine && (error instanceof HttpErrorResponse || ErrorsHandler.chunkFailedMatch.test(error.message))) {
      // NOTE: this way we guess it is an offline
      this.notifyError(ErrorsHandler.defaultErrorTitle, 'OffLine');
      return;
    }
    if (error instanceof HttpErrorResponse) {
      const status = (error as HttpErrorResponse).status;
      switch (status) {
        case 403:
          this.notifyError(ErrorsHandler.defaultErrorTitle, 'NO AUTHORIZED');
          this.injector.get(Router).navigate(['errors'], { replaceUrl: true });
          return;
        default: break;
      }

      switch (Math.floor(status / 100)) {
        // 4XX family errors
        case 0: this.injector.get(Router).navigate(['errors'], { replaceUrl: true });
        // 4XX family errors
        case 4: this.notifyError(ErrorsHandler.defaultErrorTitle, 'Incorect data'); return;
        // 5XX family errors
        case 5: this.notifyError(ErrorsHandler.defaultErrorTitle, 'System error'); return;
        // no errors
        default: break;
      }
    } else {
      // NOTE: handle other errors here
      console.log("Others errors")

    }
  }

  // application error handling
  // it should be called from user code
  handleAppError(title?: string, message?: string, ...args: any) {
    console.log(`APP ERROR - [${title}] [${message}]`, args);
    this.notifyError(title || ErrorsHandler.defaultErrorTitle, message || ErrorsHandler.genericError, args);
  }

  private notifyError(title: string, message: string, args?: any[]) {
    const options: NzNotificationDataOptions<any> = { nzPauseOnHover: true };
    this.notificationService.error(this.translateService.instant(title), this.translateService.instant(message, args), options);
  }
}
