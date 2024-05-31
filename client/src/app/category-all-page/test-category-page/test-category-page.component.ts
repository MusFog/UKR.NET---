import { Component, OnDestroy, OnInit } from "@angular/core";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { ActivatedRoute, Params, RouterLink } from "@angular/router";
import { catchError, Observable, of, Subscription, switchMap } from "rxjs";
import { Test } from "../../shared/interfaces";
import { TestServices } from "../../shared/services/test.services";
import { MaterialService } from "../../shared/classes/material.service";


@Component({
  selector: 'app-test-category-page',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './test-category-page.component.html',
  styleUrl: './test-category-page.component.css'
})
export class TestCategoryPageComponent implements OnInit, OnDestroy {
  test$!: Observable<Test[]>
  sub!: Subscription

  constructor(private testService: TestServices, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.test$ = this.route.params.pipe(
      switchMap((params: Params) => {
        const id = params['id'];
        return id ? this.testService.getByIdAll(id) : of([]);
      }),
      catchError(error => {
        MaterialService.toast(error.error.message)
        return of([]);
      })
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
