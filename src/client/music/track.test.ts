import { Track } from './track';
import { Song } from './song';
import { WebNote } from './notes';

const createMockSong = (bpm = 60) => jasmine.createSpyObj('Song', {}, { bpm }) as Song;

const createMockNote = () => jasmine.createSpyObj('WebNote', ['play', 'stop']) as WebNote;

describe('Track', function () {
    let trk: Track;
    let song: Song;

    beforeEach(() => {
        song = createMockSong();
        trk = new Track(song);
    });

    describe('length', () => {
        it('starts at 16', () => {
            expect(trk.length).toBe(16);
        });

        it('can be set', () => {
            trk.length = 55;
            expect(trk.length).toBe(55);
        });
    });

    describe('#addNote', () => {
        it('can push a note to the end', function () {
            trk.addNote(createMockNote());
            expect(trk.length).toBe(17);
        });

        it('pushes add a note in the middle of the track', () => {
            const note = createMockNote();
            expect(trk.getNote(10)).toBe(null);
            trk.addNote(note, 10);
            expect(trk.getNote(10)).toBe(note);
        });

        it('handles length if idex is passt current length', () => {
            trk.addNote(createMockNote(), 300);
            expect(trk.length).toBe(301);
            expect(trk.getNote(205)).toBe(null);
        });
    });

    describe('#getNote', () => {
        it('throws error if out of bounds', () => {
            expect(() => trk.getNote(-1)).toThrowError(/.*-1.*16.*/);
            expect(() => trk.getNote(16)).toThrowError(/.*16.*16.*/);
        });
    });

    describe('#reset', () => {
        it('resets length to 16', () => {
            trk.addNote(createMockNote(), 300);
            trk.reset();
            expect(trk.length).toBe(16);
        });

        it('clears out all tracked notes', () => {
            trk.addNote(createMockNote(), 10);
            trk.reset();
            expect(trk.getNote(10)).toBe(null);
        });
    });

    describe('#play', () => {
        it('calls play and stop with expected time', async () => {
            const note0 = createMockNote();
            const note1 = createMockNote();
            const note8 = createMockNote();
            trk.addNote(note0, 0);
            trk.addNote(note1, 1);
            trk.addNote(note8, 8);

            await trk.play(0);

            expect(note0.play).toHaveBeenCalledWith(0);
            expect(note0.play).toHaveBeenCalledTimes(1);
            expect(note0.stop).toHaveBeenCalledWith(0.25);
            expect(note0.stop).toHaveBeenCalledTimes(1);

            expect(note1.play).toHaveBeenCalledWith(0.25);
            expect(note1.play).toHaveBeenCalledTimes(1);
            expect(note1.stop).toHaveBeenCalledWith(2);
            expect(note1.stop).toHaveBeenCalledTimes(1);

            expect(note8.play).toHaveBeenCalledWith(2);
            expect(note8.play).toHaveBeenCalledTimes(1);
        });

        it('calls play as expected with change in bpm', async () => {
            song = createMockSong(30);
            trk = new Track(song);
            const note0 = createMockNote();
            const note1 = createMockNote();
            const note8 = createMockNote();
            trk.addNote(note0, 0);
            trk.addNote(note1, 1);
            trk.addNote(note8, 8);

            await trk.play(0);

            expect(note0.play).toHaveBeenCalledWith(0);
            expect(note0.play).toHaveBeenCalledTimes(1);
            expect(note0.stop).toHaveBeenCalledWith(0.5);
            expect(note0.stop).toHaveBeenCalledTimes(1);

            expect(note1.play).toHaveBeenCalledWith(0.5);
            expect(note1.play).toHaveBeenCalledTimes(1);
            expect(note1.stop).toHaveBeenCalledWith(4);
            expect(note1.stop).toHaveBeenCalledTimes(1);

            expect(note8.play).toHaveBeenCalledWith(4);
            expect(note8.play).toHaveBeenCalledTimes(1);
        });

        it('returns expected next timestamp', async () => {
            const note0 = createMockNote();
            const note1 = createMockNote();
            const note8 = createMockNote();
            trk.addNote(note0, 0);
            trk.addNote(note1, 1);
            trk.addNote(note8, 8);

            const val = await trk.play(0);

            expect(val).toBe(4);
        });

        it('returns expected next timestamp with new bpm', async () => {
            song = createMockSong(30);
            trk = new Track(song);
            const note0 = createMockNote();
            const note1 = createMockNote();
            const note8 = createMockNote();
            trk.addNote(note0, 0);
            trk.addNote(note1, 1);
            trk.addNote(note8, 8);

            const val = await trk.play(0);

            expect(val).toBe(8);
        });

        it('returns expected next timestamp with new length', async () => {
            const note0 = createMockNote();
            const note1 = createMockNote();
            const note8 = createMockNote();
            trk.addNote(note0, 0);
            trk.addNote(note1, 1);
            trk.addNote(note8, 8);
            trk.length = 20;

            const val = await trk.play(0);

            expect(val).toBe(5);
        });
    });
});
