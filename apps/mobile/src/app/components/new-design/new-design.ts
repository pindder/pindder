import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTextarea, IonButton, IonInput, 
  IonSelectOption, ViewWillEnter, IonSelect, IonSpinner, 
  IonIcon, IonAlert, IonItem, IonList, IonLabel, IonListHeader,
  ToastController,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
  ModalController,
} from "@ionic/angular";
import { DataTypes, DesignTypes, IColors, IDesign, IResponse, Sizes } from '@pindder/contracts';
import { CloudinaryModule } from '@cloudinary/ng';
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Camera } from '@capacitor/camera';
import { forkJoin } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core';
import { PrimaryButton } from '../primary-button/primary-button';
import { AppService } from '../../services/app.service';
import { Specification } from '../specification/specification';

@Component({
  selector: 'app-new-design',
  imports: [
    IonListHeader, 
    IonLabel, 
    IonList,
    IonItem,
    IonAlert,
    IonIcon,
    IonSpinner,
    IonTextarea,
    IonButton,
    IonContent,
    IonInput,
    CloudinaryModule,
    FormsModule,
    IonSelect,
    IonSelectOption,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    PrimaryButton
],
  templateUrl: './new-design.html',
  styleUrl: './new-design.css',
})
export class NewDesign implements ViewWillEnter, OnInit{
  @Output() closeModal = new EventEmitter();
  @Input() parentComponent?: string;  

  private designService = inject(DesignService);
  private appService = inject(AppService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private cdr = inject(ChangeDetectorRef);

  designType = DesignTypes;
  design!: IDesign;
  designTypes: string[] = [];
  sizes: string[] = [];
  selectedSizes: string[] = [];
  selectedColors: string[] = [];
  availableColors: IColors[] = [];

  uploadedImageUrls: string[] = [];
  isUploading: boolean = false;

  ionViewWillEnter(): void { 
    this.fetchColors();
  }

  fetchColors() {
    this.appService.fetchColors().subscribe({
      next: (res: IResponse<IColors[]>) => {
        this.availableColors = res.data || [];
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }

  ngOnInit(): void {
    Object.keys(DesignTypes).forEach((v) => {
      this.designTypes.push(v);
    });

    Object.keys(Sizes).forEach((v) => {
      this.sizes.push(v);
    });

    this.design = {
      name: "",
      description: "",
      amount: 0,
      category: "",
      type: "",
      sizes: [],
      specifications: [],
      images: [],
      colors: [],
      catalogDisplay: this.parentComponent && this.parentComponent === DataTypes.ORDER ? false : true
    }
  }

  dismissModal(style?: IDesign) {
    if(style) {
      this.modalCtrl.dismiss(style, 'design');
    } else{
      this.modalCtrl.dismiss(null, 'cancel');
    }
  }

  setResult(event: CustomEvent<OverlayEventDetail>) {
    console.log(`Dismissed with role: ${event.detail.role}`);
  }

  async presentToast(
    msg: string,
    color: 'danger' | 'light' | 'dark' | 'success' | 'primary' | 'secondary', 
    position: 'top' | 'middle' | 'bottom'
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      position: position,
      color: color,
      animated: true,
    });

    await toast.present();
  }

  async selectAndUploadMultipleImages() {
    try {
      // 1. Pick photos from gallery (Capacitor Camera allows multiple on web/mobile)
      const galleryPhotos = await Camera.pickImages({
        quality: 90,
        limit: 5, // Set max images user can pick at once
      });

      if (!galleryPhotos.photos.length) return;

      this.isUploading = true;
      this.cdr.markForCheck();

      // 2. Convert each webPath to a Blob
      const blobPromises = galleryPhotos.photos.map(async (photo) => {
        const response = await fetch(photo.webPath);
        return await response.blob();
      });

      const blobs = await Promise.all(blobPromises);

      // 3. Upload all blobs concurrently to Cloudinary
      const uploadObservables = blobs.map((blob) =>
        this.designService.uploadImageToCloudinary(blob)
      );

      forkJoin(uploadObservables).subscribe({
        next: (responses: any[]) => {
          const newUrls = responses.map((res) => res.secure_url);
          this.uploadedImageUrls = [...this.uploadedImageUrls, ...newUrls];
          this.isUploading = false;
          //console.log(this.uploadedImageUrls);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Cloudinary multi-upload failed:', err);
          this.isUploading = false;
        },
      });
    } catch (error) {
      console.error('Photo selection cancelled or error:', error);
      this.isUploading = false;
    }
  }

  async openSpecificationModal() {
    const modal = await this.modalCtrl.create({
      component: Specification,
      componentProps: {
        specifications: this.design.specifications,
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if(data) {
      this.design.specifications = data;
    }
  }

  removeImage(index: number) {
    this.uploadedImageUrls.splice(index, 1);
  }

  onSizesChange(size: any) {
    this.selectedSizes = size.detail.value;
    //console.log(this.selectedSizes);
  }

  onColorChange(color: any) { 
    console.log(color.detail.value);
  }

  submit() {
    this.design.sizes = this.selectedSizes;
    this.design.images = this.uploadedImageUrls;
    
    console.log(this.selectedColors);
    this.selectedColors.forEach((colorId) => {
      const color = this.availableColors.find(c => c._id === colorId);
      if(color) {
        this.design.colors.push(color);
      }
    });

    console.log(this.design);

    this.designService.createDesign(this.design).subscribe({
      next: (res: IResponse<IDesign>) => {
        this.presentToast(res.msg, 'primary', 'top'); 
        this.closeModal.emit(res.data);
        this.dismissModal(res.data);
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }
}
