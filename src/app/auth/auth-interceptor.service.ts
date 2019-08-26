import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // take para que entre una sola vez o tome un solo valor y luego hace un unsubscribe automaticamente
    // exaustMap espera que termine el primer observable y llamar a la accion
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifieReq = req.clone({ params: new HttpParams().set('auth', user.token) });
        return next.handle(modifieReq);
      }));
  }
}
