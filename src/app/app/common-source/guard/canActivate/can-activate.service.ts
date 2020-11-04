import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";

/**
 * https://angular.io/api/router/CanActivate
 * 라우팅 이동시 권한 체크후 이동여부 결정.
 */

@Injectable()
export class UserToken {}

@Injectable()
export class Permissions {
  canActivate(user: UserToken, id: string): boolean {
    console.info('[Permissions]', user, id);
    return true;
  }
}

@Injectable()
export class CanActivateService implements CanActivate {

  constructor(private permissions: Permissions, private currentUser: UserToken) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    console.info('[CanActivateService > canActivate]');
    return this.permissions.canActivate(this.currentUser, route.params.id);

  }

}
