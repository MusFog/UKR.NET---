import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Test, TestResponse } from "../interfaces";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TestServices {

  constructor(private http: HttpClient) {
  }
  create(test: Test): Observable<Test> {
    return this.http.post<Test>('http://localhost:5000/test', test)
  }
  getById(id: string): Observable<Test> {
    return this.http.get<Test>(`http://localhost:5000/test/${id}`)
  }
  getByIdAll(id: string): Observable<Test[]> {
    return this.http.get<Test[]>(`http://localhost:5000/test/all/${id}`)
  }
  findAllUserFeedback(id: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:5000/test/userFeedback/${id}`)
  }
  updateById(test: Test): Observable<Test> {
    return this.http.put<Test>(`http://localhost:5000/test/${test._id}`, test)
  }
  deleteById(test: Test): Observable<any> {
    return this.http.delete(`http://localhost:5000/test/${test._id}`)
  }
  fetchByCategoryId(categoryIds: string | string[]): Observable<Test[]> {
    let params = new HttpParams()

    if (Array.isArray(categoryIds)) {
      categoryIds.forEach(id => params = params.append('categoryId', id))
    } else {
      params = params.append('categoryId', categoryIds)
    }
    return this.http.get<Test[]>('http://localhost:5000/test', { params })
  }
  fetch(params: any = {}): Observable<Test[]> {
    return this.http.get<Test[]>('http://localhost:5000/test', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }
  fetchP(params: any = {}): Observable<TestResponse> {
    return this.http.get<TestResponse>('http://localhost:5000/test/all', {
      params: new HttpParams({
        fromObject: params
      })
    })
  }


  addComment(testId: string | undefined, comment: { text: string, userId: string }): Observable<Test> {
    return this.http.post<Test>(`http://localhost:5000/test/comment/${testId}`, comment)
  }
}
