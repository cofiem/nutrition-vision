import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExplainPageComponent } from './explain-page.component';

describe('ExplainPageComponent', () => {
  let component: ExplainPageComponent;
  let fixture: ComponentFixture<ExplainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExplainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExplainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
