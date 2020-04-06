import { Song } from './music/song';

let currentSong = new Song();

export const updateCurrentSong = (song: Song = new Song()) => {
    currentSong = song;
};

export const getCurrentSong = () => currentSong;
