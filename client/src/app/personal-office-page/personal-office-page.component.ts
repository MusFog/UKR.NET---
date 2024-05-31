import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { LoaderComponent } from "../shared/components/loader/loader.component";
import { MaterialInstance, MaterialService } from "../shared/classes/material.service";
import { BehaviorSubject, combineLatest, map, Observable, startWith, Subscription } from "rxjs";
import { AnswerServices } from "../shared/services/answer.services";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Answer } from "../shared/interfaces";

@Component({
  selector: 'app-personal-office-page',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './personal-office-page.component.html',
  styleUrl: './personal-office-page.component.css'
})
export class PersonalOfficePageComponent implements OnInit, OnDestroy, AfterViewInit {
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
      this.answerService.fetchForUser(),
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
