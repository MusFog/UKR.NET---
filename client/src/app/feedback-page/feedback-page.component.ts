import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FeedbackService} from "../shared/services/feedback.services";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Feedback} from "../shared/interfaces";
import {MaterialService} from "../shared/classes/material.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-feedback-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    DatePipe
  ],
  templateUrl: './feedback-page.component.html',
  styleUrl: './feedback-page.component.css'
})
export class FeedbackPageComponent implements OnInit, OnDestroy {
  feedbackForm!: FormGroup
  feedbacks: Feedback[] = []
  selectedFeedback?: Feedback
  Sub!: Subscription

  constructor(private fb: FormBuilder, private feedbackService: FeedbackService) {
  }

  ngOnInit() {
    this.loadFeedbacks()
    this.feedbackForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
    })
  }
  loadFeedbacks() {
    this.Sub = this.feedbackService.getAllFeedbacks().subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks
      },
      error: (error) => MaterialService.toast(error.error.message)
    })
  }



  selectFeedback(feedback: Feedback) {
    this.selectedFeedback = feedback
  }
  submitFeedback(): void {
    if (this.feedbackForm.valid) {
      this.Sub = this.feedbackService.createFeedback(this.feedbackForm.value)
        .subscribe({
          next: (feedback) => {
            this.loadFeedbacks()
            this.feedbackForm.reset()
          },
          error: (error) => MaterialService.toast(error.error.message)
        })
    }
  }
  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }

}
