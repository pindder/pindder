import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonList, IonTitle, IonToolbar, ViewWillEnter } from '@ionic/angular';
import { AppService } from '../../services/app.service';
import { DataTypes, IBrand, IProfile, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenService } from '../../services/token.service';
import { ItemList } from '@pindder/shared-ui';
import { Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  imports: [ItemList, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList],
  templateUrl: './brands.html',
  styleUrl: './brands.css',
})
export class Brands implements OnInit, ViewWillEnter{
  private appService = inject(AppService);
  private cdr = inject(ChangeDetectorRef);
  private tokenService = inject(TokenService);
  private router = inject(Router);

  account!: IProfile;
  brands: IBrand[] = [];
  dataTypes = DataTypes;

  ionViewWillEnter(): void {
    return;
  }

  async ngOnInit() {
    const profile = await this.tokenService.getProfile();
    if(profile) {
      this.account = JSON.parse(profile);
    }
    this.fetchBrands();
  }

  fetchBrands() {
    this.appService.fetchBrands().subscribe({
      next: (response: IResponse<IBrand[]>) => {
        if(response.data) this.brands = response.data;
        console.log(this.brands);
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  viewBrand(id: string) {
    this.router.navigate(['app/brands/' + id]);
  }
}
