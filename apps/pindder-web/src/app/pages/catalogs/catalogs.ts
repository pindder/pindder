import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { IDesign, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { IonButton, IonContent, IonIcon, IonHeader, IonCardContent, IonGrid, IonRow, IonCol, IonToolbar, IonTitle, IonCardTitle, IonCard, IonBadge, IonCardHeader, IonCardSubtitle, ModalController, IonButtons } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { AppButton } from '@pindder/shared-ui';
import { NewStyle } from '../new-style/new-style';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-catalogs',
  imports: [IonCardSubtitle, IonHeader, IonContent, IonButton, IonIcon,
    IonCardContent, IonGrid, IonRow, IonCol, IonToolbar, IonTitle, IonCardTitle, IonCard,
    IonBadge, IonCardHeader, IonCard, CommonModule, AppButton, IonButtons],
  templateUrl: './catalogs.html',
  styleUrl: './catalogs.scss',
})
export class Catalogs implements OnInit{
  private ar = inject(ActivatedRoute);
  private modalCtrl = inject(ModalController);
  private catalogService = inject(CatalogService);
  private tokenService = inject(TokenService); 

  styles = signal<IDesign[]>([]);
  catalog_id = signal<string>('');
  isAuthenticated!: boolean;

  async ngOnInit() {
    this.isAuthenticated = await this.tokenService.isAuthenticated()  
    this.fetchCatalogs();
  }

  fetchCatalogs() {
    this.catalog_id.set(this.ar.snapshot.paramMap.get('id') ?? '');

    if(!this.catalog_id()) {
      console.log('catalog_id is empty:', this.catalog_id());
      return;
    }

    this.catalogService.fetchTailorCatalogs(this.catalog_id()).subscribe({
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

  async openNewStyleModal() {
    const modal = await this.modalCtrl.create({
      component: NewStyle
    });

    await modal.present();

    //Listen for the selected design payload when dismissed
    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log(data);
    }
  }
}
