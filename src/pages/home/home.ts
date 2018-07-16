import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private history: string[] = [];
  private currentResult: string = "N/A";

  constructor(
    public navCtrl: NavController,
    private ref: ChangeDetectorRef,
    private qrScanner: QRScanner,
    private httpClient: HttpClient) {
  }

  private scanAction() {
    this.startScanning();
    this.showCamera();
  }

  private startScanning() {
    // Start a scan. Scanning will continue until something is detected or
    // `QRScanner.cancelScan()` is called.
    this.currentResult = "Scanning...";
    this.qrScanner.scan().subscribe(
      (text) => {
        if (this.history.indexOf(text) == -1) {
          console.log(text);
          this.history.push(text);
          this.currentResult = text;
          this.ref.detectChanges();
          this.httpClient.get(text).subscribe(
            res => console.log(res)
          );
        }
        // Continuously scan
        this.startScanning();
      }
    )

    // Make the webview transparent so the video preview is visible behind it.
    this.qrScanner.show();
    // Be sure to make any opaque HTML elements transparent here to avoid
    // covering the video.
  }

  private showCamera() {
    // Make background transparent to show the video feed
   (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
  }

  private hideCamera() {
   (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
   let content = <HTMLElement>document.getElementsByTagName("body")[0];
   content.style.background = "white !important";
  }
}
