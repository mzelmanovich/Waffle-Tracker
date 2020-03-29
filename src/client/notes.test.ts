
import {Song} from './song'
import { WebNote } from './notes';

const TSConsoleReporter = require('jasmine-console-reporter');
 
jasmine.getEnv().clearReporters(); // Clear default console reporter
jasmine.getEnv().addReporter(new TSConsoleReporter());

const arrayBuffer = new ArrayBuffer(1);

//fetch is not defined globaly in jasmine so set it on global
const fetchSpy = jasmine.createSpy('fetch').and.resolveTo(jasmine.createSpyObj(
    'Reponse', {
        arrayBuffer: Promise.resolve(arrayBuffer)
    }
));
(global as any).fetch = fetchSpy; 

let audioBufferSource:any;
const decodeAudioData = jasmine.createSpy('decodeAudioData');
const createBufferSource = jasmine.createSpy('createAudioSource').and.callFake(() => audioBufferSource); 
const destination = 'destionation';
const audioContext = {
        createBufferSource,
        decodeAudioData,
        destination 
    };
const createMockSong = () => (jasmine.createSpyObj('Song', [], {
    audioContext
}) as Song);

const URL = 'https://test.com';
describe('WebNote', function() {
    let note: WebNote;
    
    beforeEach(async () => {
        audioBufferSource = jasmine.createSpyObj('AudioBufferSource', ['connect', 'start',], ['buffer']); 
        note = new WebNote(URL , createMockSong());
        // wait for fetchData to finish
        await note.audioBuffer;
    });

    afterEach(() =>{
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

});