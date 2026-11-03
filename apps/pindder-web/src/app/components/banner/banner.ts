import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonIcon } from "@ionic/angular";

@Component({
  selector: 'app-banner',
  imports: [IonIcon, RouterLink],
  templateUrl: './banner.html',
  styleUrl: './banner.css',
})
export class Banner {}
