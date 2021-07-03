import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule, LOCALE_ID, ErrorHandler} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { ComponentsModule } from './components/components.module';
import { IconsProviderModule } from './icons-provider.module';
import {NgZorroAntdModule, NZ_I18N, en_US, NzDropDownModule} from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import it from '@angular/common/locales/it';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import { MockUserService, KeycloakUserService, UserService } from './services/user.service';
import { kcFactory, createTranslateLoader } from './app-init';


import {BASE_PATH as BASE_PATH_API} from '@codegen/mtsuite-api';

import { environment } from 'src/environments/environment';
import { NgZorroNoTableAntdModule } from './modules/ng-zorro-no-table.module';
import { httpInterceptorProviders } from './services/interceptors';
import { ErrorsHandler } from './commons/utils/errors-handler';
import {LogService} from './services/log.service';
import {NgxMdModule} from 'ngx-md';

registerLocaleData(en);
registerLocaleData(it);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    IconsProviderModule,
    NgZorroNoTableAntdModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ComponentsModule,
    NzDropDownModule,
    NgxMdModule.forRoot(),
  ],
  providers: [
    {provide: NZ_I18N, useValue: en_US},
    {
      provide: APP_INITIALIZER,
      useFactory: kcFactory,
      deps: [KeycloakService],
      multi: true
    },
    {provide: UserService, useClass: environment.keycloak.enabled ? KeycloakUserService : MockUserService},
    {provide: ErrorHandler, useClass: ErrorsHandler},
    {provide: LogService, useClass: LogService},
    httpInterceptorProviders,
    {provide: LOCALE_ID, useValue: 'it'},
    {provide: BASE_PATH_API, useValue: environment.apiUrl},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
