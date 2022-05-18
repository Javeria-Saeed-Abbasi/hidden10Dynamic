import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  contactusForm = this.fb.group({
    name: [null],
    email: [null],
    description: [null],
  });
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toaster: ToastrService
  ) {
    this.contactusForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      description: [null, Validators.required],
    });
  }

  ngOnInit(): void {}
  contactUs() {
    if (this.contactusForm.invalid) {
      Object.keys(this.contactusForm.controls).forEach((key) => {
        this.contactusForm.get(key)?.markAsTouched();
        return;
      });
    } else {
      this.http
        .post('/contact_inquriy', this.contactusForm.value, true)
        .subscribe((res: any) => {
          LoaderServiceService.loader.next(true);
          if(res.hasOwnProperty('messsage')){
            LoaderServiceService.loader.next(false);
            this.toaster.success("Your message has been delivered")
          }
        });
    }
  }
}
