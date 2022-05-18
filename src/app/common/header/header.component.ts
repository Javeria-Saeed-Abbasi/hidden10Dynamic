import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
import { filter } from 'rxjs/operators';
import { ChatService } from 'src/app/services/chat.service';
import { GlobaldataService } from 'src/app/services/globaldata.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  dashboard = false;
  contactFooter = false;
  mobileNav: boolean = false;
  scrollTop = 0;
  contactDashboard = false;
  filterBtn = false;
  addColor = true;
  chatdropDown = false;
  notidropDown = false;
  signRegister = true;
  header_logo;
  chatList: any = [];
  chatDropDownItem;
  chatBadge: any = [];
  notiList: any = [];
  notiDropDownItem;
  notificationBadge: any = [];
  profile;
  // access token
  access_token;
  // my data
  mydata;
  profileImg;
  hearts;
  userId = localStorage.getItem('userId');
  loginForm = this.fb.group({
    email: [null],
    password: [null],
  });
  resetForm = this.fb.group({
    email: [null],
  });
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private elementRef: ElementRef,
    public http: HttpService,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private chatService: ChatService,
    private notifiService: NotificationService
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (
          window.location.href.indexOf('dashboard') > -1 ||
          window.location.href.indexOf('profileSettings') > -1 ||
          window.location.href.indexOf('profile') > -1 ||
          window.location.href.indexOf('plans') > -1
        ) {
          this.dashboard = true;
        } else {
          this.dashboard = false;
        }
        if (window.location.href.indexOf('contact') > -1) {
          this.contactDashboard = true;
        } else {
          this.contactDashboard = false;
        }
        if (window.location.href.indexOf('dashboard') > -1) {
          this.filterBtn = true;
        } else {
          this.filterBtn = false;
        }
        if (window.location.href.indexOf('policyPrivacy') > -1) {
          this.addColor = false;
        } else {
          this.addColor = true;
        }
        // login form
        this.loginForm = this.fb.group({
          email: [null, [Validators.required, Validators.email]],
          password: [
            null,
            [
              Validators.required,
              Validators.pattern(
                '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
              ),
            ],
          ],
          type: 'user',
        });
        // login form
        this.resetForm = this.fb.group({
          email: [null, [Validators.required, Validators.email]],
        });
      });
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.chatService.onlineStatus().subscribe((online: string) => {
        // this.getProfileData()
      });
    });
    GlobaldataService.signinModal.subscribe((res: any) => {
      setTimeout(() => {
        this.navToggle()
      }, 1500);
      if (res == true) {
        GlobaldataService.signin.next(false);
      }
      if(res == false) {
        return;
      }
      this.cd.detectChanges();
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (
          window.location.href.indexOf('dashboard') > -1 ||
          window.location.href.indexOf('profileSettings') > -1 ||
          window.location.href.indexOf('profile') > -1 ||
          window.location.href.indexOf('plans') > -1
        ) {
          this.dashboard = true;
        } else {
          this.dashboard = false;
        }
        if (window.location.href.indexOf('contact') > -1) {
          this.contactDashboard = true;
        } else {
          this.contactDashboard = false;
        }
        if (window.location.href.indexOf('dashboard') > -1) {
          this.filterBtn = true;
        } else {
          this.filterBtn = false;
        }
        if (window.location.href.indexOf('policyPrivacy') > -1) {
          this.addColor = false;
        } else {
          this.addColor = true;
        }
        // login form
        this.loginForm = this.fb.group({
          email: [null, [Validators.required, Validators.email]],
          password: [
            null,
            [
              Validators.required,
              Validators.pattern(
                '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
              ),
            ],
          ],
          type: 'user',
        });
        // login form
        this.resetForm = this.fb.group({
          email: [null, [Validators.required, Validators.email]],
        });
      });

    if (window.innerWidth < 1024) {
      this.mobileNav = true;
    } else {
      this.mobileNav = false;
    }
    this.http.get('/home', true).subscribe((res: any) => {
      LoaderServiceService.loader.next(true);
      this.header_logo = res;
      LoaderServiceService.loader.next(false);
    });
    if (localStorage.hasOwnProperty('access_token')) {
      this.notifiService.getnotification().subscribe((noticondition: any) => {
        const notification = JSON.parse(noticondition);
        if (
          notification.noticondition == true &&
          notification.userData.userDataId == localStorage.getItem('userId')
        ) {
          this.showToaster(
            `${notification.userData.userDataName} ${notification.userData.not}`
          );
          this.getNotification();
        GlobaldataService.connectRequest.next(true);
        }
      });
      this.chatService.getNewMessage().subscribe((message: any) => {
        const messageNoti = JSON.parse(message);
        if (
          messageNoti.messageaction == true &&
          messageNoti.receiver_id == localStorage.getItem('userId')
        ) {
          this.showToaster(`${messageNoti.username} send you a message`);
          this.getChats();
        }
      });
      this.getProfileData();
      this.getChats();
      this.getNotification();
    } else {
      return;
    }
    this.observe();
    // after message update hearts

  }
  showToaster(toaster) {
    this.toastr.info(toaster);
  }
  logout() {
    LoaderServiceService.loader.next(true);
    this.http.get('/logout', true).subscribe(
      (res: any) => {
        this.chatService.offline({ user: this.profile?.my_profile?.id });
        localStorage.clear();
        this.navToggle();
        LoaderServiceService.loader.next(false);
        this.router.navigate(['']);
      },
      (err) => {
        if (err.status == 400) {
        }
      }
    );
  }
  ngAfterViewChecked() {
    if (localStorage.hasOwnProperty('access_token')) {
      this.signRegister = false;
    } else {
      this.signRegister = true;
    }
    if (window.innerWidth < 1024) {
      this.mobileNav = true;
    } else {
      this.mobileNav = false;
    }
  }
  async observe() {
    GlobaldataService.profileCondition.subscribe((res: any) => {
      if (res == true) {
        GlobaldataService.profileCondition.next(false);
        this.getProfileData();
        this.profileImg = GlobaldataService.profileImage;
      } else {
        return;
      }
      this.cd.detectChanges();
    });
    GlobaldataService.connect.subscribe((res: any) => {
      if (res == true) {
        GlobaldataService.connect.next(false);
        LoaderServiceService.loader.next(true);
        this.getProfileData();
        setTimeout(() => {
          LoaderServiceService.loader.next(false);
        }, 1000);
      }
      if (res == false) {
        return;
      }
      this.cd.detectChanges();
    });
    GlobaldataService.connectRequest.subscribe((res: any) => {
      if (res == true) {
        GlobaldataService.connect.next(false);
        LoaderServiceService.loader.next(true);
        this.getProfileData();
        setTimeout(() => {
          LoaderServiceService.loader.next(false);
        }, 1000);
      }
      if (res == false) {
        return;
      }
      this.cd.detectChanges();
    });
    GlobaldataService.disconnected.subscribe((res: any) => {
      if (res == true) {
        GlobaldataService.disconnected.next(false);
        LoaderServiceService.loader.next(true);
        this.getProfileData();
        setTimeout(() => {
          LoaderServiceService.loader.next(false);
        }, 1000);
      }
      if (res == false) {
        return;
      }
      this.cd.detectChanges();
    });
  }
  @HostListener('window:scroll', ['$event']) onScrollEvent() {
    this.scrollTop = window.pageYOffset;
  }

  navToggle() {
    var btn = <HTMLInputElement>document.getElementById('btn');
    var box = <HTMLInputElement>document.getElementById('box');
    var burgerBg = <HTMLInputElement>document.getElementById('burgerBg');

    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
      box.classList.remove('active');
      burgerBg.classList.add('burgerBg');
    } else {
      btn.classList.add('active');
      box.classList.add('active');
      burgerBg.classList.remove('burgerBg');
    }
  }

  clickONNotiTab() {
    this.router.navigate(['/profileSettings']);
    setTimeout(() => {
      $('#v-pills-notifications-tab').trigger('click');
    });
  }
  notificationread(notification) {
    this.http
      .post('/read_connection', { id: notification?.user_id }, true)
      .subscribe((res: any) => {
        if (res == 1) {
          this.getNotification()
        }
      });
  }

  myFunction(event) {
    if (
      $(event.target.parentNode.parentNode).find('.dropdown-content')[0].id ==
      'msgBtn'
    ) {
      this.chatdropDown = !this.chatdropDown;
    }
    if (
      $(event.target.parentNode.parentNode).find('.dropdown-content')[0].id ==
      'notiBtn'
    ) {
      this.notidropDown = !this.notidropDown;
    }
  }
  getChats() {
    // this.http.get('/message_latest', true).subscribe((res: any) => {
    //   console.log('====================================');
    //   console.log(res);
    //   console.log('====================================');
    //   res?.map((res: any, i) => {
    //     if (res.user_id != localStorage.getItem('userId')) {
    //       this.chatList=[]
    //       this.chatList.push(res);
    //     }
    //   });
    //   if (this.chatList.length <= 5) {
    //     this.chatDropDownItem = this.chatList;
    //     this.chatDropDownItem.map((res) => {
    //       this.chatBadge=[]
    //       if (
    //         res?.read_status == '0' &&
    //         res?.receiver_id != localStorage.getItem('userId')
    //       ) {
    //         this.chatBadge.push(res.status);
    //       }
    //     });
    //   } else {
    //     this.chatDropDownItem = this.chatList.slice(0, 5);
    //   }
    // });
  }
  routeChat(user_id){
    this.router.navigate([`/profileSettings/chat/${user_id}`]);
  }
  getNotification() {
    this.http.get('/notifications', true).subscribe((res: any) => {
      res?.connect_details?.map((data: any, i) => {
        if (data.user_id != localStorage.getItem('userId')) {
          this.notiList=[]
          this.notiList.push(data);
        }
      });
      if (this.notiList.length <= 5) {
        this.notiDropDownItem = this.notiList;
        this.notiDropDownItem.map((data) => {
          this.notificationBadge=[]
          if (data.notification_status == '0') {
            this.notificationBadge.push(data.status);
          }
        });
      } else {
        this.notiDropDownItem = this.notiList.slice(0, 5);
      }
      // chat dropdown
      res?.massage_details?.map((data: any, i) => {
        if (data.user_id != localStorage.getItem('userId')) {
          this.chatList=[]
          this.chatList.push(data);
        }
      });
      if (this.chatList.length <= 5) {
        this.notiDropDownItem = this.chatList;
        this.notiDropDownItem.map((data) => {
          this.notificationBadge=[]
          if (data.notification_status == '0') {
            this.notificationBadge.push(data.status);
          }
        });
      } else {
        this.notiDropDownItem = this.chatList.slice(0, 5);
      }
    });
  }
  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    if (target.id == 'noti' || target.className == 'notificationBdage') {
      if ((this.chatdropDown = true)) {
        this.chatdropDown = false;
      }
    }
    if (target.id == 'chatIco' || target.className == 'notificationBdage') {
      if ((this.notidropDown = true)) {
        this.notidropDown = false;
      }
    }
    $('.dropBtn a').on('click', () => {
      if ((this.chatdropDown = true)) {
        this.chatdropDown = false;
      }
    });
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (!clickedInside) {
      if ((this.chatdropDown = true)) {
        this.chatdropDown = false;
      }
      if ((this.notidropDown = true)) {
        this.notidropDown = false;
      }
    }
  }
  filterSideBar() {
    $('.filterSideBar').toggleClass('addTransform');
    if ($('.filterSideBar').hasClass('addTransform')) {
      $('.filterSideBar').css('transform', 'translateX(0)');
    } else {
      $('.filterSideBar').css('transform', 'translateX(-100%)');
    }
  }
  login() {
    LoaderServiceService.loader.next(true);
    if (this.loginForm.invalid) {
      LoaderServiceService.loader.next(false);
      return;
    } else {
      this.http.post('/login', this.loginForm.value, false).subscribe(
        (res: any) => {
          LoaderServiceService.loader.next(false);
          if (res.hasOwnProperty('message')) {
            this.toastr.error(res.message);
          } else if (res.hasOwnProperty('error')) {
            this.toastr.error(res.message);
          } else {
            if (res.hasOwnProperty('access_token')) {
              this.router.navigate(['/dashboard']);
              GlobaldataService.signin.next(true);
              this.toastr.success('Logged In');
              this.access_token = res.access_token;
              localStorage.setItem('access_token', this.access_token);
              setTimeout(() => {
                this.getProfileData();
              });
              $('.close').trigger('click');
            } else {
              return;
            }
          }
        },
        (err) => {
          if (err.status == 400) {
          }
        }
      );
    }
  }
  reset() {
    LoaderServiceService.loader.next(true);
    if (this.resetForm.invalid) {
      LoaderServiceService.loader.next(false);
      return;
    } else {
      this.http.post('/reset', this.resetForm.value, false).subscribe(
        (res: any) => {
          LoaderServiceService.loader.next(false);
          if(res.hasOwnProperty('wrong_email')){
            this.toastr.error("Sorry your email is not registered")
          }
          if(res.hasOwnProperty('Email_link')){
            this.toastr.success("Link sent to your email")
          }
        },
        (err) => {
          if (err.status == 400) {
          }
        }
      );
    }
  }
  getProfileData() {
    LoaderServiceService.loader.next(true);
    this.http.get('/my_profile', true).subscribe((res: any) => {
      GlobaldataService.mydata = res;
      this.profile = res;
      this.hearts = res?.my_profile?.hearts;
      this.mydata = res;
      this.chatService.online({ user: res?.my_profile?.id });
      localStorage.setItem('userId', res?.my_profile?.id);
      localStorage.setItem('userData', res?.my_profile?.name);
      localStorage.setItem('gender', res?.my_profile?.gender);
      // profile image
      this.profileImg = GlobaldataService.profileImage;
      this.profileImg = res?.my_profile?.image;
      LoaderServiceService.loader.next(false);
    });
  }
  facebook() {
    this.http.get('/google', false).subscribe((res: any) => {});
  }
  showPass(event) {
    event.target.classList.toggle('fa-eye-slash');
    var inputField = $(event.target.parentNode).find('.passwordInp');
    if ($(event.target).hasClass('fa-eye-slash')) {
      $(inputField).attr('type', 'text');
    } else {
      $(inputField).attr('type', 'password');
    }
  }
  acceptRequest(notification){
    LoaderServiceService.loader.next(true);
    this.http.get(`/accept_request/${this.mydata.my_profile.id}`, true).subscribe((res:any)=>{
      console.log(res);
      LoaderServiceService.loader.next(false);
      this.notifiService.notification(true, {userDataId:notification?.user_id, userDataName:localStorage.getItem('userData'), not:"accepted your request"});
    })
  }
  declineRequest(notification){
    LoaderServiceService.loader.next(true);
    this.http.get(`/decline_request/${this.mydata.my_profile.id}`, true).subscribe((res:any)=>{
      console.log(res);
      LoaderServiceService.loader.next(false);
      this.notifiService.notification(true, {userDataId:notification?.user_id, userDataName:localStorage.getItem('userData'), not:"decline your request"});
    })
  }
}
