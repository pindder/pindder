import { ChangeDetectorRef, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTextarea, IonButton, IonInput, 
  IonSelectOption, ViewWillEnter, IonSelect, IonSpinner, 
  IonIcon, IonAlert,
  ToastController,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonHeader,
  ModalController,
} from "@ionic/angular";
import { DataTypes, DesignTypes, IDesign, IResponse, Sizes } from '@pindder/contracts';
import { CloudinaryModule } from '@cloudinary/ng';
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Camera } from '@capacitor/camera';
import { forkJoin } from 'rxjs';
import { OverlayEventDetail } from '@ionic/core';

@Component({
  selector: 'app-new-design',
  imports: [
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
  ],
  templateUrl: './new-design.html',
  styleUrl: './new-design.css',
})
export class NewDesign implements ViewWillEnter, OnInit{
  @Output() closeModal = new EventEmitter<string>();

  private designService = inject(DesignService);
  private toastController = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private cdr = inject(ChangeDetectorRef);

  design!: IDesign;
  designTypes: string[] = [];
  sizes: string[] = [];
  selectedSizes: string[] = [];

  uploadedImageUrls: string[] = [];
  isUploading: boolean = false;

  ionViewWillEnter(): void { }

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
      images: []
    }
  }

  dismissModal() {
    this.modalCtrl.dismiss(null, 'cancel');
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
      duration: 1500,
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

  removeImage(index: number) {
    this.uploadedImageUrls.splice(index, 1);
  }

  onSizesChange(size: any) {
    this.selectedSizes = size.detail.value;
    console.log(this.selectedSizes);
  }

  submit() {
    this.design.sizes = this.selectedSizes;
    this.design.images = this.uploadedImageUrls;
    // console.log(this.design);

    this.designService.createDesign(this.design).subscribe({
      next: (res: IResponse<IDesign>) => {
        this.presentToast(res.msg, 'primary', 'top'); 
        this.closeModal.emit(DataTypes.DESIGN);
      }, 
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.presentToast(error.message, 'danger', 'top');
      }
    });
  }
}
