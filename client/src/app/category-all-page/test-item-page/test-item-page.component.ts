import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Test } from "../../shared/interfaces";
import { MaterialService } from "../../shared/classes/material.service";
import { Subscription } from "rxjs";
import { AnswerServices } from "../../shared/services/answer.services";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
  selector: 'app-test-item-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    DatePipe,
    LoaderComponent
  ],
  templateUrl: './test-item-page.component.html',
  styleUrls: ['./test-item-page.component.css']
})
export class TestItemPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  test!: Test;
  answerForm!: FormGroup;
  sub = new Subscription;

  constructor(
    private fb: FormBuilder,
    private answerService: AnswerServices,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sub.add(this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadTest(id);
    }));
  }

  loadTest(id: string): void {
    this.loading = true;
    this.sub.add(this.answerService.openTest(id).subscribe(
      test => {
        this.test = test;
        this.initForm();
        this.loading = false;
      },
      error => {
        MaterialService.toast(error.error.message);
        this.loading = false;
      }
    ));
  }

  initForm(): void {
    if (this.test?.item) {
      this.answerForm = this.fb.group({
        answers: this.fb.array(this.test.item.map(item => this.fb.group({
          question: [item.question, Validators.required],
          answer: ['', Validators.required],
          itemId: [item._id, Validators.required],
          correct: [false, Validators.required]
        })))
      });
    }
  }


  get answers(): FormArray {
    return this.answerForm.get('answers') as FormArray;
  }
  getQuestionControl(i: number): FormControl {
    return (this.answers.at(i) as FormGroup).get('question') as FormControl;
  }


  submitAnswers(): void {
    if (this.answerForm.valid) {
      const submissionData = {
        testId: this.test._id,
        name: this.test.name,
        answers: this.answerForm.value.answers,
        answerChecked: false
      };
      this.sub.add(this.answerService.saveTest(submissionData).subscribe({
        next: (response) => {
          MaterialService.toast('Відповіді збережено');
          this.answerForm.reset();
        },
        error: (error) => MaterialService.toast(error.error.message),
      }));
    }
  }


  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  protected readonly FormControl = FormControl;
}
