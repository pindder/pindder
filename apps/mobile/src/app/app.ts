import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
//import { NxWelcome } from './nx-welcome';
import { IonRouterOutlet, IonApp } from "@ionic/angular";

@Component({
  imports: [IonApp, RouterModule, IonRouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'mobile';
}
