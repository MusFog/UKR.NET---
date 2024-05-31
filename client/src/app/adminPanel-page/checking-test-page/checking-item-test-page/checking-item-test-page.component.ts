import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable, switchMap, map, catchError, of, Subscription } from "rxjs";
import { Answer, AnswerItem, Test, User } from "../../../shared/interfaces";
import { AnswerServices } from "../../../shared/services/answer.services";
import { ActivatedRoute } from "@angular/router";
import { NgForOf, NgIf, AsyncPipe } from "@angular/common";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { TestServices } from "../../../shared/services/test.services";
import { FormsModule } from "@angular/forms";
import { MaterialService } from "../../../shared/classes/material.service";

@Component({
  selector: 'app-checking-item-test-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    AsyncPipe,
    LoaderComponent,
    FormsModule
  ],
  templateUrl: './checking-item-test-page.component.html',
  styleUrls: ['./checking-item-test-page.component.css']
})
export class CheckingItemTestPageComponent implements OnInit, OnDestroy {
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

  get isMarkValid(): boolean {
    return this.details ? this.details.answer.mark! <= this.details.test.mark : true;
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
          }),
          catchError(error => {
            MaterialService.toast(error.error.message);
            return of(null);
          })
        );
      }),
      catchError(error => {
        MaterialService.toast(error.error.message);
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

  saveAllChanges() {
    if (!this.details || !this.details.answer._id || this.details.answer.mark === undefined) {
      return
    }

    const answers = this.details.answer.answers.map(answer => ({
      itemId: answer.itemId,
      correctAnswer: answer.correctAnswer,
      question: answer.question,
      answer: answer.answer,
      correct: answer.correct
    }));

    if (answers.length > 0) {
      this.Sub = this.answerServices.markAnswer(this.details.answer._id, this.details.answer.mark, this.details.answer.answerChecked = true, answers)
        .subscribe({
          next: response => {
            MaterialService.toast('Результат проходження тесту збережено')
            this.answerUpdates = {};
          },
          error: error => MaterialService.toast(error.error.message)
        });
    }
  }



  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
