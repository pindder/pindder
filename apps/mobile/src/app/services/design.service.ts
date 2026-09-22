import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IDesign, IResponse } from '@pindder/contracts';

@Injectable({
  providedIn: 'root',
})
export class DesignService {
  private http = inject(HttpClient)

  private cloudName = environment.cloudName;       // Replace with your Cloudinary Cloud Name
  private uploadPreset = environment.presetName; // Replace with your Unsigned Preset Name

  uploadImageToCloudinary(blob: Blob): Observable<any> {
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post(
      `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`,
      formData
    );
  }

  createDesign(design: IDesign): Observable<IResponse<IDesign>> {
    return this.http.post<IResponse<IDesign>>(`${environment.apiUrl}/designs`, design);
  }

  fetchDesigns(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/designs`);
  }

  fetchDesign(design_id: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/designs/${design_id}`);
  }

  searchDesign(query: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/designs/search?q=${query}`);
  }

  removeDesign(design_id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiUrl}/designs/${design_id}`);
  }
}
