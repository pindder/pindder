import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonTextarea, IonButton, IonInput, IonSelectOption, ViewWillEnter } from "@ionic/angular";
import { DesignTypes, IDesign, Sizes } from '@pindder/contracts';
import { CloudinaryModule } from '@cloudinary/ng';
import { Cloudinary } from '@cloudinary/url-gen';
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-design',
  imports: [IonTextarea, IonButton, IonContent, IonInput, CloudinaryModule, FormsModule, IonSelectOption],
  templateUrl: './new-design.html',
  styleUrl: './new-design.css',
})
export class NewDesign implements ViewWillEnter{
  private designService = inject(DesignService);

  design!: IDesign;
  designTypes: string[] = [];
  sizes: string[] = [];
  selectedSizes: string[] = [];

  ionViewWillEnter(): void {
    const cld = new Cloudinary({
      cloud: {
        cloudName: 'demo'
      },
      url: {
        secureDistribution: 'www.example.com', 
        secure: true 
      }
    });

    Object.keys(DesignTypes).forEach((v) => {
      this.designTypes.push(v);
    })

    Object.keys(Sizes).forEach((v) => {
      this.sizes.push(v);
    })

    console.log(this.designTypes);
    console.log(cld);

    this.design = {
      designName: "",
      description: "",
      amount: 0,
      category: "",
      type: "",
      sizes: []
    }
  }

  onSizesChange(size: any) {
    this.selectedSizes = size.detail.value;
    console.log(this.selectedSizes);
  }

  submit() {
    this.design.sizes = this.selectedSizes;
    console.log(this.design);

    this.designService.createDesign(this.design).subscribe((val) => {
      console.log(val);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
