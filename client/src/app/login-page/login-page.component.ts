import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {NgClass, NgIf} from "@angular/common";
import {AuthServices} from "../shared/services/auth.services";
import {Subscription} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {MaterialService} from "../shared/classes/material.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form!: FormGroup
  Sub!: Subscription
  constructor(private auth: AuthServices, private router: Router, private route: ActivatedRoute) {
  }
  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
    this.route.queryParams.subscribe((params: Params) => {
      if (params['registered']) {
        MaterialService.toast('Реєстрацію успішно виконано')
      } else if (params['sessionFailed']) {
        MaterialService.toast('Будь-ласка увійдіть в сиситему знову')
      }
    })
  }

  onSubmit(): void {
    this.Sub = this.auth.login(this.form.value).subscribe({
      next: () => {
        this.router.navigate(['/main'])
      },
      error: (error) => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      },
    })
  }
  ngOnDestroy() {
    if (this.Sub) {
      this.Sub.unsubscribe()
    }
  }

}
