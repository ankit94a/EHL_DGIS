import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable, of, throwError } from 'rxjs';
import { environment } from '../enviroments/environments.development';
import { AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { LoginModel } from '../models/login.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,private toastr:ToastrService,private router: Router,private dailog:MatDialog) { }

  getWithHeaders(url: string): Observable<any> {
    return this.http.get(`${this.baseUrl}${url}`).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((error) => {
        return this.showError(error);
      })
    );
  }
    getWithHeadersForToken(url: string): Observable<any> {
      
    return this.http.get(`https://dgisapp.army.mil:55102/Temporary_Listen_Addresses/${url}`).pipe(
      map((res: any) => {
    
        if (res) {
          return res;
        }
      }),
      catchError((error) => {
        return this.showError(error);
      })
    );
  }
    postWithHeaderToDownload(url: string, data: any,): Observable<Blob> {
    const options = {
    responseType: 'blob' as 'json'        
  };
    return this.http.post(`${this.baseUrl}${url}`, data, options).pipe(
      catchError((error: any) => {
        return this.showError(error);;
      })
    );
  }

  

  postWithHeader(url: string, Data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}` + url, Data,{
      withCredentials:true
    }).pipe(map(
      (res: any) => {
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {
          return this.showError(error);
        }
      ))
  }
    postWithHeaderForToken(url: string, Data: any): Observable<any> {
    return this.http.post('https://dgisapp.army.mil:55102/Temporary_Listen_Addresses/' + url, Data,{
      // withCredentials:true
    }).pipe(map(
      (res: any) => {
       
        if (res) {
          return res;
        }
      }), catchError(
        (error: any) => {
         
          return this.showError(error);
        }
      ))
  }
  clear() {
    sessionStorage.clear();
    this.navigateToLogin(this.router.routerState.snapshot.url);

  }
  public navigateToLogin(stateUrl) {
    this.router.navigate(['/landing'], { queryParams: { 1: { returnUrl: stateUrl } } });
  }
    public setWingDetails(wing: { id: string; name: string }) {
    sessionStorage.setItem('wingId', wing.id);
    sessionStorage.setItem('wing', wing.name);
  }
   public clearWingDetails() {
    sessionStorage.removeItem('wingId');
    sessionStorage.removeItem('wing');
  }
 onLoggedout() {
    var user = new LoginModel()
    this.postWithHeader('auth/logout',user).subscribe(res => {
      if (res) {
        this.dailog.closeAll();
        this.clear()
        this.clearWingDetails();
      }
    })

  }
  public showError(error: any): Observable<any> {

    let message = 'An unknown error occurred';
       if (error.error.status === 455) {
    message =
      error.error?.message || error.error?.title || 'Unauthorized access';
        this.onLoggedout();
    return throwError(() => ({
      status: 455,
      error: {
        message
      }
    }));
  }else if(error.status == 403 || error.status == 401){
 
      message =
      error.error?.message || error.error?.title || error.error.errorMessage;
      this.onLoggedout();
     return throwError(() => ({
      status: 403,
      error: {
        message
      }
    }));
  }else if(error.status ==400){
    return throwError(()=>error)
  }
      else if (error.error != null && (typeof error.error === 'object' || error.constructor == Object)) {
        this.toastr.error(error.error.title.toString(), "error");
        return throwError(() => error);
      }
    return EMPTY;
  }

  checkRequiredFieldsExceptEmerFile(form,fileType): boolean {
    const controls = form.controls;
    for (const key in controls) {
      if (key === fileType) continue;
      const control = controls[key];
      const validator = control.validator ? control.validator({} as AbstractControl) : null;
      const hasRequired = validator && validator['required'];
      if (hasRequired && (control.invalid || control.value === '' || control.value === null)) {
        return false;
      }
    }
    return true;
  }
}
