import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobaldataService } from 'src/app/services/globaldata.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import  { NotificationService } from '../../services/notification.service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
// profile id
id;
// profile detail
profileDetail
myDetail
gender
notifications

  constructor(private notifiService: NotificationService, private http: HttpService, private route: ActivatedRoute,private toastr: ToastrService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.id=this.route.snapshot.paramMap.get("id");
    setTimeout(() => {
      this.getProfileDetail()
      this.getMyDetail()
      this.getNotifications()
      this.gender = localStorage.getItem('gender')
      this.notifiService.getnotificationlike().subscribe((noticondition: any) => {
        const notification = JSON.parse(noticondition);
        if (
          notification.noticondition == true &&
          notification.userData.userDataId == localStorage.getItem('userId')
        ) {
          this.getProfileDetail()
          this.getMyDetail()
          this.getNotifications()

        }
      });
    });
    GlobaldataService.connect.subscribe((res: any) => {
      if (res == true) {
        this.getProfileDetail()
        this.getNotifications()
        GlobaldataService.connect.next(false);
      }
      if(res == false) {
        return;
      }
      this.cd.detectChanges();
    });
    GlobaldataService.callConnection.subscribe((res: any) => {
      if (res == true) {
        LoaderServiceService.loader.next(true)
        GlobaldataService.callConnection.next(false);
        setTimeout(() => {
        LoaderServiceService.loader.next(false)
        }, 1000);
      }
      if(res == false) {
        return;
      }
      this.cd.detectChanges();
    });
  }
  getProfileDetail(){
    this.http.get(`/user_view/${this.id}`, true).subscribe((res:any)=>{
      this.profileDetail = res;
      console.log(res);
      this.getNotifications()
    })
  }
  getMyDetail(){
    this.http.get(`/user_view/${localStorage.getItem('userId')}`, true).subscribe((res:any)=>{
      this.myDetail = res;
      this.getNotifications()

    })
  }
  connect(){
    LoaderServiceService.loader.next(true);
    this.http.get(`/connect/${this.id}`, true).subscribe((res:any)=>{
      console.log('====================================');
      console.log(res);
      console.log('====================================');

      if(res?.message == "Hearts are not available"){
        this.toastr.error(res?.message)
      }
      else{
        if(res?.message == "You are already following"){
          this.toastr.error(`You are already connected with ${this.profileDetail?.user_details?.name}`)
        }
        else if(res?.request_sent == "request_sent"){
          this.toastr.success(`Request sent to ${this.profileDetail?.user_details?.name}`)
          this.getProfileDetail()
          GlobaldataService.connectRequest.next(true);
          this.notifiService.notification(true, {userDataId:this.profileDetail?.user_details.id, userDataName:localStorage.getItem('userData'), not:"sent you a request"});
        }
      }
      LoaderServiceService.loader.next(false);
    })
  }
  connected(){
    LoaderServiceService.loader.next(true);
    this.http.get(`/connection_disconnect/${this.id}`, true).subscribe((res:any)=>{
      if(res == 1){
        this.toastr.success(`Successfully disconnected with ${this.profileDetail?.user_details?.name}`)
        GlobaldataService.disconnected.next(true);
        this.notifiService.notification(true, {userDataId:this.profileDetail?.user_details.id, userDataName:localStorage.getItem('userData'), not:"disconnected you"});
        this.getProfileDetail()
        $("#confirmMod").trigger('click')
        LoaderServiceService.loader.next(false);
      }
      else{
        $("#confirmMod").trigger('click')
        LoaderServiceService.loader.next(false);
        return
      }
    })
  }
  getNotifications(){
    this.http.get('/notifications', true).subscribe((res:any)=>{
      if(res?.connect_details.length === 0 ){
        this.notifications = 0
      }
      else{
        res?.connect_details?.map((data: any, i) => {
          if (data.user_id == this.profileDetail?.user_details?.id) {
            this.notifications = data
          }
        });
      }
    })
  }
  acceptRequest(){
    LoaderServiceService.loader.next(true);
    this.http.get(`/accept_request/${this.id}`, true).subscribe((res:any)=>{
      console.log(res);
      this.notificationread()
      this.getProfileDetail()
      this.notifiService.notification(true, {userDataId:this.profileDetail?.user_details.id, userDataName:localStorage.getItem('userData'), not:"accepted your request"});
    LoaderServiceService.loader.next(false);
    })
  }
  declineRequest(){
    LoaderServiceService.loader.next(true);
    this.http.get(`/decline_request/${this.id}`, true).subscribe((res:any)=>{
      console.log(res);
      this.notificationread()
      this.getProfileDetail()
      this.notifiService.notification(true, {userDataId:this.profileDetail?.user_details.id, userDataName:localStorage.getItem('userData'), not:"decline your request"});
    LoaderServiceService.loader.next(false);
    })
  }
  notificationread() {
    this.http
      .post('/read_connection', { id: this.id }, true)
      .subscribe((res: any) => {
        if (res == 1) {
        }
      });
  }

}
