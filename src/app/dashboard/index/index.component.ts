import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GlobaldataService } from 'src/app/services/globaldata.service';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { ChatService } from 'src/app/services/chat.service'
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  DreamHouseImg2: any = 'assets/SVG/profilePic.svg';
  profileImage;
  image;
  imageUploadForm = this.fb.group({
    image: this.fb.control('', [Validators.required]),
  });
  hideverifyBtn = false;
  selfie;
  gender;
  profile;
  // imageVerify;
  verificationForm = this.fb.group({
    relationship: [null],
    second_date: [null],
    break_up: [null],
    career: [null],
    ever_been_married: [null],
    smoke_marijuana: [null],
    use_drugs: [null],
    interested_in_marriage: [null],
    found_someone: [null],
    should_accept_member_hidden: [null],
    imageVerify: [],
  });
  constructor(
    public http: HttpService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private chatService: ChatService
  ) {}

  ngOnInit(): void {
    this.showprofileimage()
    GlobaldataService.callConnection.subscribe((res: any) => {
      console.log(res, 'callconectionstat');
      if (res == true) {
        GlobaldataService.callConnection.next(false);
      }
      if(res == false) {
        return;
      }
      this.cd.detectChanges();
    });
  }
  showprofileimage(){
    LoaderServiceService.loader.next(true);
    this.http.get('/my_profile',true).subscribe((res:any)=>{
      this.profile = res;
      this.gender = res.my_profile.gender;
      var profileImage:any = res?.my_profile?.image
      localStorage.setItem('ProfileImage', profileImage)
      GlobaldataService.profileImage = profileImage
      GlobaldataService.profileCondition.next(true)
      this.image = res?.my_profile?.image;
      LoaderServiceService.loader.next(false);
    })
  }
  logout() {
    LoaderServiceService.loader.next(true);
    this.http.get('/logout', true).subscribe(
      (res: any) => {
        this.chatService.offline({user:this.profile?.my_profile?.id})
        localStorage.clear();
        LoaderServiceService.loader.next(false);
        this.router.navigate(['']);
      },
      (err) => {
        if (err.status == 400) {
          console.log(err);
        }
      }
    );
  }
  //FileUpload
  readUrl(event: any) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var img
    reader.onloadend = function() {
      img = reader.result
    }
    setTimeout(() => {
      console.log('RESULT', img)
      this.profileImage = img
      GlobaldataService.profileImageBase = this.profileImage
      this.imageUploadForm.patchValue({
        image: this.profileImage
      });
    }, 100);

    console.log(reader.readAsDataURL(file),"file csutom");


    LoaderServiceService.loader.next(true);
    setTimeout(() => {
      this.http.post("/user_update", {image:this.imageUploadForm.value}, true).subscribe((res:any)=>{
        LoaderServiceService.loader.next(false);
        this.showprofileimage()
      })
    }, 200);
  }
  //selfie verifiaction
  readselfie(event: any) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      $('.verifyBtn').removeAttr("disabled")
      let file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.selfie = reader.result;
        this.verificationForm.patchValue({
          imageVerify:reader.result
        });
      };

    } else {
      return;
    }
  }
  verify(){
    LoaderServiceService.loader.next(true);
    this.http.post('/image_verification', this.verificationForm.value ,true).subscribe((res:any)=>{
      console.log('====================================');
      console.log(res);
      console.log('====================================');
      if(res.hasOwnProperty('image_verification')){
        this.showprofileimage()
      }
      $(".danger").trigger('click')
      LoaderServiceService.loader.next(false);
      this.toastr.success("Your picture is send for verification")
    })
  }
}
