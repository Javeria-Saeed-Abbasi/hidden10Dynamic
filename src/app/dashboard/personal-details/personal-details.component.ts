import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { LoaderServiceService } from 'src/app/services/loader-service.service';
import { Country, State, City } from 'country-state-city';
@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit {
  //countries variables
  allCities: any = [];
  allCountries: any = [];
  allStates: any = [];
  countriesData: any = [];
  filteredCountries;
  filteredStates: any = [];
  filteredCitites: any = [];

  profileData;
  updateProfile;
  editUserForm = this.fb.group({
    email: [null],
    age: [null],
    horoscope: [null],
    mother_tongue: [null],
    height: [null],
    country_living_in: [null],
    residing_state: [null],
    residing_city: [null],
    citizenship: [null],
    religion_community: [null],
    religious_value: [null],
    employed_in: [null],
    occupation: [null],
    annual_income: [null],
    ethnicity: [null],
    about_me: [null],
    about_me_status: ['Public'],
    family_status: ['Public'],
    about_family: [null],
    marital_status: [null],
    education_status: ['Public'],
    religious_status: ['Public'],
    location_status: ['Public'],
    kids: [null],
    numer_of_marriages: [null],
    image: [null],
    verifiy_percent: [],
  });
  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProfileData();
    // countries
    this.getCountries();
  }
  update() {
    if (
      this.editUserForm.controls['age'].value == null ||
      this.editUserForm.controls['age'].value == '' ||
      this.editUserForm.controls['height'].value == null ||
      this.editUserForm.controls['height'].value == '' ||
      this.editUserForm.controls['horoscope'].value == null ||
      this.editUserForm.controls['marital_status'].value == null ||
      this.editUserForm.controls['religion_community'].value == null ||
      this.editUserForm.controls['mother_tongue'].value == null ||
      this.editUserForm.controls['physical_status'].value == null ||
      this.editUserForm.controls['country_living_in'].value == null ||
      this.editUserForm.controls['residing_state'].value == null ||
      this.editUserForm.controls['residing_city'].value == null ||
      this.editUserForm.controls['citizenship'].value == null ||
      this.editUserForm.controls['religious_value'].value == null ||
      this.editUserForm.controls['employed_in'].value == null ||
      this.editUserForm.controls['occupation'].value == null ||
      this.editUserForm.controls['annual_income'].value == null ||
      this.editUserForm.controls['annual_income'].value == '' ||
      this.editUserForm.controls['ethnicity'].value == null ||
      this.editUserForm.controls['about_family'].value == '' ||
      this.editUserForm.controls['about_family'].value == null ||
      this.editUserForm.controls['about_me'].value == '' ||
      this.editUserForm.controls['about_me'].value == null ||
      this.editUserForm.controls['kids'].value == null ||
      this.editUserForm.controls['numer_of_marriages'].value == null ||
      this.editUserForm.controls['marital_status'].value == null

    ) {
      localStorage.setItem('personalDetails', 'false');
    } else {
      localStorage.setItem('personalDetails', 'true');
    }
    LoaderServiceService.loader.next(true);
    setTimeout(() => {
      if (
        localStorage.getItem('personalDetails') == 'true' &&
        localStorage.getItem('matchSettings') == 'true'
      ) {
        this.editUserForm.patchValue({
          verifiy_percent: 100,
        });
      } else {
        this.editUserForm.patchValue({
          verifiy_percent: 75,
        });
      }
      this.editUserForm.patchValue({
        email: this.profileData?.my_profile.email,
      });
      this.http
        .post('/user_update', this.editUserForm.value, true)
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
      setTimeout(() => {
        this.editUserForm = this.fb.group({
          email: [this.profileData?.my_profile?.email],
          age: [this.profileData?.my_profile?.age],
          mother_tongue: [this.profileData?.my_profile?.mother_tongue],
          horoscope: [this.profileData?.my_profile?.horoscope],
          height: [this.profileData?.my_profile?.height],
          country_living_in: [this.profileData?.my_profile?.country_living_in],
          residing_state: [this.profileData?.my_profile?.residing_state],
          residing_city: [this.profileData?.my_profile?.residing_city],
          citizenship: [this.profileData?.my_profile?.citizenship],
          marital_status: [this.profileData?.my_profile?.marital_status],
          numer_of_marriages: [this.profileData?.my_profile?.numer_of_marriages],
          kids: [this.profileData?.my_profile?.kids],
          religion_community: [
            this.profileData?.my_profile?.religion_community,
          ],
          religious_value: [this.profileData?.my_profile?.religious_value],
          employed_in: [this.profileData?.my_profile?.employed_in],
          occupation: [this.profileData?.my_profile?.occupation],
          annual_income: [this.profileData?.my_profile?.annual_income],
          ethnicity: [this.profileData?.my_profile?.ethnicity],
          about_me: [this.profileData?.my_profile?.about_me],
          about_me_status: [
            this.profileData?.my_profile?.about_me_status
              ? this.profileData?.my_profile?.about_me_status
              : 'Public',
          ],
          family_status: [
            this.profileData?.my_profile?.family_status
              ? this.profileData?.my_profile?.family_status
              : 'Public',
          ],
          about_family: [this.profileData?.my_profile?.about_family],
          education_status: [
            this.profileData?.my_profile?.education_status
              ? this.profileData?.my_profile?.education_status
              : 'Public',
          ],
          religious_status: [
            this.profileData?.my_profile?.religious_status
              ? this.profileData?.my_profile?.religious_status
              : 'Public',
          ],
          location_status: [
            this.profileData?.my_profile?.location_status
              ? this.profileData?.my_profile?.location_status
              : 'Public',
          ],
          image: [null],
          verifiy_percent: [],
        });
        LoaderServiceService.loader.next(false);
      });
    });
  }
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
}
