import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonToggle, IonToolbar, IonBackButton, IonButtons, IonListHeader } from '@ionic/angular';
import { ProfileCard } from "../../components/profile-card/profile-card";
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-settings',
  imports: [
    IonBackButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon,
    IonItem,
    IonList,
    IonToggle,
    IonLabel,
    IonBackButton,
    IonButtons,
    ProfileCard,
    RouterLink,
    IonListHeader,
    ProfileCard
],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit{
  private router = inject(Router);
  private tokenService = inject(TokenService);

  ngOnInit(): void {
    
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigate(["auth"]);
  }
}
