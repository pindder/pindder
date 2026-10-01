import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonList, IonContent,
  IonSearchbar, ModalController
} from "@ionic/angular";
import { DataTypes, IClient, IResponse } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
import { ListCard } from '../../components/list-card/list-card';
import { NewClient } from '../../components/new-client/new-client';
import { catchError, map, Observable, of, shareReplay, Subject, tap } from 'rxjs';
import { AppService } from '../../services/app.service';
import { AsyncPipe } from '@angular/common';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { EmptyState } from '../../components/empty-state/empty-state';

@Component({
  selector: 'app-clients',
  imports: [
    IonSearchbar,
    IonList,
    IonContent,
    IonBackButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonTitle,
    ListCard,
    IonList,
    AsyncPipe,
    PrimaryButton,
    EmptyState
],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements ViewWillEnter, OnInit{
  private clientService = inject(ClientService);
  private appService = inject(AppService);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);
  private searchSubject = new Subject<string>();

  //clients: IClient[] =  [];
  dataTypes = DataTypes;
  clients$!: Observable<IClient[]>;
  isLoading: boolean = false;

  ionViewWillEnter() {
    this.fetchClients();
  }

  ngOnInit(): void {
    this.clients$ = this.appService.createSearchStream<IClient>(
      this.searchSubject,
      (query) => this.clientService.searchClient(query).pipe(
        map((res: IResponse<any>) => res.data || []),
        tap((clients) => {
          this.clients$ = of(clients);
          console.log('Fetched Clients:', this.clients$);
          this.cdr.markForCheck(); // Trigger change detection when new data arrives
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Fetch Orders Error:', error);
          this.clients$ = of([]); // Reset on error
          this.cdr.markForCheck();
          return of([]); // Return empty array to keep search stream alive
        })
      ),
      (loading) => {
        this.isLoading = loading;
        this.cdr.markForCheck(); // Trigger change detection for loading state updates
      },
      // Triggered when search bar is CLEARED (query is empty)
      () => this.clientService.fetchClients().pipe(
        map((res: IResponse<IClient[]>) => res.data || [])
      )
    )
    .pipe(
      shareReplay(1), // 👈 Share execution across multiple async pipe subscriptions
      tap(() => this.cdr.markForCheck()) // Force change detection on data emit
    );
  }

  fetchClients() {
    this.clients$ = of([]);

    this.clients$ = this.clientService.fetchClients()
    .pipe(
      map((res: IResponse<any>) => res.data || []),
      catchError((error: HttpErrorResponse) => {
        console.error('Fetch Orders Error:', error);
        return of([]); // Return empty array on error to keep stream alive
      }),
      tap((clients) => {
        this.isLoading = false;
        console.log(clients);
      })
    );
    this.cdr.markForCheck();
  }

  updateClientsList(client: IClient) {
    this.clients$ = this.clients$.pipe(
      map((clients: IClient[]) => clients.filter(cl => cl._id !== client._id))
    )
    console.log(this.clients$);
    this.cdr.markForCheck(); // Trigger change detection for OnPush
  }

  async openNewClientModal() {
    const modal = await this.modalCtrl.create({
      component: NewClient, // Standalone modal component for searching clients
      componentProps: {
        origin: DataTypes.CLIENT
      }
    });

    await modal.present();

    //Listen for the selected client payload when dismissed
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.clients$ = this.clients$.pipe(
        map((clients: IClient[]) => [...clients, data])
      );
      console.log(this.clients$)
      this.cdr.markForCheck();
    }
  }

  onSearchInput(event: any) {
    const value = event.target.value || '';
    this.searchSubject.next(value);
  }
}
