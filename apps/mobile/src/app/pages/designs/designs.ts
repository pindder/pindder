import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, 
  IonBackButton, IonContent, ViewWillEnter, IonGrid, 
  IonRow, IonCol 
} from "@ionic/angular";
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DataTypes, IDesign } from '@pindder/contracts';
import { EmptyState } from '../../components/empty-state/empty-state';
import { ListCard } from '../../components/list-card/list-card';

@Component({
  selector: 'app-designs',
  imports: [IonCol, IonRow, IonContent, IonBackButton, IonButtons, 
    IonToolbar, IonHeader, IonTitle, EmptyState, ListCard, 
    IonGrid, IonRow
  ],
  templateUrl: './designs.html',
  styleUrl: './designs.css',
})
export class Designs implements ViewWillEnter{
  private designService = inject(DesignService);
  private cdr = inject(ChangeDetectorRef);

  dataTypes = DataTypes;
  designs: IDesign[] = [];

  ionViewWillEnter(): void {
    this.fetchDesigns();
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
}
