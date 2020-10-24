import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SignInComponent} from './pages/sign/sign-in/sign-in.component';
import {SignUpComponent} from './pages/sign/sign-up/sign-up.component';
import {MemberComponent} from './pages/member/member.component';
import {SampleComponent} from './pages/sample/sample.component';

const appRoutes: Routes = [
  // {path: '**', component: SignInComponent},
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'members', component: MemberComponent},
  {path: 'sample', component: SampleComponent},
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: true}
    ),
  ]
})
export class AppRoutingModule {
}
