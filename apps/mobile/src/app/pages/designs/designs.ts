import { Component, inject } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent, ViewWillEnter } from "@ionic/angular";
import { DesignService } from '../../services/design.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IDesign } from '@pindder/contracts';
import { EmptyState } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-designs',
  imports: [IonContent, IonBackButton, IonButtons, IonToolbar, IonHeader, IonTitle, EmptyState],
  templateUrl: './designs.html',
  styleUrl: './designs.css',
})
export class Designs implements ViewWillEnter{
  private designService = inject(DesignService);

  designs: IDesign[] = [];

  ionViewWillEnter(): void {
    this.fetchDesigns();
  }

  fetchDesigns() {
    this.designService.fetchDesigns().subscribe((val) => {
      this.designs = val;
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
