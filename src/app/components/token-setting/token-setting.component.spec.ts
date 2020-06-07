import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenSettingComponent } from './token-setting.component';

describe('TokenSettingComponent', () => {
  let component: TokenSettingComponent;
  let fixture: ComponentFixture<TokenSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TokenSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
