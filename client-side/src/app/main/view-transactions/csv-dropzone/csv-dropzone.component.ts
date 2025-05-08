import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-csv-dropzone',
  standalone: false,
  templateUrl: './csv-dropzone.component.html',
  styleUrl: './csv-dropzone.component.css'
})
export class CsvDropzoneComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  fileName = '';
  isDragging = false;
  fileLimit = 25 * 1024 * 1024; // 25MB
  selectedFile: File | null = null;

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      if (file.size > this.fileLimit) {
        alert('File is over 25MB!');
        this.reset();
      } else {
        this.selectedFile = file;
        this.fileName = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
      }
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    if (file) {
      if (file.size > this.fileLimit) {
        alert('File is over 25MB!');
        this.reset();
      } else {
        this.selectedFile = file;
        this.fileName = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        if (this.fileInput) {
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          this.fileInput.nativeElement.files = dataTransfer.files;
        }
      }
    }
  }

  onReset() {
    this.reset();
  }

  onSubmit() {
    if (!this.selectedFile) {
      alert('Please select a file.');
      return;
    }

    // TODO: Send this.selectedFile to backend
    alert('Demo only – no file uploaded.');
  }

  private reset() {
    this.selectedFile = null;
    this.fileName = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
