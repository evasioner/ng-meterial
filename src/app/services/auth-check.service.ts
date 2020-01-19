import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthCheckService extends BaseService {
  static SignIn_URL = `${environment.server}/signin`;
  static SignOut_URL = 'signout';
  static SignUp_URL = `${environment.server}/signup`;
  static AUTH_URL = `${environment.server}/auth`;

  async checkAuth(): Promise<any> {
    return await this.get(AuthCheckService.AUTH_URL);
  }

  async signIn(postParams): Promise<any> {
    return await this.post(AuthCheckService.SignIn_URL, postParams);
  }

  async signUp(postParams): Promise<any> {
    return await this.post(AuthCheckService.SignUp_URL, postParams);
  }
}
