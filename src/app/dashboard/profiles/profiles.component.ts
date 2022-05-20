import { Options } from '@angular-slider/ngx-slider';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { GeolocationPositionError } from '@apirtc/apirtc';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';


@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
})
export class ProfilesComponent implements OnInit {
  // specificLocation
  specificLocation
  // packagesData
  packagesData
  // limitedMinValue: number = 40;
  simpleSliderControl: FormControl = new FormControl(100);
  planPage = false;
  // Simple slider option
  simpleSliderOptions: Options = {
    floor: 0,
    ceil: 100,
  };
  progressBarVal;
  filterUsers;
  lat;
  lng;
  location;
  allCountries: any = [];
  countriesData: any = [];
  filteredCountries;
  matchSettingForm = this.fb.group({
    age_from: [null],
    age_to: [null],
    height_from: [null],
    height_to: [null],
    browsing_from: [null],
    browsing_to: [null],
    specific_location: [null],
  });
  constructor(private router: Router, private http:HttpService, private fb:FormBuilder, private toaster:ToastrService) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (
          window.location.href.indexOf('packages') > -1
        ) {
          this.planPage = true;
        } else {
          this.planPage = false;
        }
      });
      this.matchSettingForm = this.fb.group({
        age_from: [null],
        age_to: [null],
        height_from: [null],
        height_to: [null],
        browsing_from: [null],
        browsing_to: [null],
        specific_location: [null],
      });
      this.getLocation()
      this.defaultUser()
  }
  toggleSec(event){
    if(event.target.checked){
      this.specificLocation = true;
    }
    else{
      this.specificLocation = false;
    }
  }
  getCountries() {
    LoaderServiceService.loader.next(true);
    this.http.getCountry().subscribe((res: any) => {
      res.map((item) => {
        this.countriesData.push(item);
        this.allCountries.push(item.country);
        LoaderServiceService.loader.next(false);
      });
      const country = [...new Set(this.allCountries)];
      country.sort();
      this.filteredCountries = country;
    });
  }
  ngOnInit(): void {
    this.getPackages()
    this.myProfile()
    this.getCountries()
  }
  getPackages(){
    LoaderServiceService.loader.next(true);
    this.http.get('/packages', true).subscribe((res:any)=>{
      this.packagesData = res.packages;
      LoaderServiceService.loader.next(false);
    })
  }
  update(){
    LoaderServiceService.loader.next(true);
    this.http.post('/dashboard_filter', this.matchSettingForm.value, true).subscribe((res:any)=>{
      this.filterUsers = res;
      this.filterUsers.map((v,i)=>{
        if(v.id == localStorage.getItem('userId')){
          const result = this.filterUsers.filter(friends => friends.id == localStorage.getItem('userId'))
          this.filterUsers = result
        }
      })
      LoaderServiceService.loader.next(false);
      $("#filterBtn").trigger("click")
    })
  }
  defaultUser(){
    LoaderServiceService.loader.next(true);
    this.http.post('/dashboard_filter', this.location, true).subscribe((res:any)=>{
      this.filterUsers = res
      this.filterUsers.map((res,i)=>{
        if(res.id == localStorage.getItem('userId')){
          const result = this.filterUsers.filter(friends => friends.id == localStorage.getItem('userId'))
          this.filterUsers = result
        }
      })
      setTimeout(() => {
        LoaderServiceService.loader.next(false);
      }, 1500);
    })
  }
  getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude
      this.lng = position.coords.longitude
      this.location = {lat:this.lat, lng:this.lng}
     });
  }
  myProfile(){
    LoaderServiceService.loader.next(true);
    this.http.get('/my_profile',true).subscribe((res:any)=>{
      setTimeout(() => {
        if(res?.my_profile?.verifiy_percent == "100"){
          localStorage.setItem('personalDetails','true')
          localStorage.setItem('matchSettings','true')
        }
        if(localStorage.getItem('personalDetails') == "true" && localStorage.getItem('matchSettings') == "true" && res.my_profile.image != null){
          this.progressBarVal = 100
        }
        else{
          this.progressBarVal = 75
        }
      });
    })
    LoaderServiceService.loader.next(false);
  }
}
