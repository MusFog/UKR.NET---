import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { MaterialInstance, MaterialService } from "../../../shared/classes/material.service";
import { TestServices } from "../../../shared/services/test.services";
import { Test } from "../../../shared/interfaces";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    LoaderComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './test-form.component.html',
  styleUrls: ['./test-form.component.css']
})
export class TestFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('input') inputRef!: ElementRef
  @Input('categoryId') categoryId!: string
  @ViewChild('modal') modalRef!: ElementRef
  test!: Test[]
  image!: File
  testId: string | null | undefined = null
  loading = false
  modal!: MaterialInstance
  form!: FormGroup
  Sub!: Subscription

  constructor(private testServices: TestServices, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      mark: ['', [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      item: this.fb.array([]),
      category: this.categoryId,
    })
    if (this.categoryId) {
      const params = { categoryId: this.categoryId }
      this.loading = true
      this.Sub = this.testServices.fetch(params).subscribe(test => {
        this.test = test
        this.loading = false
        if (test.length > 0 && test[0].item) {
          this.fillFormWithItem(test[0].item)
        }
      })
    }
  }
  fillFormWithItem(item: any[]) {
    const itemArray = this.form.get('item') as FormArray;
    itemArray.clear();
    item.forEach(item => {
      itemArray.push(this.fb.group({
        _id: [item._id],
        question: [item.question, Validators.required],
        answer: [item.answer, Validators.required],
      }));
    });
    setTimeout(() => MaterialService.updateTextInputs(), 0);
  }

  ngOnDestroy() {
    this.modal.destroy?.()
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectTest(test: Test) {
    this.testId = test._id;
    this.form.patchValue({
      name: test.name,
      mark: test.mark,
      description: test.description,
    });
    this.fillFormWithItem(test.item!);
    this.modal.open?.();
    MaterialService.updateTextInputs();
  }



  onAddTest() {
    this.testId = null
    this.form.reset({
      name: '',
      mark: '',
      description: '',
    })
    this.item.clear()
    this.modal.open?.()
    MaterialService.updateTextInputs()
  }

  get item() {
    return this.form.get('item') as FormArray
  }

  addItem() {
    const itemForm = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
    })
    this.item.push(itemForm)
  }
  removeItem(index: number) {
    this.item.removeAt(index)
  }

  onCancel() {
    this.modal.close?.()
  }
  onSubmit() {
    this.form.disable()
    const newTest: Test = {
      name: this.form.value.name,
      mark: this.form.value.mark,
      description: this.form.value.description,
      item: this.form.value.item,
      category: this.categoryId
    }
    const completed = () => {
      this.modal.close?.()
      this.form.reset({name: '', mark: '', description: ''})
      this.form.enable()
    }
    if (this.testId) {
      newTest._id = this.testId
      this.Sub = this.testServices.updateById(newTest).subscribe(
        test => {
          const idx = this.test.findIndex(n => n._id === test._id)
          this.test[idx] = test
          MaterialService.toast('Зміни було збережено')
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    } else {
      this.Sub = this.testServices.create(newTest).subscribe(
        test => {
          MaterialService.toast('Тест створений')
          this.test.push(test)
        },
        error => MaterialService.toast(error.error.message),
        completed
      )
    }
  }
  onDeleteTest(event: Event, test: Test) {
    event.stopPropagation();
    const decision = window.confirm(`Видалити тест ${test.name}?`);
    if (decision) {
      this.Sub = this.testServices.deleteById(test).subscribe(
        response => {
          const idx = this.test.findIndex(n => n._id === test._id);
          this.test.splice(idx, 1);
          MaterialService.toast(response.message);
        },
        error => MaterialService.toast(error.error.message)
      );
    }
  }
}
