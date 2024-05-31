import { Component, OnInit } from "@angular/core";
import { catchError, Observable, of, switchMap } from "rxjs";
import { ActivatedRoute, Params, RouterLink } from "@angular/router";
import { MaterialService } from "../../shared/classes/material.service";
import { Test, User } from "../../shared/interfaces";
import { FormBuilder } from "@angular/forms";
import { AnswerServices } from "../../shared/services/answer.services";
import { TestServices } from "../../shared/services/test.services";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-feedback-user-test-page',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './feedback-user-test-page.component.html',
  styleUrl: './feedback-user-test-page.component.css'
})
export class FeedbackUserTestPageComponent implements OnInit {
  user$!: Observable<User[]>
  testId!: string
  constructor(
    private testService: TestServices,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.user$ = this.route.params.pipe(
      switchMap((params: Params) => {
        const id = params['id'];
        if (!id) {
          return of([]);
        }
        this.testId = id
        return this.testService.findAllUserFeedback(id);
      }),
      catchError(error => {
        MaterialService.toast(error.error.message)
        return of([]);
      })
    );
  }

}
