import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(false); // Sempre começa fechada
  public sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  constructor() {
    // Sempre começa fechada, independente do dispositivo
  }

  toggle(): void {
    this.sidebarOpenSubject.next(!this.sidebarOpenSubject.value);
  }

  open(): void {
    this.sidebarOpenSubject.next(true);
  }

  close(): void {
    this.sidebarOpenSubject.next(false);
  }

  isOpen(): boolean {
    return this.sidebarOpenSubject.value;
  }
}
