import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { LoaderServiceService } from '../services/loader-service.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public show: boolean = false;

  constructor(
    private cd:ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {

  }

  ngOnInit() {
    this.observe()
   }

  ngOnDestroy() { }

  async observe(){
    LoaderServiceService.loader.subscribe((res:any)=>{
      this.show = res;
      if(this.show == true){
              this.document.body.classList.add('bodyLoader');
      }
      else{
        this.document.body.classList.remove('bodyLoader');
      }
      this.cd.detectChanges();
    })
  }

}
