import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import SwiperCore, { SwiperOptions, Pagination } from 'swiper';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Router, NavigationEnd } from '@angular/router';
import { TruncateModule } from 'ng2-truncate'
import { filter } from 'rxjs/operators';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { GlobaldataService } from 'src/app/services/globaldata.service';
SwiperCore.use([Pagination]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // access_token
  access_token;
  // profiles
  dashboard;
  src
  userId;
  faArrowRight = faArrowRight;
  section = false;
  Aboutsection = false;
  constructor(private router:Router, private http: HttpService, private cd: ChangeDetectorRef) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (window.location.href.indexOf("landingPage") > -1) {
        this.section = true;
      }
      else if((window.location.href.indexOf("") > -1)){
        this.Aboutsection = true;
      }
    });
   }
   ngAfterViewChecked(){
     this.access_token = localStorage.getItem("access_token")
     this.userId = localStorage.getItem('userId')
   }
  ngOnInit(): void {
    this.getProfiles()
    GlobaldataService.signin.subscribe((res: any) => {
      this.getProfiles()
      if (res == true) {
        GlobaldataService.signin.next(false);
      }
      if(res == false) {
        return;
      }
      this.cd.detectChanges();
    });
  }
  config: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 50,
    navigation: false,
  };
  getProfiles(){
    LoaderServiceService.loader.next(true);
    this.http.get('/home', true).subscribe((res:any)=>{
      this.dashboard = res;
      this.src = this.dashboard?.short_title?.image;
      var video:any = $("#aboutVideo")
      video[0].src = this.dashboard?.short_title?.image
      res?.latest_user.map((res, index)=>{
        if(res.id == localStorage.getItem('userId'))
        this.dashboard.latest_user.splice(index,1)
      })
      setTimeout(() => {
        LoaderServiceService.loader.next(false);
      }, 1000);
    })


  }

}
