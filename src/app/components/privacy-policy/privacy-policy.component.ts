import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicySiteComponent implements OnInit {
privacyCms;
  constructor(private http:HttpService) { }

  ngOnInit(): void {
    this.getPrivacyCMS()
  }
  getPrivacyCMS(){
    LoaderServiceService.loader.next(true);
    this.http.get('/privacy_policy', true).subscribe((res:any)=>{
      this.privacyCms = res.privacy_policy;
      LoaderServiceService.loader.next(false);

    })
  }

}
