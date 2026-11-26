import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonInput, IonButton } from "@ionic/angular";

@Component({
  selector: 'app-footer',
  imports: [IonInput, IonIcon, IonButton, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  email!: string;

  submit() {
    return;
  }
}
