import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MemberService} from './services/member.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  title = 'ng-material';

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: [ '<i class="fa-chevron-left">prev</i>', '<i class="fa-chevron-right">next</i>' ],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  };
  public images = [
    'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/09/1862/1048/d8836bf5-list-pic-2.jpg?ve=1&tl=1',
    'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/09/1862/1048/d8836bf5-list-pic-2.jpg?ve=1&tl=1',
    'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/09/1862/1048/d8836bf5-list-pic-2.jpg?ve=1&tl=1',
    'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/09/1862/1048/d8836bf5-list-pic-2.jpg?ve=1&tl=1',
    'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/09/1862/1048/d8836bf5-list-pic-2.jpg?ve=1&tl=1',
    'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/09/1862/1048/d8836bf5-list-pic-2.jpg?ve=1&tl=1',
    'https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2019/09/1862/1048/d8836bf5-list-pic-2.jpg?ve=1&tl=1'
  ];
  public testForm;

  imageUploads = [];
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private fb: FormBuilder) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.testForm  = this.fb.group({
      images : ['']
    });
  }

  async fileRead(event) {
    let files = [...event.target.files];
    this.imageUploads.push(await Promise.all(files.map(f=>{return this.readFileStream(f)})));
    console.log(this.imageUploads, 123123);
  }
  readFileStream(file){
    return new Promise((resolve, reject)=>{
      let fileReader = new FileReader();
      fileReader.onload = function(){
        return resolve({data : fileReader.result , name: file.name});
      };
      fileReader.readAsDataURL(file);
    });
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
