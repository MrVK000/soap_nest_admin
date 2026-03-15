import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private toast = inject(ToastService);

  handleError(error: unknown): void {
    const message = this.getUserFriendlyMessage(error);
    console.error('Unhandled error:', error);
    this.toast.error(message);
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
