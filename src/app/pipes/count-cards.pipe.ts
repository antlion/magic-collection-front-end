import { Pipe, PipeTransform } from '@angular/core';
import {Card} from '../models/card.model';

@Pipe({
  name: 'countCards',
  pure: false
})
export class CountCardsPipe implements PipeTransform {

  transform(array: Card[]): number {
    let count = 0;
    for (let i = 0; i < array.length; i++){
      count += array[i].quantity;
    }
    return count;
  }

}


@Pipe({
  name: 'countCardsPrice'
})
export class CountCardsPrice implements PipeTransform {

  transform(array: Card[]): number {
    let count = 0;
    for (let i = 0; i < array.length; i++){
      count += array[i]['price'] * array[i].quantity;
    }
    return count;
  }

}



@Pipe({
  name: 'extractType'
})
export class ExtractType implements PipeTransform {

  transform(value: string): string {
    if(value.indexOf("—") > -1 ){
      return value.substring(0, value.indexOf("—"))
    }
    return value;
  }

}
