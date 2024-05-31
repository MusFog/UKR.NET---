import { RouterModule, Routes } from '@angular/router'
import { NgModule } from '@angular/core'
import { LoginPageComponent } from './login-page/login-page.component'
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component'
import { RegisterPageComponent } from './register-page/register-page.component'
import { AuthGuard } from './shared/classes/auth.guard'
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component'
import { MainPageComponent } from './main-page/main-page.component'
import { AdminPanelPageComponent } from './adminPanel-page/adminPanel-page.component'
import { CategoryPageComponent } from './adminPanel-page/category-page/category-page.component'
import { TestPageComponent } from './adminPanel-page/test-page/test-page.component'
import { TestItemPageComponent } from './category-all-page/test-item-page/test-item-page.component'
import { FeedbackPageComponent } from './feedback-page/feedback-page.component'
import { CheckingTestPageComponent } from "./adminPanel-page/checking-test-page/checking-test-page.component";
import {
  CheckingItemTestPageComponent
} from "./adminPanel-page/checking-test-page/checking-item-test-page/checking-item-test-page.component";
import { PersonalOfficePageComponent } from "./personal-office-page/personal-office-page.component";
import {
  CheckingItemTestPersonalPageComponent
} from "./personal-office-page/checking-item-test-personal-page/checking-item-test-personal-page.component";
import { CategoryAllPageComponent } from "./category-all-page/category-all-page.component";
import { TestCategoryPageComponent } from "./category-all-page/test-category-page/test-category-page.component";
import { FeedbackTestPageComponent } from "./feedback-test-page/feedback-test-page.component";
import {
  FeedbackUserTestPageComponent
} from "./feedback-test-page/feedback-user-test-page/feedback-user-test-page.component";

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', redirectTo: '/login', pathMatch: 'full' },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
    ],
  },
  {
    path: '',
    component: SiteLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'main', component: MainPageComponent },
      { path: 'adminPanel', component: AdminPanelPageComponent },
      { path: 'category/new', component: CategoryPageComponent },
      { path: 'category/:id', component: CategoryPageComponent },
      { path: 'categoryAll', component: CategoryAllPageComponent },
      { path: 'categoryTest/:id', component: TestCategoryPageComponent },
      { path: 'test/new', component: TestPageComponent },
      { path: 'answer/:id', component: TestItemPageComponent },
      { path: 'answer', component: TestItemPageComponent },
      { path: 'answers/check', component: CheckingTestPageComponent },
      { path: 'answerItem/:id', component: CheckingItemTestPageComponent },
      { path: 'answerItemForUser/:id', component: CheckingItemTestPersonalPageComponent },
      { path: 'feedback', component: FeedbackPageComponent },
      { path: 'feedbackTest/:id', component: FeedbackTestPageComponent },
      { path: 'feedbackUserTest/:id', component: FeedbackUserTestPageComponent },
      { path: 'personalOffice', component: PersonalOfficePageComponent },
    ],
  },
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
