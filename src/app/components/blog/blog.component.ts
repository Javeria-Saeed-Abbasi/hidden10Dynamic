import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  blogs;
  blogscms;
  constructor(
    public http: HttpService,
  ) { }

  ngOnInit() {

    this.http.get('/blogs', true).subscribe(
      (res)=>{
        LoaderServiceService.loader.next(true);
        this.blogs = res;
        LoaderServiceService.loader.next(false);
      },
      (err) => {
        if (err.status == 400) {
        }
      }
    )
    this.http.get('/blog_cms', true).subscribe(
      (res)=>{
        LoaderServiceService.loader.next(true);
        this.blogscms = res;
        LoaderServiceService.loader.next(false);
      },
      (err) => {
        if (err.status == 400) {
        }
      }
    )

  }

}
