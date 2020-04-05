import { Song } from './song';
import { Pattern } from './pattern';

const createMockAudioContext = (currentTime = 0) => jasmine.createSpyObj('AudioContext', {}, { currentTime });

const createMockPattern = (playReturn = 1) =>
    jasmine.createSpyObj('Pattern', {
        play: Promise.resolve(playReturn),
    }) as Pattern;

describe('Song', function () {
    let song: Song;
    let ctx: AudioContext;

    beforeEach(() => {
        ctx = createMockAudioContext();
        song = new Song(60, ctx);
    });

    describe('#addPattern', () => {
        it('adds a pattern', function () {
            expect(song.length).toBe(0);
            song.addPattern(createMockPattern());
            expect(song.length).toBe(1);
        });

        it('adds a pattern at a given index', () => {
            const replacedMe = createMockPattern();
            const replacer = createMockPattern();
            song.addPattern(createMockPattern());
            song.addPattern(replacedMe);
            song.addPattern(createMockPattern());
            song.addPattern(replacer, 1);
            expect(song.getPattern(1)).toEqual(replacer);
            expect(song.length).toBe(3);
        });

        it('throws error error if index is out of bounds', () => {
            let index = 1;
            let length = 0;
            expect(() => song.addPattern(createMockPattern(), index)).toThrowError(new RegExp(`.*${index}.*${length}`));
            index = 2;
            length = 1;
            song.addPattern(createMockPattern());
            expect(() => song.addPattern(createMockPattern(), index)).toThrowError(new RegExp(`.*${index}.*${length}`));
            index = 1;
            length = 1;
            expect(() => song.addPattern(createMockPattern(), index)).not.toThrow();
        });
    });

    describe('#play', () => {
        it('calls play on patterns with expects timestamps', async () => {
            const pattern1 = createMockPattern(1);
            const pattern2 = createMockPattern(300);
            const pattern3 = createMockPattern();
            song.addPattern(pattern1);
            song.addPattern(pattern2);
            song.addPattern(pattern3);

            await song.play();

            expect(pattern1.play).toHaveBeenCalledWith(0.2);
            expect(pattern2.play).toHaveBeenCalledWith(1);
            expect(pattern3.play).toHaveBeenCalledWith(300);
        });
    });

    describe('length', () => {
        it('it does not touch patterns after length is shorten', async () => {
            const pattern1 = createMockPattern(1);
            const pattern2 = createMockPattern(300);
            const pattern3 = createMockPattern();
            song.addPattern(pattern1);
            song.addPattern(pattern2);
            song.addPattern(pattern3);

            song.length = 2;
            await song.play();

            expect(song.length).toEqual(2);
            expect(pattern1.play).toHaveBeenCalled();
            expect(pattern2.play).toHaveBeenCalled();
            expect(pattern3.play).not.toHaveBeenCalled();
        });
    });
});
