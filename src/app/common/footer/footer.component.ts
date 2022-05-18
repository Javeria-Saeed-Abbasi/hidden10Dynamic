import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  resgistration;
  logoCms;
  constructor(private router: Router, public http: HttpService,) {

    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (
          window.location.href.indexOf('registration') > -1
        ) {
          this.resgistration = true;
        } else {
          this.resgistration = false;
        }
      });
   }

  ngOnInit(): void {


    this.http.get('/home', true).subscribe(
      (res)=>{
        this.logoCms = res;;

      },)
    }
}
