import { Injectable, inject } from '@angular/core';
import { RealmStore } from './realm.store';
import { IRealmEntity, Realm } from '../domain/realm.domain';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, of } from 'rxjs';

/**
 * Realm facade service to expose Realm functionality to other libraries
 * This facade acts as the public API for the Realm library
 */
@Injectable({
  providedIn: 'root'
})
export class RealmFacade {
  private realmStore = inject(RealmStore);
  
  // Expose store signals as properties
  readonly allRealms = this.realmStore.allRealms;
  readonly selectedRealm = this.realmStore.selectedRealm;
  readonly isLoading = this.realmStore.isLoading;
  readonly hasError = this.realmStore.hasError;
  readonly errorMessage = this.realmStore.errorMessage;
  
  /**
   * Load all realms
   */
  loadRealms(): void {
    this.realmStore.loadRealms();
  }
  
  /**
   * Get a specific realm by ID
   * @param realmId The ID of the realm to retrieve
   */
  getRealmById(realmId: number): Realm | null {
    const realms = this.realmStore.allRealms();
    return realms.find((realm:Realm) => realm.id === realmId) || null;
  }
  
  /**
   * Get my realms (could be filtered by some criteria in a real app)
   */
  getMyRealms(): Realm[] {
    // In a real application, this might filter based on user permissions
    return this.realmStore.allRealms();
  }

  /**
   * Select a realm by ID
   * @param realmId The ID of the realm to select
   */
  selectRealm(realmId: number): void {
    this.realmStore.selectRealm(realmId);
  }
  
  /**
   * Add a new realm
   * @param realm The realm to add
   */
  addRealm(realm: Realm): void {
    this.realmStore.addRealm(realm);
  }
  
  /**
   * Update an existing realm
   * @param realm The updated realm
   */
  updateRealm(realm: Realm): void {
    this.realmStore.updateRealm(realm);
  }
  
  /**
   * Delete a realm
   * @param realmId The ID of the realm to delete
   */
  deleteRealm(realmId: number): void {
    this.realmStore.deleteRealm(realmId);
  }
}