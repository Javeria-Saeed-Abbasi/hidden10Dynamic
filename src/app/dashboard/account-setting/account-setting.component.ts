import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import * as $ from 'jquery';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
@Component({
  selector: 'app-account-setting',
  templateUrl: './account-setting.component.html',
  styleUrls: ['./account-setting.component.scss']
})
export class AccountSettingComponent implements OnInit {
 // cahnge password form
 deactivateForm = this.fb.group({
  password: [null]
});
  constructor(private fb: FormBuilder,
    public http: HttpService,
    private toastr: ToastrService,
    private router: Router) {
      // change password form
    this.deactivateForm = this.fb.group({
      password: [null, Validators.required],
    });
    }

  ngOnInit(): void {
  }

  deactivate(){
    LoaderServiceService.loader.next(true);
    if (this.deactivateForm.invalid) {
      Object.keys(this.deactivateForm.controls).forEach((key) => {
        this.deactivateForm.get(key)?.markAsTouched();
        return;
      });
    }
    this.http.post('/account_deactivate',this.deactivateForm.value,true).subscribe((res:any)=>{
      if(res.message == "Password does not match"){
        LoaderServiceService.loader.next(false);
        this.toastr.error("Password does not match")
      }
      else if(res.message == "User account has been successfully deactivate"){
        $("#modalClose").trigger('click')
        this.http.get('/logout', true).subscribe(
          (res: any) => {
            localStorage.clear();
            this.router.navigate(['']);
          }),
          (err) => {
            if (err.status == 400) {
            }
          }
          LoaderServiceService.loader.next(false);
      }
      else{
        LoaderServiceService.loader.next(false);
        this.toastr.error(res.message)
      }
    })
  }
}
