import { Song } from './song';
import { WebNote } from './notes';

const arrayBuffer = new ArrayBuffer(1);

//fetch is not defined globaly in jasmine so set it on global
const fetchSpy = jasmine.createSpy('fetch').and.resolveTo(
    jasmine.createSpyObj('Reponse', {
        arrayBuffer: Promise.resolve(arrayBuffer),
    }),
);
const oldFetch = window.fetch;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.fetch = fetchSpy;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let audioBufferSource: any;
const decodeAudioData = jasmine.createSpy('decodeAudioData');
const createBufferSource = jasmine.createSpy('createAudioSource').and.callFake(() => audioBufferSource);
const destination = 'destionation';
const audioContext = {
    createBufferSource,
    decodeAudioData,
    destination,
};
const createMockSong = () =>
    jasmine.createSpyObj('Song', [], {
        audioContext,
    }) as Song;

const URL = 'https://test.com';
describe('WebNote', function () {
    let note: WebNote;

    beforeEach(async () => {
        audioBufferSource = jasmine.createSpyObj('AudioBufferSource', ['connect', 'start', 'stop'], ['buffer']);
        note = new WebNote(URL, createMockSong());
        // wait for fetchData to finish
        await note.audioBuffer;
    });

    afterAll(() => (window.fetch = oldFetch));

    afterEach(() => {
        decodeAudioData.calls.reset();
        fetchSpy.calls.reset();
        createBufferSource.calls.reset();
    });

    describe('creation', () => {
        it('gets audio data and creates audio buffer', async () => {
            expect(fetchSpy).toHaveBeenCalledWith(URL);
            expect(decodeAudioData).toHaveBeenCalledWith(arrayBuffer);
        });
    });

    describe('#play', () => {
        it('creates and connects audio buffer source to audio context', async () => {
            await note.play(100);
            expect(createBufferSource).toHaveBeenCalledTimes(1);
            expect(audioBufferSource.connect).toHaveBeenCalledTimes(1);
            expect(audioBufferSource.connect).toHaveBeenCalledWith(destination);
            expect(audioBufferSource.start).toHaveBeenCalledTimes(1);
            expect(audioBufferSource.start).toHaveBeenCalledWith(100);
        });
    });

    describe('#stop', () => {
        it('calls stop on the audio buffer', async () => {
            await note.play(100);
            note.stop(205);
            expect(audioBufferSource.stop).toHaveBeenCalledTimes(1);
            expect(audioBufferSource.stop).toHaveBeenCalledWith(205);
        });
    });
});
