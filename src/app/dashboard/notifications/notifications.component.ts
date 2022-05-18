import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GlobaldataService } from 'src/app/services/globaldata.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications:any;
  show = false;
  showBtnRotate = false;
  constructor(private http:HttpService,
    private notifiService: NotificationService,
    private cd: ChangeDetectorRef
    ) {
    this.getNotifications()
   }

  ngOnInit(): void {
    GlobaldataService.connect.subscribe((res: any) => {
      this.getNotifications()
      if (res == true) {
        GlobaldataService.connect.next(false);
      }
      if(res == false) {
        return;
      }
      this.cd.detectChanges();
    });
  }

  getNotifications(){
    this.http.get('/notifications', true).subscribe((res:any)=>{
      console.log(res);

      res?.connect_details?.map((data: any, i) => {
        if (data.user_id != localStorage.getItem('userId')) {
            this.notifications = res.connect_details
            console.log(res);

        }
      });
      // if(res.connect_details.liked_id != localStorage.getItem('userId')){
      // }
    })
  }
  notificationread(notification) {
    this.http
      .post('/read_connection', { id: notification?.user_id }, true)
      .subscribe((res: any) => {
        if (res == 1) {
          // this.getNotification()
        }
      });
  }
  acceptRequest(notification){
    LoaderServiceService.loader.next(true);
    this.http.get(`/accept_request/${notification?.liked_id}`, true).subscribe((res:any)=>{
      console.log(res);
      LoaderServiceService.loader.next(false);
      this.notifiService.notification(true, {userDataId:notification?.user_id, userDataName:localStorage.getItem('userData'), not:"accepted your request"});
    })
  }
  declineRequest(notification){
    LoaderServiceService.loader.next(true);
    this.http.get(`/decline_request/${notification?.liked_id}`, true).subscribe((res:any)=>{
      console.log(res);
      LoaderServiceService.loader.next(false);
      this.notifiService.notification(true, {userDataId:notification?.user_id, userDataName:localStorage.getItem('userData'), not:"decline your request"});
    })
  }
}
