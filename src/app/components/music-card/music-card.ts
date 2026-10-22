import { Component, inject, Input, OnInit, signal } from '@angular/core';
// import { MusicService } from '../../services/music-service';
import { MusicInterface } from '../../interfaces/music-interface';

@Component({
  imports: [],
  selector: 'app-music-card',
  styleUrl: './music-card.css',
  templateUrl: './music-card.html',
})
export class MusicCard {
  @Input() music!: MusicInterface;
}
