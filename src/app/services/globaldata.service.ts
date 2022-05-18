import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobaldataService {
  public static profileImage:any;
  public static profileImageBase:any;
  public static mydata:any;
  public static profileCondition:Subject <any> = new Subject <any>();
  public static connect:Subject <any> = new Subject <any>();
  public static connectRequest:Subject <any> = new Subject <any>();
  public static disconnected:Subject <any> = new Subject <any>();
  public static firstMessage:Subject <any> = new Subject <any>();
  public static callConnection:Subject <any> = new Subject <any>();
  public static hearts:Subject <any> = new Subject <any>();
  public static signin:Subject <any> = new Subject <any>();
  public static signinModal:Subject <any> = new Subject <any>();
  constructor() { }
}
