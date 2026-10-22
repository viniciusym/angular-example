// import { Service, inject } from '@angular/core';
// import { MusicInterface } from '../interfaces/music-interface';
// import { from, map, Observable } from 'rxjs';
// import { SupabaseService } from './supabase-service';
//
// @Service()
// export class MusicService {
//   private supabaseClient = inject(SupabaseService).supabaseClient;
//
//   public getMusics(): Observable<MusicInterface[]> {
//     const promise = this.supabaseClient.from('album').select('*').returns<MusicInterface[]>();
//     return from(promise).pipe(map(({ data, error }) => {
//       if (error) {
//         console.error(error);
//       }
//       return data || [];
//     }))
//   }
//
//   public insertMusics(music: MusicInterface[]): Observable<boolean> {
//     const promise = this.supabaseClient.from('album').insert(music)
//     return from(promise).pipe(map(({ data, error }) => {
//       if (error) {
//         console.error(error);
//         return false;
//       }
//       return true;
//     }))
//   }
// }
