import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonButton, IonIcon } from "@ionic/angular";

@Component({
  selector: 'lib-button',
  imports: [IonIcon, IonButton, ],
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
})
export class AppButton implements OnInit{ 
  @Input() buttonText?: string;
  @Input() disabled = false;
  @Input() shape?: string;
  @Input() icon?: string;
  @Input() iconPosition = 'start';
  @Input() color = 'primary';
  @Input() buttonType = 'block';
  @Input() fill = 'solid';
  @Input() size = 'default';
  @Output() action = new EventEmitter();

  ngOnInit(): void { 
    return;
  }
}
