import {Component, OnDestroy, OnInit} from '@angular/core'
import {NgClass, NgIf} from "@angular/common"
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms"
import {AuthServices} from "../shared/services/auth.services"
import {Router} from "@angular/router"
import {Subscription} from "rxjs"
import {MaterialService} from "../shared/classes/material.service"

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.css'
})
export class RegisterPageComponent implements OnInit, OnDestroy {
  form!: FormGroup
  aSub!: Subscription
  constructor(private auth: AuthServices, private router: Router) {
  }
  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }
  ngOnDestroy() {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.register(this.form.value).subscribe(
      () => {
        this.router.navigate(['/login'], {
          queryParams: {
            registered: true
          }
        })
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }
}
