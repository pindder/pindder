import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular";

@Component({
  selector: 'app-primary-button',
  imports: [IonButton, IonIcon],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.css',
})
export class PrimaryButton implements OnInit{
  @Input() buttonText = 'Primary Button';
  @Input() disabled = false;
  @Input() shape?: string;
  @Input() icon?: string;
  @Input() color = 'primary';
  @Input() buttonType = 'block';
  @Input() fill = 'solid';
  @Output() action = new EventEmitter();

  ngOnInit(): void { 
    return;
  }
}
