import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as $ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
@Component({
  selector: 'app-match-settings',
  templateUrl: './match-settings.component.html',
  styleUrls: ['./match-settings.component.scss'],
})
export class MatchSettingsComponent implements OnInit {
  // specific section
  specificLocation;
  profileData;
  //countries variables
  allCities: any = [];
  allCountries: any = [];
  allStates: any = [];
  countriesData: any = [];
  filteredCountries;
  filteredStates: any = [];
  filteredCitites: any = [];

  matchSettingForm = this.fb.group({
    age_from: [null],
    age_to: [null],
    height_from: [null],
    height_to: [null],
    browsing_from: [null],
    browsing_to: [null],
    specific_location: [null],
    country: [null],
    city: [null],
    verifiy_percent: [null],
  });
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProfileData();
    this.getCountries();
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
  SelectedCountry(value) {
    let states = this.countriesData.filter((item) => item.country === value);
    this.allStates = [];
    this.allStates.push(states);
    var stat: any = this.allStates[0].map((item) => item.subcountry);
    const state = [...new Set(stat)];
    state.sort();
    this.filteredStates = [];
    this.filteredStates.push(state);
  }
  SelectedState(value) {
    let cities = this.countriesData.filter((item) => item.subcountry === value);
    this.allCities = [];
    this.allCities.push(cities);
    var citi: any = this.allCities[0].map((item) => item.name);
    const city = [...new Set(citi)];
    city.sort();
    this.filteredCitites = [];
    this.filteredCitites.push(city);
  }
  update() {
    if (
      this.matchSettingForm.controls['age_from'].value != null &&
      this.matchSettingForm.controls['age_to'].value != null &&
      this.matchSettingForm.controls['height_from'].value != null &&
      this.matchSettingForm.controls['height_to'].value != null &&
      (this.matchSettingForm.controls['browsing_from'].value == null ||
        this.matchSettingForm.controls['browsing_to'].value == null) &&
      this.matchSettingForm.controls['specific_location'].value != null &&
      this.matchSettingForm.controls['country'].value != null &&
      this.matchSettingForm.controls['city'].value != null
    ) {
      localStorage.setItem('matchSettings', 'true');
    } else if (
      this.matchSettingForm.controls['age_from'].value != null &&
      this.matchSettingForm.controls['age_to'].value != null &&
      this.matchSettingForm.controls['height_from'].value != null &&
      this.matchSettingForm.controls['height_to'].value != null &&
      this.matchSettingForm.controls['browsing_from'].value != null &&
      this.matchSettingForm.controls['browsing_to'].value != null &&
      this.matchSettingForm.controls['specific_location'].value == null &&
      this.matchSettingForm.controls['country'].value == null &&
      this.matchSettingForm.controls['city'].value == null
    ) {
      localStorage.setItem('matchSettings', 'true');
    } else {
      localStorage.setItem('matchSettings', 'false');
    }
    LoaderServiceService.loader.next(true);
    setTimeout(() => {
      if (
        localStorage.getItem('personalDetails') == 'true' &&
        localStorage.getItem('matchSettings') == 'true'
      ) {
        this.matchSettingForm.patchValue({
          verifiy_percent: 100,
        });
      } else {
        this.matchSettingForm.patchValue({
          verifiy_percent: 75,
        });
      }
      this.http
        .post('/user_update', this.matchSettingForm.value, true)
        .subscribe((res: any) => {
          LoaderServiceService.loader.next(false);
          this.toaster.success(res.messsage);
        }),
        (err) => {
          LoaderServiceService.loader.next(false);
        };
    });
  }
  getProfileData() {
    LoaderServiceService.loader.next(true);
    this.http.get('/my_profile', true).subscribe((res: any) => {
      this.profileData = res;
      if (res?.my_profile.specific_location) {
        this.specificLocation = true;
      } else {
        this.specificLocation = false;
      }
      this.matchSettingForm = this.fb.group({
        age_from: [this.profileData?.my_profile.age_from],
        age_to: [this.profileData?.my_profile.age_to],
        height_from: [this.profileData?.my_profile.height_from],
        height_to: [this.profileData?.my_profile.height_to],
        browsing_from: [this.profileData?.my_profile.browsing_from],
        browsing_to: [this.profileData?.my_profile.browsing_to],
        specific_location: [this.profileData?.my_profile.specific_location],
        country: [this.profileData?.my_profile.country],
        city: [this.profileData?.my_profile.city],
        verifiy_percent: [],
      });
      LoaderServiceService.loader.next(false);
    });
  }
  toggleSec(event) {
    if (event.target.checked) {
      this.specificLocation = true;
    } else {
      this.specificLocation = false;
    }
  }
}
