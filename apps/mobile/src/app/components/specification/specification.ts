import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonTitle, IonInput, IonToolbar, ModalController, IonModal, IonSelect, IonSelectOption, IonItemSliding, IonItemOption, IonItemOptions, IonNote } from '@ionic/angular';
import { ViewWillEnter } from '@ionic/angular/common';
import { IClient, IColors, IDesign, IResponse, ISpecification, Sizes } from '@pindder/contracts';
import { AppService } from '../../services/app.service';
import { HttpErrorResponse } from '@angular/common/http';
import { PrimaryButton } from '../primary-button/primary-button';

@Component({
  imports: [IonInput, IonModal, IonSelect, IonSelectOption, FormsModule,
    IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, IonButton,
    IonIcon, IonList, IonItem, IonLabel, PrimaryButton, IonItemSliding, IonItemOptions,
    IonIcon, IonList, IonItem, IonLabel, PrimaryButton, IonItemSliding, IonItemOption, IonNote],
  templateUrl: './specification.html',
  styleUrl: './specification.css',
})
export class Specification implements OnInit, ViewWillEnter {
  @ViewChild('modal') modal!: IonModal;
  @Input() specifications: ISpecification[] = [];
  @Input() client!: IClient;
  @Input() design!: IDesign;

  private appService = inject(AppService);

  availableColors: IColors[] = [];
  selectedColors: IColors[] = [];
  activeIndex: number | null = null;

  specification: ISpecification = new ISpecification();

  sizes = Object.keys(Sizes);

  private modalCtrl = inject(ModalController);

  public alertButtons = ['OK'];

  ionViewWillEnter(): void {
    this.fetchColors();
  }

  ngOnInit(): void {
    this.fetchColors();
  }

  fetchColors() {
    this.appService.fetchColors().subscribe({
      next: (res: IResponse<IColors[]>) => {
        this.availableColors = res.data || [];
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        //this.presentToast(error.message, 'danger', 'top');
      }
    });
  }

  deleteSpecification(index: number) {
    this.specifications.splice(index, 1);
  }

  editSpecification(index: number) {
    this.activeIndex = index;
    console.log(this.activeIndex);
    this.specification = this.specifications[index];
    if(this.specifications[index].colors) {
      this.selectedColors = this.specifications[index].colors;
    } else {
      this.selectedColors = [];
    };
    this.modal.present();
  }

  onSizesChange(size: any) {
    console.log(size);
  }

  isColorSelected(code: string): boolean {
    return this.selectedColors.some((c) => c.code === code);
  }

  toggleColor(color: IColors): void {
    const index = this.selectedColors.findIndex((c) => c.code === color.code);
    console.log(index);
    if (index > -1) {
      this.selectedColors.splice(index, 1);
    } else {
      this.selectedColors.push(color);
    }

    console.log(this.selectedColors);
  }

  // Ensures checkmark icon is readable on light vs dark colors
  getContrastColor(hex: string): string {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 180 ? '#000000' : '#FFFFFF';
  }

  dismissModal() {
    this.modalCtrl.dismiss(this.specifications, 'data');
  }

  saveSpecification() {
    console.log(this.activeIndex)
    if(this.activeIndex != null) {
      this.specification.colors = this.selectedColors;
      this.specifications[this.activeIndex] = this.specification;
    }else {
      this.specification.colors = this.selectedColors;
      this.specifications.push(this.specification);
      this.selectedColors = [];
    }
    this.activeIndex = null;
    this.specification = new ISpecification();

    console.log(this.specifications);
  }
}
