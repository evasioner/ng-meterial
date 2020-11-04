import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MyModalQnaViewComponent } from '../../modal-components/my-modal-qna-view/my-modal-qna-view.component';

@Component({
  selector: 'app-hotel-qna',
  templateUrl: './hotel-qna.component.html',
  styleUrls: ['./hotel-qna.component.scss']
})
export class HotelQnaComponent implements OnInit {

  bsModalRef: BsModalRef

  constructor(
    public bsModalService: BsModalService,
  ) { }

  ngOnInit(): void {
  }

  detailView(qnaId) {
    const initialState = {
      list: [
        'Open a modal with component',
        'Pass your data',
        'Do something else',
        '...'
      ],
      title: 'Modal with component'
    };
    const configInfo = {
      class: 'm-ngx-bootstrap-modal',
      animated: false
    };
    this.bsModalRef = this.bsModalService.show(MyModalQnaViewComponent, {initialState, ...configInfo});
  }
}
