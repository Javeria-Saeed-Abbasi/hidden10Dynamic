import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GlobaldataService } from 'src/app/services/globaldata.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-like-likeby',
  templateUrl: './like-likeby.component.html',
  styleUrls: ['./like-likeby.component.scss']
})
export class LikeLikebyComponent implements OnInit {
  myLikes:any = [
  ]
  likedBy:any = [
  ]

  constructor(private http:HttpService, private cd: ChangeDetectorRef,private notifiService: NotificationService) { }

  ngOnInit(): void {
    this.MyLikes()
    this.LikedBY()
    this.notifiService.getnotificationlike().subscribe((noticondition: any) => {
      const notification = JSON.parse(noticondition);
      if (
        notification.noticondition == true &&
        notification.userData.userDataId == localStorage.getItem('userId')
      ) {
        this.MyLikes()
        this.LikedBY()
      }
    });
  }
  MyLikes(){
    LoaderServiceService.loader.next(true);
    this.http.get('/liked', true).subscribe((res:any)=>{
      this.myLikes = res;
      LoaderServiceService.loader.next(false);
    })
  }
  LikedBY(){
    LoaderServiceService.loader.next(true);
    this.http.get('/liked_by', true).subscribe((res:any)=>{
      this.likedBy = res
      LoaderServiceService.loader.next(false);
    })
  }
}
