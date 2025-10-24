import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminSidebarService {
    private sidebarOpenSubject = new BehaviorSubject<boolean>(false);
    public sidebarOpen$: Observable<boolean> = this.sidebarOpenSubject.asObservable();

    constructor() { }

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
