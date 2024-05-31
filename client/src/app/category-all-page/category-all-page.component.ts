import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {LoaderComponent} from "../shared/components/loader/loader.component";
import { Category } from "../shared/interfaces";
import { Observable, Subscription } from "rxjs";

import {RouterLink} from "@angular/router";
import { CategoriesServices } from "../shared/services/categories.services";

@Component({
  selector: 'app-category-all-page',
  standalone: true,
  imports: [
    AsyncPipe,
    LoaderComponent,
    NgForOf,
    NgIf,
    NgClass,
    RouterLink,
  ],
  templateUrl: './category-all-page.component.html',
  styleUrl: './category-all-page.component.css'
})
export class CategoryAllPageComponent implements OnInit {
  categories$!: Observable<Category[]>
  Sub!: Subscription

  @Output() categorySelected = new EventEmitter<string | null>()

  constructor(private categoriesService: CategoriesServices) {}

  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
  }

  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
