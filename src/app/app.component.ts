import { ChangeDetectorRef, Component } from '@angular/core';
import * as $ from 'jquery';
import * as AOS from 'aos';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';
import { NgwWowService } from 'ngx-wow';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpService } from './services/http.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderServiceService } from './services/loader-service.service';
import { GlobaldataService } from './services/globaldata.service';
import { NotificationService } from './services/notification.service';
import { ChatService } from './services/chat.service';
import { CallService } from './services/call.service';
declare var callFunc: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'hidden10';
  dashboardFooter = false;
  registrationDashboard = false;
  contactFooter = false;
  callerId;
  constructor(
    private router: Router,
    private wowService: NgwWowService,
    public http: HttpService,
    private toastr: ToastrService,
    private notifiService: NotificationService,
    private chatService: ChatService,
    private cd: ChangeDetectorRef,
    private callservice: CallService
  ) {
    // new callFunc();
          // new callFunc();
          this.wowService.init();
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (window.location.href.indexOf('registration') > -1) {
          this.registrationDashboard = true;
        } else {
          if (window.location.href.indexOf('contact') > -1) {
            this.registrationDashboard = true;
          } else {
            this.registrationDashboard = false;
          }
        }
        if (
          window.location.href.indexOf('profileSettings') > -1 ||
          window.location.href.indexOf('dashboard') > -1 ||
          window.location.href.indexOf('plans') > -1 ||
          window.location.href.indexOf('profile') > -1 ||
          window.location.href.indexOf('chat') > -1
        ) {
          this.dashboardFooter = true;
        } else {
          this.dashboardFooter = false;
        }
      });
  }
  showToaster(toaster) {
    this.toastr.info(toaster);
  }

  ngOnInit() {
    this.callservice.getcall().subscribe((message: string) => {
      const call = JSON.parse(message);
      if (call.noticondition == true) {
        this.router.navigate(['/profileSettings/chat']);
      }
    });
    AOS.init();
    document.documentElement.style.setProperty('--animate-duration', '2s');
    if (localStorage.hasOwnProperty('access_token')) {
    } else {
      return;
    }
  }
  ngAfterViewChecked() {
    // console.clear()
  }
  onActivate(event) {
    window.scroll(0, 0);
  }
}
