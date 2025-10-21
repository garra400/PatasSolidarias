import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarOpenSubject = new BehaviorSubject<boolean>(true);
  public sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

  constructor() {
    // Em mobile, começa fechada
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      this.sidebarOpenSubject.next(false);
    }
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
