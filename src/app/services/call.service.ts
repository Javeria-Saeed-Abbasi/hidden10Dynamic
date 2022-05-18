import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CallService {
  public call$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() { }
  options = {
    rememberUpgrade:true,
    secure:true,
    rejectUnauthorized: false
        }
  socket = io('localhost:3000');
  public call(noticondition, userData) {
    this.socket.emit('call', {noticondition, userData});
  }
  public getcall = () => {
    this.socket.on('call', (noticondition) =>{
      this.call$.next(noticondition);
    });

    return this.call$.asObservable();
  };
}
