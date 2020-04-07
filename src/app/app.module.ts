import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { NgSelectModule } from '@ng-select/ng-select'
import { NgbModule, NgbDateParserFormatter, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { XmlRouter } from './routes/routes'
import { AppComponent } from './app.component'
import { LoginComponent } from './login/login.component'
import { TableComponent } from './table/table.component'
import { AuthGuard } from "./_guards/auth-guard.service";
import { GuestGuard } from "./_guards/guest-guard.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from "./interceptors/AuthInterceptor";
import { NgbDateCustomParserFormatter } from './NgbDate-custom-parser-formatter';
import {TreeModule} from 'primeng/tree';
import {ProgressBarModule} from 'primeng/progressbar';
import { BrowserTimeFormatterPipe } from './browser-time-formatter.pipe';
import {CheckboxModule} from 'primeng/checkbox';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TableComponent,
    BrowserTimeFormatterPipe
  ],
  imports: [
    BrowserAnimationsModule,
    NoopAnimationsModule,
    BrowserModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    XmlRouter,
    NgxDatatableModule,
    ReactiveFormsModule,
    TreeModule,
    ProgressBarModule,
    ToastrModule.forRoot(),
    CheckboxModule,
    Ng2SearchPipeModule,
    DropdownModule
  ],
  providers: [
    AuthGuard,
    GuestGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter},
    {provide:NgbDatepickerConfig, useClass: NgbDatepickerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
