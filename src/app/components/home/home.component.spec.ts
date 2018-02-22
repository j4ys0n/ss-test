import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

// angular material
import {
  MatSelectModule,
  MatButtonToggleModule
} from '@angular/material';

import { HomeComponent } from './home.component';

import { ApiService } from './../../services/api/api.service';
import { UtilsService } from './../../services/utils/utils.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatSelectModule,
        MatButtonToggleModule,
        HttpClientTestingModule
      ],
      declarations: [ HomeComponent ],
      providers: [ApiService, UtilsService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created with Angular Material components', () => {
    expect(component).toBeTruthy();
  });
});
