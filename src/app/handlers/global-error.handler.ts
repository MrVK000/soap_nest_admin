import { ErrorHandler, inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private snackBar = inject(MatSnackBar);

  handleError(error: unknown): void {
    const message = this.getUserFriendlyMessage(error);
    console.error('Unhandled error:', error);
    this.snackBar.open(message, 'Close', { duration: 5000 });
  }

  private getUserFriendlyMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.message?.includes('Cannot read') || error.message?.includes('undefined')) {
        return 'An unexpected error occurred. Please refresh the page.';
      }
      return error.message || 'An unexpected error occurred.';
    }
    return 'An unexpected error occurred. Please try again.';
  }
}
