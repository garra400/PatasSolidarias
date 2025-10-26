import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminSidebarService {
    private sidebarOpenSubject = new BehaviorSubject<boolean>(this.getInitialState());
    public sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

    constructor() { }

    private getInitialState(): boolean {
        // Abrir sidebar automaticamente em telas desktop
        return typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
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
