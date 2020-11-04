import {Pipe, PipeTransform, NgModule} from '@angular/core';

@Pipe({
    name: 'replaceFocus'
})
export class ReplaceFocus implements PipeTransform {

    transform(locName: any, replace: any): any {
        const txt = locName.replace(new RegExp(replace, 'g'), '<span class="focus">' + replace + '</span>');
        return txt;
    }

}

const PIPE_LIST = [
    ReplaceFocus
];

@NgModule({
    imports: [],
    declarations: PIPE_LIST,
    exports: PIPE_LIST,
})

export class CommonPipe {
}
