import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Feedback} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  constructor(private http: HttpClient) {
  }

  createFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>('http://localhost:5000/feedback', feedback)
  }

  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>('http://localhost:5000/feedback')
  }

  updateFeedback(id: string | undefined, feedback: { adminResponse: string, respondedAt: Date }): Observable<Feedback> {
    return this.http.put<Feedback>(`http://localhost:5000/feedback/${id}`, feedback)
  }
}
