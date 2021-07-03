import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  template: '<app-main></app-main>'
})
export class AppComponent {
  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'fr', 'es', 'it']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|es|it/) ? browserLang : 'en');
  }

}
