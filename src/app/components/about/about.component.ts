import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
// about us
aboutUs;
  constructor(private http:HttpService) { }

  ngOnInit(): void {
    this.getAbout()
  }
  getAbout(){
    LoaderServiceService.loader.next(true);
    this.http.get('/about-us', true).subscribe((res)=>{
      this.aboutUs = res;
      LoaderServiceService.loader.next(false);
    })
  }
}
