import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthServices } from "./shared/services/auth.services";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private auth: AuthServices) {
  }

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const potentialToken = localStorage.getItem('auth-token')
      if (potentialToken !== null) {
        this.auth.setToken(potentialToken)
      }
    }
  }
}
