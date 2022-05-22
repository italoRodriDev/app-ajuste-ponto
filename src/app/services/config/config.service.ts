import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  db = this.fireDatabase.database;
  private bsManagers = new BehaviorSubject([]);
  listManagers = this.bsManagers.asObservable();

  constructor(private fireDatabase: AngularFireDatabase) {
    this.getAllMangers();
  }

  // -> Recuperando gestores
  getAllMangers() {
    this.db.ref('managers').on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const array = Object.keys(data).map((index) => data[index]);
        this.bsManagers.next(array);
      }
    });
  }
}
