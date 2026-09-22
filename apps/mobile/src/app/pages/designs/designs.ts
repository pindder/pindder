import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonContent, ViewWillEnter, IonGrid, 
  IonRow, IonCol, IonIcon, IonButton, 
  ModalController
} from "@ionic/angular";
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataTypes, IDesign } from '@pindder/contracts';
import { EmptyState } from '../../components/empty-state/empty-state';
import { ListCard } from '../../components/list-card/list-card';
import { Router } from '@angular/router';
import { NewDesign } from '../../components/new-design/new-design';

@Component({
  selector: 'app-designs',
  imports: [IonIcon, IonButton, IonCol, IonRow, IonContent, IonBackButton, IonButtons, 
    IonToolbar, IonHeader, IonTitle, EmptyState, ListCard, 
    IonGrid, IonRow
  ],
  templateUrl: './designs.html',
  styleUrl: './designs.css',
})
export class Designs implements ViewWillEnter{
  private designService = inject(DesignService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);

  dataTypes = DataTypes;
  designs: IDesign[] = [];

  ionViewWillEnter(): void {
    this.fetchDesigns();
  }

  gotoStyle(style_id: string) {
    this.router.navigate(['app/styles/', style_id]);
  }

  fetchDesigns() {
    this.designService.fetchDesigns().subscribe({
      next: (data) => {
        this.designs = data;
        this.cdr.markForCheck(); // Force Angular to update the view immediately
      },
      error: (err: HttpErrorResponse) => console.error(err)
    });
  }

  updateDesignsList(design: IDesign) {
    const index = this.designs.findIndex(d => d._id === design._id);
    this.designs.splice(index, 1);
    this.cdr.markForCheck();
  }

  async openNewDesignModal() {
    const modal = await this.modalCtrl.create({
      component: NewDesign
    });

    await modal.present();
  }
}
