import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { IDesign, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonContent, IonIcon, IonInput, IonItem, ToastController, IonHeader, IonTextarea, IonLabel, IonSelect, IonSelectOption, IonCardContent, IonGrid, IonRow, IonCol, IonToolbar, IonTitle, IonCardTitle, IonCard, IonBadge, IonCardHeader, IonCardSubtitle } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface DesignItem {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-catalogs',
  imports: [IonCardSubtitle, IonHeader, IonContent, IonButton, IonIcon, IonInput, IonItem, IonTextarea, IonLabel, IonSelect,
    IonSelectOption, IonCardContent, IonGrid, IonRow, IonCol, IonToolbar, IonTitle, IonCardTitle, IonCard,
    IonBadge, IonCardHeader, IonCard, CommonModule, ReactiveFormsModule
  ],
  templateUrl: './catalogs.html',
  styleUrl: './catalogs.scss',
})
export class Catalogs implements OnInit{
  private ar = inject(ActivatedRoute);
  private catalogService = inject(CatalogService);
  private fb = inject(FormBuilder);
  private toastController = inject(ToastController);

  uploadForm!: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  styles = signal<IDesign[]>([]);

  designs: DesignItem[] = [
    {
      id: 1,
      title: 'Modern Minimalist Jacket',
      category: 'Casual',
      price: 120.0,
      description: 'Clean silhouette design crafted with premium cotton blend.',
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'Silk Evening Gown',
      category: 'Formal',
      price: 250.0,
      description: 'Elegant floor-length silk gown with tailored fitting.',
      imageUrl: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 3,
      title: 'Urban Streetwear Hoodie',
      category: 'Streetwear',
      price: 85.0,
      description: 'Relaxed fit with custom contrast stitching details.',
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600'
    }
  ];

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.selectedFile = file;

      // Update form control
      this.uploadForm.patchValue({ image: file });
      this.uploadForm.get('image')?.updateValueAndValidity();

      // Read file preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.uploadForm.patchValue({ image: null });
  }

  async onSubmit() {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('title', this.uploadForm.get('title')?.value);
      formData.append('category', this.uploadForm.get('category')?.value);
      formData.append('description', this.uploadForm.get('description')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      // Process upload request to backend here...
      console.log('Submitting custom design:', this.uploadForm.value);

      const toast = await this.toastController.create({
        message: 'Your custom design has been submitted successfully!',
        duration: 3000,
        color: 'success',
        position: 'top'
      });
      await toast.present();

      // Reset Form
      this.uploadForm.reset();
      this.removeImage();
    }
  }

  ngOnInit(): void {
    this.fetchCatalogs();
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', Validators.required],
      description: [''],
      image: [null, Validators.required]
    });
  }

  fetchCatalogs() {
    this.catalogService.fetchTailorCatalogs(this.ar.snapshot.paramMap.get('id')!).subscribe({
      next: (response: IResponse<any[]>) => {
        if(response.data) {
          this.styles.set(response.data); 
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
}
