import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Params, Router, RouterLink} from "@angular/router";
import {LoaderComponent} from "../../shared/components/loader/loader.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Category} from "../../shared/interfaces";
import {CategoriesServices} from "../../shared/services/categories.services";
import {of, Subscription, switchMap} from "rxjs";
import {MaterialInstance, MaterialService} from "../../shared/classes/material.service";
import {TestFormComponent} from "../test-page/test-form/test-form.component";

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    LoaderComponent,
    AsyncPipe,
    ReactiveFormsModule,
    NgClass,
    TestFormComponent
  ],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.css'
})

export class CategoryPageComponent implements OnInit, OnDestroy {
  @ViewChild('input') inputRef!: ElementRef
  input!: MaterialInstance
  form!: FormGroup
  image!: File
  imagePreview: string | ArrayBuffer | null | undefined = ''
  isNew = true
  Sub!: Subscription
  category!: Category
  constructor(private route: ActivatedRoute, private categoriesService: CategoriesServices, private router: Router ) {
  }
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required)
    })
    this.form.disable()
    this.Sub = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false
              return this.categoriesService.getById(params['id'])
            }
            return of(null)
          }
        )
      )
      .subscribe(
        (category: Category | null) => {
          if (category) {
            this.category = category
            this.form.patchValue({
              name: category.name,
              description: category.description
            })
            this.imagePreview = category.imageSrc
            MaterialService.updateTextInputs()
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
      )
  }
  triggerClick() {
    this.inputRef.nativeElement.click()
  }
  deleteCategory() {
    const decision = window.confirm(`Ви впевнені, що хочете видалити цю категорію? "${this.category.name}"`)
    if (decision) {
      if (this.category._id != null) {
        this.Sub = this.categoriesService.deleteById(this.category._id).subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          () => this.router.navigate(['/adminPanel'])
        )
      }
    }
  }
  onFileUpload(event: any) {
    const file = event.target.files[0]
    this.image = file
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result
    }
    reader.readAsDataURL(file)
  }
  onSubmit() {
    let obs$
    this.form.disable()
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.form.value.description, this.image)
    } else {
      obs$ = this.categoriesService.updateById(this.category._id, this.form.value.name, this.form.value.description, this.image)
    }
    this.Sub = obs$.subscribe(
      category => {
        this.category = category
        MaterialService.toast('Зміни збережено')
        this.form.enable()
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
  ngOnDestroy() {
    if (this.input) {
      this.input.destroy?.()
    }
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
}
