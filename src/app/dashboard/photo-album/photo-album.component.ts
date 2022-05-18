import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';

@Component({
  selector: 'app-photo-album',
  templateUrl: './photo-album.component.html',
  styleUrls: ['./photo-album.component.scss'],
})
export class PhotoAlbumComponent implements OnInit {
  upload = true;
  images:any=[];
  savedimages:any=[];
  constructor(private toastr: ToastrService, private http: HttpService) {}

  ngOnInit(): void {
    this.saveimages()
  }

  multiUpload(event) {
    if (event.target.files.length < 5) {
      LoaderServiceService.loader.next(true);
      this.toastr.error('Select atleast 5 pictures of yours');
      LoaderServiceService.loader.next(false);
      return;
    } else {
      if (typeof FileReader != 'undefined') {
        this.upload = false;
        var dvPreview: any = document.getElementById('dvPreview');
        dvPreview.innerHTML = '';
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
        for (var i = 0; i < event.target.files.length; i++) {
          var file = event.target.files[i];
          var img:any
          if (regex.test(file.name.toLowerCase())) {
            var reader = new FileReader();
            var image:any = []
            reader.onload = function (e: any) {
              img = document.createElement('IMG');
              img.src = e.target.result;
              img.height = '100';
              img.width = '100';
              dvPreview.appendChild(img);
              $(img).css('margin', '5px');
              image.push(img)
            };

            reader.readAsDataURL(file);
          } else {
            this.upload = true;
            this.toastr.error(file.name + ' is not a valid image file.');
            dvPreview.innerHTML = '';
            return;
          }
        }
        setTimeout(() => {
          this.images = []
          image.map((res:any)=>{
            this.images.push(res.src)
          })
        },500);

      } else {
        this.upload = true;
        this.toastr.error('This browser does not support HTML5 FileReader.');
      }
    }
  }
  save() {
    LoaderServiceService.loader.next(true);
    setTimeout(() => {
      this.http.post('/multiple_image', {image:this.images}, true).subscribe((res:any)=>{
        this.saveimages()
      })
      this.toastr.success('Pictures uploaded');
      LoaderServiceService.loader.next(false);
    },2000);
  }
  saveimages(){
    LoaderServiceService.loader.next(true);
    var dvPreview: any = document.getElementById('dvPreview');
    this.savedimages = []
    this.http.get('/multiple_image_show',true).subscribe((res:any)=>{
      res.multiple_image.map((res)=>{
        this.savedimages.push(res.name)
        dvPreview.innerHTML = '';
      })
      LoaderServiceService.loader.next(false);
})
  }
}
