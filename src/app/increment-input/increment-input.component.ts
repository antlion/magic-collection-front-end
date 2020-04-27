import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import {Card} from '../models/card.model';
import {DecksService} from '../services/decks/decks.service';

/**
 * @title Input with a clear button
 */
@Component({
  selector: 'app-increment-input',
  templateUrl: './increment-input.component.html',
  styleUrls: ['./increment-input.component.scss'],
  providers: [DecksService]
})
export class IncrementInputComponent {

  myFormGroup = new FormGroup({
    formField: new FormControl()
  });

  constructor(private serviceDeck: DecksService) {
  }

  @Input()card: Card;
  _value: number = 0;
  _step: number = 1;
  _min: number = 0;
  _max: number = Infinity;
  _wrap: boolean = true;
  color: string = 'default';

  @Output()changeCard: EventEmitter<Card> = new EventEmitter();

  @Input('value')
  set inputValue(_value: number) {
    this._value = this.parseNumber(_value);
  }

  @Input('card')
  set cardValue(card) {
    console.log(card);
    this.card = card;
  }

  @Input()
  set step(_step: number) {
    this._step = this.parseNumber(_step);
  }

  @Input()
  set min(_min: number) {
    this._min = this.parseNumber(_min);
  }

  @Input()
  set max(_max: number) {
    this._max = this.parseNumber(_max);
  }

  @Input()
  set wrap(_wrap: boolean) {
    this._wrap = this.parseBoolean(_wrap);
  }

  private parseNumber(num: any): number {
    return +num;
  }

  private parseBoolean(bool: any): boolean {
    return !!bool;
  }

  setColor(color: string): void {
    this.color = color;
  }

  getColor(): string {
    return this.color;
  }

  incrementValue(step: number = 1): void {

    let inputValue = this._value + step;

    if (this._wrap) {
      inputValue = this.wrappedValue(inputValue);
    }

    this._value = inputValue;
    console.log(this._value);
    this.card.quantity = this._value;
    this.changeCard.emit(this.card);
  }

  private wrappedValue(inputValue): number {
    if (inputValue > this._max) {
      return this._min + inputValue - this._max;
    }

    if (inputValue < this._min) {

      if (this._max === Infinity) {
        return 0;
      }

      return this._max + inputValue;
    }

    return inputValue;
  }

  shouldDisableDecrement(inputValue: number): boolean {
    return !this._wrap && inputValue <= this._min;
  }

  shouldDisableIncrement(inputValue: number): boolean {
    return !this._wrap && inputValue >= this._max;
  }
}
