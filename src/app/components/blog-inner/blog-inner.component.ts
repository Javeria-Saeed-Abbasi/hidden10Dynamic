import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-blog-inner',
  templateUrl: './blog-inner.component.html',
  styleUrls: ['./blog-inner.component.scss']
})
export class BlogInnerComponent implements OnInit {
// blog id
id
// blog
blog;
  constructor(public http: HttpService, private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get("id");
    setTimeout(() => {
     this.getBlog()
    });
  }
  getBlog(){
    LoaderServiceService.loader.next(true);
    this.http.get(`/blog_details/${this.id}`, true).subscribe((res)=>{
      this.blog = res;
      LoaderServiceService.loader.next(false);
    })
  }
}
