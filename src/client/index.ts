import Track from './components/track';

const track1 = new Track(1);
const track2 = new Track(2);
track1.append();
track2.append();

document.getElementById('tracks').addEventListener('input', (event) => console.log(event));