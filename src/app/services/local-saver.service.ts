import { Injectable } from '@angular/core';
import * as fileSaver from 'file-saver';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalSaverService {

  constructor() { }

  saveHttpResponseAs(rsp: HttpResponse<Blob>) {
    var blob = rsp.body;
    let filename = this.getFilenameFromResponse(rsp)
    fileSaver.saveAs(blob, filename);
  }

  saveBlobAs(blob: Blob, filename: string) {
    fileSaver.saveAs(blob, filename);
  }

  saveStringAs(fileAsString: string, filename: string) {
    var blob = new Blob([fileAsString], {type: "text/plain;charset=utf-8"});
    fileSaver.saveAs(blob, filename);
  }

  private getFilenameFromResponse(response: HttpResponse<Blob>): string {
    const contentDisposition = response.headers.get('Content-Disposition') || '';
    const matches = /filename=([^;]+)/ig.exec(contentDisposition);
    const fileName = (matches[1].replace(/"/ig, '') || 'untitled').trim();
    return fileName;
  }

}
