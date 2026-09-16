import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { IDesign } from '@pindder/contracts';

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

  createDesign(design: IDesign): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/designs`, design);
  }

  fetchDesigns() {
    return this.http.get<any>(`${environment.apiUrl}/designs`);
  }
}
