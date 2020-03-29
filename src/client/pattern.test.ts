import { Pattern } from "./pattern";
import { Track } from "./track";

const TSConsoleReporter = require('jasmine-console-reporter');
 
jasmine.getEnv().clearReporters(); // Clear default console reporter
jasmine.getEnv().addReporter(new TSConsoleReporter());


const createMockTrack = (playReturn = 1) =>(jasmine.createSpyObj('Track', {
    play: Promise.resolve(playReturn)
}) as Track)

describe('Pattern', function() {
    let pat: Pattern;
    
    beforeEach(() => {
        pat = new Pattern();
    });

    describe('reps', () => {
        it('starts at 1', function() {
            expect(pat.reps).toBe(1);
        });

        it('changes ', function() {
            pat.reps = 2
            expect(pat.reps).toBe(2);
        });

        it('throws an error if set to < 1', () => {
            expect(()=> pat.reps = 0).toThrowError(/1.*.*/);
        })
    });

    describe('length', () => {
        it('starts at 0', () =>{
            expect(pat.length).toEqual(0);
        });
    });

    describe('#addTrack', () =>{
        it('pushes a track', () => {
            const track = createMockTrack();
            pat.addTrack(createMockTrack());
            pat.addTrack(track);
            expect(pat.length).toEqual(2);
            expect(pat.getTrack(1)).toBe(track);
        });

        it('add a track at a given index', () => {
            const track = createMockTrack();
            pat.addTrack(createMockTrack());
            pat.addTrack(createMockTrack());
            pat.addTrack(track, 0);
            expect(pat.length).toEqual(2);
            expect(pat.getTrack(0)).toBe(track);
        });

        it ('throws an error if add out of bounds', () => {
            pat.addTrack(createMockTrack());
            pat.addTrack(createMockTrack());
            expect(() => pat.addTrack(createMockTrack(),100)).toThrowError(/.*100.*2/);
        });
    });

    describe('#getTrack', () =>{
        it('throws error if get out of bounds', () => {
            expect(() => pat.getTrack(0)).toThrowError(/.*0.*0/);
            expect(() => pat.getTrack(11)).toThrowError(/.*11.*0/);
        });
    });

    describe('#play', () =>{
        it('starts all tracks at same time with expected timestamp', async () =>{
            const track1 = createMockTrack(1);
            const track2 = createMockTrack(2);
            const track3 = createMockTrack(3);
            pat.addTrack(track1);
            pat.addTrack(track2);
            pat.addTrack(track3);

            const ts= 1000;
            await pat.play(ts);

            expect(track1.play).toHaveBeenCalledTimes(1);
            expect(track1.play).toHaveBeenCalledWith(ts);

            expect(track2.play).toHaveBeenCalledWith(ts);
            expect(track2.play).toHaveBeenCalledTimes(1);

            expect(track3.play).toHaveBeenCalledWith(ts);
            expect(track3.play).toHaveBeenCalledTimes(1);
        });

        it('starts all tracks and then starts rep based off of longest track', async () =>{
            const track1 = createMockTrack(1);
            const track2 = createMockTrack(2);
            const track3 = createMockTrack(3);
            pat.addTrack(track1);
            pat.addTrack(track2);
            pat.addTrack(track3);

            pat.reps = 2;
            const ts= 1000;
            await pat.play(ts);
            
            expect(track1.play).toHaveBeenCalledWith(ts);
            expect(track2.play).toHaveBeenCalledWith(ts);
            expect(track3.play).toHaveBeenCalledWith(ts);
            expect(track1.play).toHaveBeenCalledWith(3);
            expect(track2.play).toHaveBeenCalledWith(3);
            expect(track3.play).toHaveBeenCalledWith(3);
            expect(track1.play).toHaveBeenCalledTimes(2);
            expect(track2.play).toHaveBeenCalledTimes(2);
            expect(track3.play).toHaveBeenCalledTimes(2);
        });

        it('returns longest track ts', async () => {
            const track1 = createMockTrack(1000);
            const track2 = createMockTrack(2);
            const track3 = createMockTrack(3);
            pat.addTrack(track1);
            pat.addTrack(track2);
            pat.addTrack(track3);

            expect(await pat.play(0)).toEqual(1000);
        });
    });

});