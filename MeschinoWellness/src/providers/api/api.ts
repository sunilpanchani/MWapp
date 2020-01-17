import { RequestOptions,Headers } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WellnessConstants } from '../settings/wellnessconstant';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = "https://www.meschinowellness.com/";//WellnessConstants.App_Url;
  constructor(public http: HttpClient) {
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url +  endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    //const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    const headers = new Headers(
      { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        "Access-Control-Allow-Origin": this.url,
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type"
      });
    reqOpts = new RequestOptions({headers:headers});
    
    if(this.url !== null && this.url !== undefined && endpoint != null && endpoint !== undefined)
    {
      const _endUrl = this.url + endpoint;
      console.log(_endUrl, "end point url");
      return this.http.post(_endUrl, body, reqOpts);
    }
    else
    {
      alert("URL is undefined");
      return;
    }

  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url +  endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + endpoint, body, reqOpts);
  }
}
