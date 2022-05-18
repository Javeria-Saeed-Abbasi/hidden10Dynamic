import { BlogComponent } from './components/blog/blog.component';
import { FaqComponent } from './components/faq/faq.component';
import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './dashboard/index/index.component';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';
import { LikeLikebyComponent } from './dashboard/like-likeby/like-likeby.component';
import { HelpCenterComponent } from './dashboard/help-center/help-center.component';
import { MatchSettingsComponent } from './dashboard/match-settings/match-settings.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { PersonalDetailsComponent } from './dashboard/personal-details/personal-details.component';
import { PrivacyPolicyComponent } from './dashboard/privacy/privacy.component';
import { PrivacyPolicySiteComponent } from '../app/components/privacy-policy/privacy-policy.component';
import { AboutComponent } from './components/about/about.component';
import { ProfilesComponent } from './dashboard/profiles/profiles.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { ChatComponent } from './dashboard/chat/chat.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { BlogInnerComponent } from './components/blog-inner/blog-inner.component';
import { ContactComponent } from './components/contact/contact.component';
import { SecureInnerPagesGuard } from './guards/secure-inner-pages-guard.guard';
import { AdminGuard } from './guards/admin-guard.guard';
import { SecureWebsiteGuard } from './guards/secure-website.guard';

const routes: Routes = [
  // { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '',   component: HomeComponent, canActivate: [SecureWebsiteGuard]
},
  // { path: 'landingPage',   component: HomeComponent },
  { path: 'about', component: AboutComponent, canActivate: [SecureWebsiteGuard]},
  { path: 'faqs', component: FaqComponent, canActivate: [SecureWebsiteGuard]},
  { path: 'blogs', component: BlogComponent, canActivate: [SecureWebsiteGuard]},
  { path: 'blogs/blog/:id', component: BlogInnerComponent, canActivate: [SecureWebsiteGuard]},
  { path: 'contact', component: ContactComponent, canActivate: [SecureWebsiteGuard]},
  { path: 'policyPrivacy', component: PrivacyPolicySiteComponent, canActivate: [SecureWebsiteGuard]},
  { path: 'registration',
   component: RegistrationComponent,
   canActivate: [SecureInnerPagesGuard],
  },
  { path: 'profileSettings',        component: IndexComponent,
  canActivate: [AdminGuard],},
  { path: 'profileSettings/changePassword',        component: ChangePasswordComponent , canActivate:[AdminGuard]},
  { path: 'profileSettings/likeLikeBy',        component: LikeLikebyComponent , canActivate:[AdminGuard]},
  { path: 'profileSettings/helpCenter',        component: HelpCenterComponent , canActivate:[AdminGuard]},
  { path: 'profileSettings/matchSetting',        component: MatchSettingsComponent , canActivate:[AdminGuard]},
  { path: 'profileSettings/notifications',        component: NotificationsComponent , canActivate:[AdminGuard]},
  { path: 'profileSettings/personalDetails',        component: PersonalDetailsComponent , canActivate:[AdminGuard]},
  { path: 'profileSettings/privacyPolicy',        component: PrivacyPolicyComponent , canActivate:[AdminGuard]},
  { path: 'dashboard',        component: ProfilesComponent , canActivate:[AdminGuard]},
  { path: 'packages',        component: ProfilesComponent },
  { path: 'profile/:id',        component: ProfileComponent, canActivate: [AdminGuard] },
  { path: 'profileSettings/chat/:id',        component: ChatComponent , canActivate:[AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
