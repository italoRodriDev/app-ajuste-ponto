import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CardAdjustmentManagerComponent } from './card-adjustment-manager.component';

describe('CardAdjustmentManagerComponent', () => {
  let component: CardAdjustmentManagerComponent;
  let fixture: ComponentFixture<CardAdjustmentManagerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAdjustmentManagerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CardAdjustmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
