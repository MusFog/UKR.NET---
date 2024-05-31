import {Injectable} from "@angular/core";
import { User } from "../interfaces";
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthServices {
  private token: string | null = null
  constructor(private http: HttpClient) {
  }
  findAll(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/auth')
  }
  assignRole(Id: string, role: string): Observable<any> {
    return this.http.patch(`http://localhost:5000/auth/${Id}`, { role });
  }
  register(user: User): Observable<User> {
    return this.http.post<User>('http://localhost:5000/auth/register', user)
  }
  login(user: User): Observable<{token: string}> {
    return this.http.post<{token: string}>('http://localhost:5000/auth/login', user)
      .pipe(
        tap(
          ({token}) => {
            localStorage.setItem('auth-token', token)
            this.setToken(token)
          }
        )
      )
  }
  setToken(token: string | null) {
    this.token = token
  }

  getToken(): string {
    return <string>this.token
  }


  isAuthenticated(): boolean {
    return !!this.token
  }
  logout() {
    this.setToken(null)
    localStorage.clear()
  }
}
