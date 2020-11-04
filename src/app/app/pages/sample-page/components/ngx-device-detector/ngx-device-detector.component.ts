import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-ngx-device-detector',
  templateUrl: './ngx-device-detector.component.html',
  styleUrls: ['./ngx-device-detector.component.scss']
})
export class NgxDeviceDetectorComponent implements OnInit {

  deviceInfo = null;
  isMobile: any;
  isTablet: any;
  isDesktopDevice: any;


  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();

    console.log(this.deviceInfo);
    // returns if the device is a mobile device (android / iPhone / windows-phone etc)
    console.log(this.isMobile);
    // returns if the device us a tablet (iPad etc)
    console.log(this.isTablet);
    console.log(this.isDesktopDevice);
  }

}
