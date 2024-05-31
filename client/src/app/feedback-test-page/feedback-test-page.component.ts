import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { AnswerComment, CommentDetails, Test } from "../shared/interfaces";
import { TestServices } from "../shared/services/test.services";
import { MaterialService } from "../shared/classes/material.service";
import { DatePipe, NgForOf, NgIf } from "@angular/common";

@Component({
  selector: 'app-feedback-test-page',
  templateUrl: './feedback-test-page.component.html',
  styleUrls: ['./feedback-test-page.component.css'],
  standalone: true,
  imports: [
    NgIf, NgForOf, ReactiveFormsModule, DatePipe
  ]
})
export class FeedbackTestPageComponent implements OnInit, OnDestroy {
  testItem!: Test;
  commentForm!: FormGroup;
  sub!: Subscription;
  id!: string

  constructor(
    private testService: TestServices,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(3)]]
    });

    this.sub = this.route.params.subscribe(params => {
      const id = params['id'];
      this.id = id
      if (id) {
        this.loadTestItem(id);
      }
    });
  }

  loadTestItem(id: string): void {
    this.testService.getById(id).subscribe({
      next: (test: Test) => {
        if (test.comment && test.comment.length) {
          const allComments: (Comment | AnswerComment)[] = [];

          test.comment.forEach((commentBlock: any) => {
            // Додавання коментарів користувачів
            commentBlock.comments.forEach((comment: CommentDetails) => {
              allComments.push({
                text: comment.text,
                // @ts-ignore
                createdAt: new Date(comment.createdAt),
                createdBy: commentBlock.createdBy.login,
                type: 'userComment'
              });
            });

            // Додавання відповідей адміністраторів
            commentBlock.answerComments?.forEach((answer: AnswerComment) => {
              // @ts-ignore
              allComments.push({
                text: answer.text,
                // @ts-ignore
                createdAt: new Date(answer.answeredAt),
                createdBy: answer.answeredBy.login,
                type: 'adminReply'
              });
            });
          });

          // Сортування за датою
          // @ts-ignore
          allComments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

          // Запис впорядкованих коментарів назад у testItem
          // @ts-ignore
          test.comment = allComments as Comment[];
        }

        this.testItem = test;
      },
      error: (error) => {
        MaterialService.toast('Не вдалося завантажити дані тесту: ' + error.error.message);
      }
    });
  }



  submitComment(): void {
    if (this.commentForm.valid && this.testItem) {
      const parts = this.id.split('-');
      let effectiveId = this.id;

      if (parts.length === 4 && parts[0] === 'user' && parts[2] === 'test') {
        effectiveId = this.id
      }

      this.testService.addComment(effectiveId, this.commentForm.value).subscribe({
        next: (response) => {
          if (response.comment && this.testItem) {
            this.testItem.comment = [...(this.testItem.comment ?? []), response.comment[response.comment.length - 1]];
          }
          this.commentForm.reset();
          this.loadComments();
        },
        error: (error) => {
          MaterialService.toast(error.error.message);
        }
      });
    }
  }


  loadComments(): void {
    if (this.testItem && this.testItem._id) {
      this.sub = this.testService.getById(this.testItem._id).subscribe(testItem => {
        this.testItem = testItem;
      });
    }
  }


  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
