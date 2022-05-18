import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
// faqs
faqs;
  constructor(private http:HttpService) { }

  ngOnInit(): void {
    this.getFaqs()
  }
  getFaqs(){
    LoaderServiceService.loader.next(true);
    this.http.get('/faqs', true).subscribe((res)=>{
      this.faqs = res;
      LoaderServiceService.loader.next(false);
    })
  }

}
