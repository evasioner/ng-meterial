import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {BaseService} from './base.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends BaseService {

  static MEMBER_URL = `${environment.server}/members`;
  static TEST_URL = `${environment.test_server}/tests`;

  async getMembers(): Promise<any> {
    return this.get(MemberService.MEMBER_URL);
  }

  async search(queryParams): Promise<any> {
    return this.get(MemberService.TEST_URL, queryParams);
  }

  public singUp(data): Observable<any> {
    return this.post(MemberService.MEMBER_URL, data);
  }
}
