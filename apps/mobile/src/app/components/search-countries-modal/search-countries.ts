import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalController, IonContent, IonButtons, IonToolbar, IonHeader, IonButton, IonTitle, IonSearchbar, IonList, IonItem, IonLabel,

} from '@ionic/angular';

@Component({
  selector: 'app-search-countries',
  imports: [IonHeader, IonHeader, IonContent, IonButtons, IonToolbar, FormsModule,
    IonButton, IonTitle, IonSearchbar, IonList, IonItem, IonLabel
  ],
  templateUrl: './search-countries.html',
  styleUrl: './search-countries.css',
})
export class SearchCountries implements OnInit{
  @Input() countries: any[] = [];
  filteredCountries: any[] = [];
  searchTerm = '';

  private modalController = inject(ModalController);

  ngOnInit() {
    this.filteredCountries = [...this.countries];
  }

  filterCountries() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCountries = this.countries.filter(
      (c) =>
        c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term)
    );
  }

  selectCountry(country: any) {
    this.modalController.dismiss(country);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
