import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import * as moment from 'moment';
import { io } from 'socket.io-client';
import { HttpService } from 'src/app/services/http.service';
import { GlobaldataService } from 'src/app/services/globaldata.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import * as $ from 'jquery';
import { FormBuilder } from '@angular/forms';
import { CallService } from 'src/app/services/call.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

const SOCKET_ENDPOINT = 'localhost:3000';
// declare var callFunc: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  constructor(
    private chatService: ChatService,
    private callservice: CallService,
    private fb: FormBuilder,
    private http: HttpService,
    private testDiv: ElementRef<HTMLDivElement>,
    private cd: ChangeDetectorRef,
    private toaster: ToastrService,
    private route: ActivatedRoute,
  ) {
    // new callFunc();
  }
  friends;
  recivemessage: any = [];
  socket;
  messageInfo: any = {};
  chatBody: any = [];
  myData = GlobaldataService.mydata;
  mssageStatus = false;
  typingStatus;
  typingText;
  typinguserid;
  messages: any = [];
  userStatus;
  specificUser: any=[];
  mobileChat;
  connectionStatus;
  messageLength;
  onlineTrue;
  onlineStatus;
  id;
  profileImage=false;
  onlineUser;
  ngOnInit() {
    this.id=this.route.snapshot.paramMap.get("id");
    setTimeout(() => {
      this.chatService.onlineStatus().subscribe((online: string) => {
        const onlineStats = JSON.parse(online);
        console.log(online, 'ponlinestats');
        // console.log(onlineStats,"ponlinestats");
        this.getProfiles();
        this.friends?.map((v, i) => {
          if (v.id == onlineStats.user) {
            this.onlineTrue = true;
            this.chatDataAuto(v);
          }
        });
      });
      this.chatService.offlineStatus().subscribe((offline: string) => {
        const offlineStats = JSON.parse(offline);
        console.log(offline, 'ponlinestats');
        this.getProfiles();
        this.friends?.map((v, i) => {
          if (v.id == offlineStats.user) {
            this.onlineTrue = false;
            this.chatDataAuto(v);
          }
        });
      });
    }, 1000);
    if (window.innerWidth <= 540) {
      this.mobileChat = true;
    } else {
      // this.mobileChat = false;
    }
    this.recivemessage = [];
    this.chatService.getMessage().subscribe((message: string) => {
      const mssg = JSON.parse(message);
      this.recivemessage[0].push(mssg);
      this.messages = [];
      setTimeout(() => {
        this.scrollToBottom();
      });
    });

    this.getProfileData();
  }
  setupSocketConnection() {
    this.socket = io(SOCKET_ENDPOINT);
  }
  // typing status
  typing(event) {
    if (event.target.value.length > 1) {
      this.typingStatus = true;
      this.chatService.typing({
        user: this.myData?.id,
        status: this.typingStatus,
      });
    }
    if (event.target.value.length < 1) {
      this.typingStatus = false;
      this.chatService.typing({
        user: this.myData?.id,
        status: this.typingStatus,
      });
    }
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
  showtypingStatus() {
    this.chatService.display().subscribe((typing) => {
      this.typinguserid = typing.user;
      if (typing.status == true) {
        this.typingText = true;
        $('#text').text('typing...');
      } else {
        this.typingText = false;
        $('#text').text('');
      }
    });
  }
  chatData(friends) {
    this.mobileChat = false;
    this.chatBody = [];
    this.chatBody.push(friends);
    if (this.chatBody[0].login_status == '1') {
      this.onlineStatus = true;
    } else {
      this.onlineStatus = false;
    }
    this.mssageStatus = true;
    this.http
      .post(
        '/read_status',
        { id: this.chatBody[0].id, status: this.mssageStatus },
        true
      )
      .subscribe((res: any) => {});
    this.getMessage();
    setTimeout(() => {
      this.http
        .get(`/user_view/${this.chatBody[0].id}`, true)
        .subscribe((res: any) => {
          this.messageLength = this.recivemessage[0]?.length;
          this.connectionStatus = res?.connection_dual;
        });
    }, 1000);
  }
  chatDataAuto(friend) {
    if (this.onlineTrue == true) {
      this.onlineStatus = true;
    } else {
      this.onlineStatus = false;
    }
  }
  showImage(){
    this.profileImage = true;
  }
  SendMessage(event) {
    this.messageInfo = {};
    var text: any = $('#messageBox').val();
    this.messageLength = this.recivemessage[0]?.length;
    if (text.length > 0) {
      if (this.messageLength > 0 && this.connectionStatus == 0) {
        this.toaster.error(`First connect with ${this.chatBody[0]?.name}`);
        return;
      } else {
        const currentTime = new Date().toISOString();
        this.messageInfo = {
          receiver_id: this.chatBody[0].id,
          text,
          user_id: this.myData?.id,
          created_at: currentTime,
          dp: this.chatBody[0].profileIcon,
          readStatus: 'false',
          messageaction: true,
          username: localStorage.getItem('userData'),
        };
        this.chatService.sendMessage(this.messageInfo);
        event.target.value = '';
        if (event.target.classList.contains('fa-paper-plane')) {
          var messagebox: any = $(event.target.parentNode).find('#messageBox');
          messagebox[0].value = '';
        }
        this.store();
      }
    } else {
      return;
    }
  }
  getProfiles() {
    this.http.get('/user_details', true).subscribe((res: any) => {
      this.friends = res;
      this.friends.map((v, i) => {
        if(v.messages.length > 0 || v.message_recevie.length > 0){
          const result = this.friends.filter(friends => (friends.messages.length > 0 || friends.message_recevie.length > 0) && friends.id != this.myData.id)
          this.friends = result
          console.log('====================================');
          console.log(this.friends);
          console.log('====================================');
        }
        setTimeout(() => {
          if(v.id == this.id){
            if(this.friends.includes(this.id)){
              this.friends.splice(i, 1)
              return
          } else{
            this.friends.push(v)
          }
          console.log('====================================');
          console.log(this.friends);
          console.log('====================================');
          }
        });
      });
    });
  }
  store() {
    this.http
      .post(
        `/message_store/${this.chatBody[0].id}`,
        { text: this.messageInfo.text },
        true
      )
      .subscribe((res: any) => {
        for (let key in res) {
          if (
            res[key] ==
            'you are already sent the message wait for the reply or connection'
          ) {
            this.toaster.error(res[key]);
          }
          if (res[key] == 'successfully added') {
            this.toaster.success('First message successfully sent');
          }
          if (res[key] == 'Hearts are not available for messages') {
            this.toaster.error(res[key]);
          }
        }
      });
  }
  getMessage() {
    this.recivemessage = [];
    setTimeout(() => {
      this.http
        .get(`/message_show/${this.chatBody[0].id}`, true)
        .subscribe((res: any) => {
          this.recivemessage.push(res);
          setTimeout(() => {
            this.scrollToBottom();
          });
        });
    }, 1000);
  }
  getProfileData() {
    LoaderServiceService.loader.next(true);
    this.http.get('/my_profile', true).subscribe((res: any) => {
      this.myData = res.my_profile;
      this.getProfiles();
      LoaderServiceService.loader.next(false);
    });
  }
  callserviceFunc() {
    this.callservice.call(true, this.chatBody[0].id);
  }
}
