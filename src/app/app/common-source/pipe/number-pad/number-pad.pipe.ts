import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberPad'
})
export class NumberPadPipe implements PipeTransform {

  transform($n: any, width: number, ...args: unknown[]): unknown {

    const n = $n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;

  }

}
