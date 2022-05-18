import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  access_token = localStorage.getItem('access_token');
  // cahnge password form
  changePasswordForm = this.fb.group({
    password: [null],
    confirmpassword: [null],
  });
  constructor(
    private fb: FormBuilder,
    public http: HttpService,
    private toastr: ToastrService
  ) {
    // change password form
    this.changePasswordForm = this.fb.group({
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
      confirmpassword: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-8])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
          ),
        ],
      ],
    });
  }

  ngOnInit() {}
  update() {
    if (this.changePasswordForm.invalid) {
      Object.keys(this.changePasswordForm.controls).forEach((key) => {
        this.changePasswordForm.get(key)?.markAsTouched();
        return;
      });
    }
    if (
      this.changePasswordForm.get('password')?.value !=
      this.changePasswordForm.get('confirmpassword')?.value
    ) {
      this.toastr.error('Password and confirm password do not match');
      return;
    }
    if (
      this.changePasswordForm.get('password')?.value == null ||
      this.changePasswordForm.get('confirmpassword')?.value == null
    ) {
      return;
    } else {
      LoaderServiceService.loader.next(true);
      this.http
        .post(`/password_update`, this.changePasswordForm.value, true)
        .subscribe(
          (res: any) => {
            LoaderServiceService.loader.next(false);
            this.toastr.success(res.messsage);
          },
          (err) => {
          }
        );
    }
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
}
