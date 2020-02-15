import {Injectable} from '@angular/core';
import {BaseService} from './base.service';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthCheckService extends BaseService {
  static AUTH_URL = `${environment.server}/members`;

  async checkAuth(): Promise<any> {
    return await this.get(AuthCheckService.AUTH_URL);
  }

  async signIn(postParams): Promise<any> {
    return await this.post(AuthCheckService.AUTH_URL, postParams);
  }

  async signUp(postParams): Promise<any> {
    return await this.post(AuthCheckService.AUTH_URL, postParams);
  }
}
