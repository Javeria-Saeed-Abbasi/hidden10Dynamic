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
  showNot = false
  faultyData
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
      res.request_connect.map((data: any, i) => {
          if(Object.keys(res.connect_details).length == 0 && Object.keys(res.request_connect).length != 0){
            this.notifications = res.request_connect
            if(Object.keys(res.connect_details).length != 0 && Object.keys(res.request_connect).length != 0){
              this.notifications = res.connect_details
            }
            this.showNot = true;
          }
          if(Object.keys(res.connect_details).length != 0 && Object.keys(res.request_connect).length != 0){
            this.notifications = res.request_connect
            this.showNot = false;
          }
      });
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
    this.http.get(`/accept_request/${notification?.user_id}`, true).subscribe((res:any)=>{
      console.log(res);
      this.getNotifications()
      LoaderServiceService.loader.next(false);
      this.notifiService.notification(true, {userDataId:notification?.user_id, userDataName:localStorage.getItem('userData'), not:"accepted your request"});
    })
  }
  declineRequest(notification){
    LoaderServiceService.loader.next(true);
    this.http.get(`/decline_request/${notification?.user_id}`, true).subscribe((res:any)=>{
      console.log(res);
      this.getNotifications()
      LoaderServiceService.loader.next(false);
      this.notifiService.notification(true, {userDataId:notification?.user_id, userDataName:localStorage.getItem('userData'), not:"decline your request"});
    })
  }
}
