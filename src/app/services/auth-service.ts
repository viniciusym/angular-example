import { Service, inject, signal, computed } from '@angular/core';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { from, Observable } from 'rxjs';
import { SupabaseService } from './supabase-service';

@Service()
export class AuthService {
  private supabase = inject(SupabaseService).supabaseClient

  private readonly _currentUser = signal<User | null>(null);
  private readonly _session = signal<Session | null>(null);

  public readonly currentUser = this._currentUser.asReadonly();
  public readonly session = this._session.asReadonly();

  public readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.initAuth();
  }

  private async initAuth() {
    const { data } = await this.supabase.auth.getSession();
    this._session.set(data.session);
    this._currentUser.set(data.session?.user ?? null);

    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._session.set(session);
      this._currentUser.set(session?.user ?? null);
    });
  }

  public signUp(email: string, password: string): Observable<{ error: AuthError | null }> {
    const promise = this.supabase.auth.signUp({ email, password });
    return from(promise);
  }

  public signIn(email: string, password: string): Observable<{ error: AuthError | null }> {
    const promise = this.supabase.auth.signInWithPassword({ email, password });
    return from(promise);
  }

  public signOut(): Observable<{ error: AuthError | null }> {
    const promise = this.supabase.auth.signOut();
    return from(promise);
  }
}
