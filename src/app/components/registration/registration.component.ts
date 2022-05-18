import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobaldataService } from 'src/app/services/globaldata.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { HttpService } from '../../services/http.service';
import * as $ from 'jquery';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  profile
  testPattern = new RegExp('^(\\+)?(\\d+)$');
  // terms button
  btnTerms = true;
  gender = false;
  // registration form
  registration = this.fb.group({
    name: [null],
    last_name: [null],
    gender: [null],
    date: [null],
    month: [null],
    year: [null],
    phone_number: [null],
    email: [null],
    password: [null],
    otp: [null],
    type: [null],
  });
  // access token
  access_token;
  constructor(
    private fb: FormBuilder,
    public http: HttpService,
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    private chatService: ChatService
  ) {
    // registration form
    this.registration = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
      name: [null, Validators.required],
      last_name: [null],
      gender: ['men', Validators.required],
      date: [null, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      month: [null, [Validators.required, Validators.pattern('^[1-9][0-9]*$')]],
      year: [null, [Validators.required, Validators.pattern('^[12][0-9]{3}$')]],
      phone_number: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^[(][1-9][0-9][0-9][)][0-9][0-9][0-9][-][0-9][0-9][0-9][0-9][0-9]*$'
          ),
        ],
      ],
      otp: [null],
      type: 'user',
    });
  }

  ngOnInit(): void {
  }

  register(event) {
    if (this.registration.invalid) {
      return;
    } else {
      this.http.post('/register', this.registration.value, false).subscribe(
        (res: any) => {
          this.access_token = res.access_token;
          localStorage.setItem('access_token', this.access_token);
          if (res.hasOwnProperty('access_token')) {
            this.toastr.success('User register successfully');

            this.getProfileData();
          }
          else if(res.hasOwnProperty('email') == "The email has already been taken."){
            this.toastr.success('The email has already been taken.');
            return
          } else {
            return;
          }
          this.router.navigate(['/dashboard']);
          $('.close').trigger('click');
        },
        (err) => {
          this.toastr.error(err.error.messsage);
          if (err.status == 400) {
          }
        }
      );
    }
  }
  verify() {
    if (this.registration.invalid) {
      Object.keys(this.registration.controls).forEach((key) => {
        this.registration.get(key)?.markAsTouched();
        return;
      });
    } else {
      this.http
        .post('/otp', { email: this.registration.value.email }, false)
        .subscribe(
          (res: any) => {
            this.toastr.success(res.messsage);
            if (res.status == 200) {
              $('.otpModal').trigger('click');
            }
          },
          (err) => {
            this.toastr.error(err.error.messsage);
            if (err.status == 400) {
            }
          }
        );
    }
  }
  onOtpChange(event) {
    if (event.length == 4) {
      this.registration.value.otp = event;
      $('.registerBtn').prop('disabled', false);
    } else {
      return;
    }
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  terms(event) {
    if (event.target.checked == false) {
      this.btnTerms = false;
    } else {
      this.btnTerms = true;
    }
  }
  getProfileData() {
    LoaderServiceService.loader.next(true);
    this.http.get('/my_profile', true).subscribe((res: any) => {
      this.chatService.online({ user: res?.my_profile?.id });
      this.profile = res
      GlobaldataService.mydata = res;
      LoaderServiceService.loader.next(false);
      localStorage.setItem('userId', res?.my_profile?.id);
      localStorage.setItem('userData', res?.my_profile?.name);
    });
  }


  showPass(event) {
    event.target.classList.toggle('fa-eye-slash');
    var inputField = $(event.target.parentNode).find('.passwordInp');
    if ($(event.target).hasClass('fa-eye-slash')) {
      $(inputField).attr('type', 'text');
    } else {
      $(inputField).attr('type', 'password');
    }
  }
  signInmodal() {
    GlobaldataService.signinModal.next(true);
    this.router.navigate(['']);
    setTimeout(() => {
      $('.signin').trigger('click');
    });
  }

  numberKeyup(event) {
    if (
      event.target.value.length == 1
    ){
      $('#phone_number').val('(');
    }
    if (
      event.target.value.length == 4
    ){
      var oldVal =  $('#phone_number').val()
      $('#phone_number').val(oldVal+')');
    }
    if (
      event.target.value.length == 8
    ){
      var oldVal =  $('#phone_number').val()
      $('#phone_number').val(oldVal+'-');
    }
  }
}
