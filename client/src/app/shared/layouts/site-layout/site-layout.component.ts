import { Component, HostListener, OnInit } from "@angular/core";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import { NgClass, NgForOf, NgStyle } from "@angular/common";
import {AuthServices} from "../../services/auth.services";
import { FooterComponent } from "../../components/footer/footer.component";

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    NgForOf,
    RouterLinkActive,
    NgClass,
    FooterComponent,
    NgStyle
  ],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css'
})
export class SiteLayoutComponent implements OnInit{
  sidenavHidden = false;
  links = [
    { url: '/main', name: 'Головна сторінка' },
    { url: '/adminPanel', name: 'AdminPanel' },
    { url: '/feedback', name: 'Зворотній зв\'язок' },
    { url: '/categoryAll', name: 'Категорії' },
    { url: '/personalOffice', name: 'Особистий кабінет' }
  ];

  constructor(private auth: AuthServices, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.sidenavHidden = true;
    }, 5000);
  }

  onMouseEnter() {
    this.sidenavHidden = false;
  }

  onMouseLeave() {
    this.sidenavHidden = true;
  }

  toggleSidenav() {
    this.sidenavHidden = !this.sidenavHidden;
  }

  logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  get contentStyle() {
    return this.sidenavHidden ?
      { 'margin-left': '50px', 'width': 'calc(100% - 50px)' } :
      { 'margin-left': '250px', 'width': 'calc(100% - 250px)' };
  }
}
