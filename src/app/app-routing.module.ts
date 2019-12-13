import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MemberComponent} from './pages/member/member.component';

const appRoutes: Routes = [
  {path: '**', component: MemberComponent},
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
