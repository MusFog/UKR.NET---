import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MaterialInstance, MaterialService } from "../../shared/classes/material.service";
import { Answer } from "../../shared/interfaces";
import { BehaviorSubject, catchError, combineLatest, map, Observable, of, startWith, Subscription } from "rxjs";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { LoaderComponent } from "../../shared/components/loader/loader.component";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { AnswerServices } from "../../shared/services/answer.services";
import { tap } from "rxjs/operators";

@Component({
  selector: 'app-checking-test-page',
  standalone: true,
  imports: [
    LoaderComponent,
    NgIf,
    NgForOf,
    AsyncPipe,
    RouterLink
  ],
  templateUrl: './checking-test-page.component.html',
  styleUrls: ['./checking-test-page.component.css']
})
export class CheckingTestPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltip!: MaterialInstance;
  input!: MaterialInstance
  filter$ = new BehaviorSubject<string>('');
  sub!: Subscription;
  constructor(private answerService: AnswerServices, private route: ActivatedRoute) {
  }
  answer$!: Observable<Answer[]>;

  ngOnInit() {
    this.answer$ = combineLatest([
      this.answerService.fetch().pipe(
        tap({
          error: error => MaterialService.toast(error.error.message)
        }),
      ),
      this.filter$.pipe(startWith(''))
    ]).pipe(
      map(([answers, filterString]) => answers.filter(answerItem =>
        answerItem.name.toLowerCase().includes(filterString.toLowerCase()))
      )
    );
  }


  onFilterChange(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter$.next(filterValue);
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy() {
    if (this.input) {
      this.input.destroy?.()
    }
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }
}
