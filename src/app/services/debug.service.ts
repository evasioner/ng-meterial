import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DebugService {

  constructor() {
  }

  Log(...args): void {
    if (!environment.production) {
      console.log('===============DEBUG START=================');
      console.log(args);
      console.log('===============DEBUG END================');
    }
  }
}
