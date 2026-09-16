import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTextarea, IonButton, IonInput, 
  IonSelectOption, ViewWillEnter, IonSelect, IonSpinner, 
  IonIcon,
} from "@ionic/angular";
import { DesignTypes, IDesign, Sizes } from '@pindder/contracts';
import { CloudinaryModule } from '@cloudinary/ng';
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Camera } from '@capacitor/camera';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-new-design',
  imports: [IonIcon, IonSpinner, IonTextarea, IonButton, IonContent, IonInput, CloudinaryModule, FormsModule, IonSelect, IonSelectOption, IonSpinner],
  templateUrl: './new-design.html',
  styleUrl: './new-design.css',
})
export class NewDesign implements ViewWillEnter, OnInit{
  private designService = inject(DesignService);

  design!: IDesign;
  designTypes: string[] = [];
  sizes: string[] = [];
  selectedSizes: string[] = [];

  uploadedImageUrls: string[] = [];
  isUploading: boolean = false;

  ionViewWillEnter(): void {
    
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
      images: []
    }
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
          console.log(this.uploadedImageUrls);
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
    console.log(this.design);

    this.designService.createDesign(this.design).subscribe((val) => {
      console.log(val);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
