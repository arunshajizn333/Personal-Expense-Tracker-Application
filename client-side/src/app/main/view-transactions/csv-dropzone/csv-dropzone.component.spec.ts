import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvDropzoneComponent } from './csv-dropzone.component';

describe('CsvDropzoneComponent', () => {
  let component: CsvDropzoneComponent;
  let fixture: ComponentFixture<CsvDropzoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CsvDropzoneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CsvDropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
