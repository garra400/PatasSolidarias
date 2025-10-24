import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgatesListComponent } from './resgates-list.component';

describe('ResgatesListComponent', () => {
    let component: ResgatesListComponent;
    let fixture: ComponentFixture<ResgatesListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ResgatesListComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ResgatesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
