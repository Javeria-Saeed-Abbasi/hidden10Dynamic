import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { FaqComponent } from './components/faq/faq.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogInnerComponent } from './components/blog-inner/blog-inner.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { FiltersComponent } from './common/filters/filters.component';
import { IndexComponent } from './dashboard/index/index.component';
import { PersonalDetailsComponent } from './dashboard/personal-details/personal-details.component';
import { MatchSettingsComponent } from './dashboard/match-settings/match-settings.component';
import { LikeLikebyComponent } from './dashboard/like-likeby/like-likeby.component';
import { ChangePasswordComponent } from './dashboard/change-password/change-password.component';
import { NotificationsComponent } from './dashboard/notifications/notifications.component';
import { HelpCenterComponent } from './dashboard/help-center/help-center.component';
import { PrivacyPolicyComponent } from './dashboard/privacy/privacy.component';
import { HeaderComponent } from './common/header/header.component';
import { FooterComponent } from './common/footer/footer.component';
import { SwiperModule } from 'swiper/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxBootstrapSliderModule } from 'ngx-bootstrap-slider';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { ProfilesComponent } from './dashboard/profiles/profiles.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { ChatComponent } from './dashboard/chat/chat.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ContactComponent } from './components/contact/contact.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgwWowModule } from 'ngx-wow';
import { AccountSettingComponent } from './dashboard/account-setting/account-setting.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgOtpInputModule } from  'ng-otp-input';
import { AngularOtpLibModule } from 'angular-otp-box';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SanitizeHtmlPipe } from './pipes/sanitize-html.pipe';
import { LoaderComponent } from './loader/loader.component';
import { PrivacyPolicySiteComponent } from './components/privacy-policy/privacy-policy.component';
import { PhotoAlbumComponent } from './dashboard/photo-album/photo-album.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    FaqComponent,
    BlogComponent,
    BlogInnerComponent,
    RegistrationComponent,
    FiltersComponent,
    IndexComponent,
    PersonalDetailsComponent,
    MatchSettingsComponent,
    LikeLikebyComponent,
    ChangePasswordComponent,
    NotificationsComponent,
    HelpCenterComponent,
    HeaderComponent,
    FooterComponent,
    ProfilesComponent,
    ProfileComponent,
    ChatComponent,
    ContactComponent,
    AccountSettingComponent,
    LoaderComponent,
    SanitizeHtmlPipe,
    PrivacyPolicyComponent,
    PrivacyPolicySiteComponent,
    PhotoAlbumComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    FontAwesomeModule,
    NgSelectModule,
    NgxSliderModule,
    NgxBootstrapSliderModule,
    MdbRangeModule,
    Ng5SliderModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbProgressbarModule,
    NgwWowModule,
    NgOtpInputModule,
    AngularOtpLibModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
