import { Component, OnDestroy, OnInit } from "@angular/core";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { catchError, map, Observable, of, Subscription, switchMap } from "rxjs";
import { Answer, Test } from "../../shared/interfaces";
import { AnswerServices } from "../../shared/services/answer.services";
import { TestServices } from "../../shared/services/test.services";
import { ActivatedRoute } from "@angular/router";
import { MaterialService } from "../../shared/classes/material.service";

@Component({
  selector: 'app-checking-item-test-page',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    LoaderComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './checking-item-test-personal-page.component.html',
  styleUrl: './checking-item-test-personal-page.component.css'
})
export class CheckingItemTestPersonalPageComponent implements OnInit, OnDestroy {
  details$!: Observable<{ answer: Answer, test: Test }>;
  answerUpdates: Record<string, boolean> = {};
  details: { answer: Answer, test: Test } | null = null;
  Sub!: Subscription

  constructor(
    private answerServices: AnswerServices,
    private testServices: TestServices,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.Sub = this.route.params.subscribe(params => {
      this.loadDetails(params['id']);
    });
  }

  getTotalQuestions(details: { answer: Answer, test: Test }): number {
    return details.answer.answers ? details.answer.answers.length : 0;
  }


  getCorrectAnswers(details: { answer: Answer, test: Test }): number {
    return details.answer.answers.filter(a => a.correct).length;
  }


  loadDetails(answerId: string) {
    // @ts-ignore
    this.details$ = this.answerServices.getAnswersById(answerId).pipe(
      switchMap(answer => {
        if (!answer || !answer.testId) {
          throw new Error('TestData or TestId is undefined');
        }
        return this.testServices.getById(answer.testId).pipe(
          map(test => {
            if (!test) throw new Error('Test details not found');
            const newDetails = { answer, test, mark: test.mark };
            this.details = newDetails;
            return newDetails;
          })
        );
      }),
      catchError(error => {
        return of(null);
      })
    );
  }


  toggleCorrectStatus(answerDetail: any) {
    answerDetail.correct = !answerDetail.correct;
    this.answerUpdates[answerDetail._id] = answerDetail.correct;
    if (this.details && this.details.answer) {
      const found = this.details.answer.answers.find(a => a.itemId === answerDetail._id);
      if (found) {
        found.correct = answerDetail.correct;
      }
    }

  }
  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
