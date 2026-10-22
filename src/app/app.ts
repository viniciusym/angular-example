import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { MusicService } from './services/music-service';
import { MusicInterface } from './interfaces/music-interface';
import { MusicCard } from './components/music-card/music-card';
import { AlbumsServices } from './services/albums-services';
import { environment } from '../environments/environment';

@Component({
  imports: [RouterOutlet, MusicCard],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private albumService = inject(AlbumsServices);
  // private musics = signal<MusicInterface[]>([])

  async ngOnInit() {
    const data = await this.albumService.getAlbums()
    data.subscribe({
      next: (data) => console.log(data),
    })
  }
}
