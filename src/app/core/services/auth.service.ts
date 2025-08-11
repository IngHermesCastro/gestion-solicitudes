// auth.service.ts
import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { environment } from '../../environment/environment';
import { initializeApp } from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth(initializeApp(environment));
  private currentUser: User | null = null;

  async login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    this.currentUser = userCredential.user;
    return this.currentUser.getIdToken();
  }

  async logout() {
    await signOut(this.auth);
    this.currentUser = null;
  }

  getUser() {
    return this.currentUser;
  }

  async getToken() {
    if (this.currentUser) {
      return await this.currentUser.getIdToken();
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.currentUser != null;
  }
}
