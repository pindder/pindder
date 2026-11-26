import { Component, OnInit } from '@angular/core';
import { IonIcon } from "@ionic/angular";
import { NgClass } from '@angular/common';

export interface Step {
  id: string;
  title: string;
  list: string[];
  image: string;
}

@Component({
  selector: 'app-guide',
  imports: [IonIcon, NgClass],
  templateUrl: './guide.html',
  styleUrl: './guide.css',
})
export class Guide implements OnInit{
  steps!: Step[];

  ngOnInit(): void {
    this.steps = [
      { id: '1', title: 'Create an account', list: ['Download our app', 'Sign up or login'], image: ''},
      { id: '2', title: 'Save client data', list: ['Edit client data', 'Sort client data'], image: ''},
      { id: '3', title: 'Create an order', list: ['Create orders', 'Track orders'], image: ''},
    ]
  }
}
