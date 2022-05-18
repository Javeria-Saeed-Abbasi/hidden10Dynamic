import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  public notification$: BehaviorSubject<string> = new BehaviorSubject('');
  public notificationlike$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() { }
  options = {
    rememberUpgrade:true,
    secure:true,
    rejectUnauthorized: false
        }
  socket = io('localhost:3000');

  public notification(noticondition, userData) {
    this.socket.emit('notification', {noticondition, userData});
  }
  // for app page
  public getnotification = () => {
    this.socket.on('notification',  (noticondition) =>{
      this.notification$.next(noticondition);
    });

    return this.notification$.asObservable();
  };
  // for like by page
  public getnotificationlike = () => {
    this.socket.on('notification', (noticondition) =>{
      this.notificationlike$.next(noticondition);
    });

    return this.notificationlike$.asObservable();
  };
}
