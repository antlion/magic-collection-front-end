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
      if (array[i]['price'] == undefined) {
        array[i]['price'] = 0
      }
      count += parseFloat(array[i]['price']) * array[i].quantity;
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


@Pipe({name: 'groupBy'})
export class GroupByPipe implements PipeTransform {
  transform(value: Array<any>, field: string): Array<any> {
    const groupedObj = value.reduce((prev, cur)=> {
      if(!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }
}

