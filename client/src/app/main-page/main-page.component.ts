import { Component, OnDestroy, OnInit } from "@angular/core";
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { LoaderComponent } from "../shared/components/loader/loader.component";
import { RouterLink } from "@angular/router";
import { CategoryRating, UserRating } from "../shared/interfaces";
import { Observable, Subscription } from "rxjs";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { AnswerServices } from "../shared/services/answer.services";


@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    RouterLink,
    FooterComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit, OnDestroy {

  categoryRating$!: Observable<CategoryRating[]>
  userRating$!: Observable<UserRating[]>
  loading = false;
  Sub!: Subscription;

  constructor(private answerService: AnswerServices) {

  }
  ngOnInit() {
    this.categoryRating$ = this.answerService.findCategoryRating()
    this.userRating$ = this.answerService.findAllRating()
  }


  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe();
    }
  }
}
