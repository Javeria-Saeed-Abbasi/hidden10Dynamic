import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderServiceService {
  public static loader:Subject <any> = new Subject <any>();
  constructor() { }
}
