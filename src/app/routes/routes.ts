import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from '../login/login.component'
import { TableComponent } from '../table/table.component'
import { AuthGuard } from "../_guards/auth-guard.service";
import { GuestGuard } from "../_guards/guest-guard.service";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate : [GuestGuard]
  }, {
    path: '',
    component: TableComponent,
    canActivate: [AuthGuard],
  }, {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

let XmlRouter = RouterModule.forRoot(
  appRoutes,
  // { enableTracing: true } // <-- debugging purposes only
)

export {
  XmlRouter
}
