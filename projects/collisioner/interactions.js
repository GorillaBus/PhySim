export default {
  'gravity': (a, b) => {
    a.gravitateTo(b);
  },
  'collision': (a, b) => {
    let collision = a.collisionCheck(b);
    if (collision) {
      a.collisionHandle(b, collision);
    }
  }
}
