import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends BaseService {

  static MEMBER_URL = `${environment.server}/members`;

  async getMembers(): Promise<any> {
    return this.get(MemberService.MEMBER_URL);
  }

  public createMember(name: string, id: string): Observable<any> {
    const data = {'name': name, 'id': id};
    return this.post(MemberService.MEMBER_URL, data);
  }
}
