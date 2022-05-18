import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(
    private http: HttpClient, // public general: GeneralService,
    // private toastr: ToastrService // private cstmtostr: toasterFunc
  ) {}
  // logoutApi
  get(link, token) {
    let header = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin" : '*',
      Accept: "application/json",

    };
    let headerT = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin" : '*',
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      Accept: "application/json",
    };
    return this.http.get(
      environment.api.baseURL + link,
      {
        headers: !token ? header : headerT,
      }
    );
  }
  post(link, data, token) {
    let header = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin" : '*',
      Accept: "application/json",
    };
    let headerT = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin" : '*',
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      Accept: "application/json",
    };

    return this.http.post(
      environment.api.baseURL + link,
      JSON.stringify(data),
      {
        headers: !token ? header : headerT,
      }
    );
  }
  // countires get method
  getCountry() {
    let header = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin" : '*',
      Accept: "application/json",
    };
    return this.http.get(
      "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json",
      {
        headers:header
      }
    );
  }
}
