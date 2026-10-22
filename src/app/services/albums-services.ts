import { Service, inject } from '@angular/core';
import { SupabaseService } from './supabase-service';
import { from, map } from 'rxjs';

@Service()
export class AlbumsServices {
  readonly supabase = inject(SupabaseService).supabaseClient;

  async getAlbums() {
    // const session = await this.supabase.auth.signInWithPassword({ email: 'viniciusyamate@gmail.com', password: 'password' });
    // console.log(session)
    const promise = this.supabase.from('albums').select('*');
    return from(promise).pipe(map(
      (data, error) => {
        if (error) {
          console.error(error);
          return [];
        }
        return data;
      }
    ));
  }
}
