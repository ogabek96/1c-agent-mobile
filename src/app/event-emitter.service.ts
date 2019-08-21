import { Injectable, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  dbReady() {
    this.change.emit(true);
  }
  dbChange() {
    this.change.emit(true);
  }
  constructor() { }
}
