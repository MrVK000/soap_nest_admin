import { SharedService } from './../../services/shared.service';
import { Component } from '@angular/core';
import { Message } from '../../interfaces/interfaces';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-messages',
  imports: [CommonModule, TableModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss'
})
export class MessagesComponent {
  private destroy$ = new Subject<void>();
  messages: Message[] = [];
  currentMessageId: number | null = null;
  showDeleteConfirmModal: boolean = false;
  showDeleteAllConfirmModal: boolean = false;
  showMarkAllReadConfirmModal: boolean = false;
  showMessageDetailsModal: boolean = false;
  message: Message[] | null = null;
  selectedMessages: Message[] = [];


  constructor(private api: ApiService, private snackBar: MatSnackBar, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Messages';
    this.getMessages();
  }

  async getMessages() {
    this.api.listMessages().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.messages = res?.data;
    })
    this.sharedService.geMessagesCount();
  }

  viewMessage(id: number) {
    this.api.getMessage(id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.message = [res?.data];
      this.showMessageDetailsModal = true;
    })
    this.sharedService.geMessagesCount();
  }

  closeMessageDetails() {
    this.showMessageDetailsModal = false;
    this.message = null;
  }

  deleteMessage(id: number) {
    this.currentMessageId = id;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.currentMessageId = null;
  }

  confirmDelete() {
    if (this.currentMessageId) {
      this.api.deleteMessage(this.currentMessageId).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
        this.snackBar.open(res?.message, 'Close', { duration: 3000 });
        await this.getMessages();
        this.sharedService.geMessagesCount();
        this.closeDeleteConfirmModal();
      })
    }
  }

  confirmDeleteAll() {
    if (this.selectedMessages && this.selectedMessages.length > 0) {
      const selectedIds = this.selectedMessages.map((message) => message.id)
      this.api.deleteAllMessage(selectedIds).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
        this.snackBar.open(res?.message, 'Close', { duration: 3000 });
        await this.getMessages();
        this.sharedService.geMessagesCount();
        this.showDeleteAllConfirmModal = false;
        this.selectedMessages = [];
      })
    }
  }

  confirmMarkAllAsRead() {
    if (this.selectedMessages && this.selectedMessages.length > 0) {
      const selectedIds = this.selectedMessages.map((message) => message.id)
      this.api.markAllAsRead(selectedIds).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
        this.snackBar.open(res?.message, 'Close', { duration: 3000 });
        await this.getMessages();
        this.sharedService.geMessagesCount();
        this.showMarkAllReadConfirmModal = false;
        this.selectedMessages = [];
      })
    }
  }

  onGlobalFilter(event: Event, table: any) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
