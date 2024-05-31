import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Answer, AnswerItem, CategoryRating, Test, User, UserRating } from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class AnswerServices {
  private apiUrl = 'http://localhost:5000'
  constructor(private http: HttpClient) {}

  openTest(id: string): Observable<Test> {
    return this.http.get<Test>(`${this.apiUrl}/answer/get/${id}`)
  }
  saveTest(answer: Answer): Observable<Answer> {
    return this.http.post<Answer>(`${this.apiUrl}/answer`, answer)
  }
  fetch(params: any = {}): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/answer`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
  findAllRating(): Observable<UserRating[]> {
    return this.http.get<UserRating[]>(`${this.apiUrl}/answer/rating`)
  }
  findCategoryRating(): Observable<CategoryRating[]> {
    return this.http.get<CategoryRating[]>(`${this.apiUrl}/answer/ratingCategory`)
  }
  fetchForUser(params: any = {}): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${this.apiUrl}/answer/answerForUser`, {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
  getAnswersById(Id: string): Observable<Answer> {
    return this.http.get<Answer>(`${this.apiUrl}/answer/answerItem/${Id}`);
  }

  markAnswer(id: string, mark: number, answerChecked: boolean, answers: { itemId: string; correct: boolean }[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/answer/${id}`, { mark, answerChecked, answers });
  }





}
