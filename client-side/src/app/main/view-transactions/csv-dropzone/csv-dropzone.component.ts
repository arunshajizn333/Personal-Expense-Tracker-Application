import { Component, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-csv-dropzone',
  standalone: false, 
  templateUrl: './csv-dropzone.component.html',
  styleUrls: ['./csv-dropzone.component.css']
})
export class CsvDropzoneComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Output() fileConfirmedForUpload = new EventEmitter<File>(); // Emits the file when 'Save' is clicked

  fileName = '';
  isDragging = false;
  fileLimit = 25 * 1024 * 1024; // 25MB
  selectedFile: File | null = null;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.handleSelectedFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation(); // Prevent event from bubbling up
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];
    this.handleSelectedFile(file);
  }

  private handleSelectedFile(file: File | null | undefined): void {
    if (file) {
      if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
        alert('Invalid file type. Please upload a CSV file.');
        this.reset();
        return;
      }
      if (file.size > this.fileLimit) {
        alert(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maximum size is 25MB.`);
        this.reset();
      } else {
        this.selectedFile = file;
        this.fileName = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
        // If you need to reflect the dropped file in the input element (optional)
        if (this.fileInput && event instanceof DragEvent) { // Check if it was a drop event
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            this.fileInput.nativeElement.files = dataTransfer.files;
        }
      }
    } else {
      this.reset(); // Reset if no file is actually selected (e.g., user cancels file dialog)
    }
  }

  // Called when the "Cancel" button is clicked
  onCancel(): void {
    this.reset();
  }

  // Called when the "Save" (or "Upload") button is clicked
  onConfirmUpload(): void {
    if (!this.selectedFile) {
      alert('Please select a CSV file to upload.');
      return;
    }
    this.fileConfirmedForUpload.emit(this.selectedFile);
    // Optionally reset after emitting, or let the parent decide
    // this.reset();
  }

  private reset(): void {
    this.selectedFile = null;
    this.fileName = '';
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // Clears the file input
    }
  }
}
