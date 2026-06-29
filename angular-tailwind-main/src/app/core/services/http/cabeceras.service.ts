import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionService } from '../session/session.service';

@Injectable({
  providedIn: 'root',
})
export class CabecerasService {
  constructor(private sessionService: SessionService) {}

  Headers(): HttpHeaders {
    const token = this.sessionService.getToken();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  HeadersArchivos(): HttpHeaders {
    const token = this.sessionService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
}
