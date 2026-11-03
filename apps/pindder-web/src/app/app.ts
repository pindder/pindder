import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonRouterOutlet, IonApp } from "@ionic/angular";

@Component({
  imports: [RouterModule, IonApp, IonRouterOutlet ],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'pindder-web';
}
