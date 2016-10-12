import FEATURE_TOGGLE from '../../src/feature-toggle';

export default class Particle {

    constructor(settings) {
        this.x = settings.x || 0;
        this.y = settings.y || 0;
        this.vx = (Math.cos(settings.direction) * settings.speed) || 0;
        this.vy = (Math.sin(settings.direction) * settings.speed) || 0;
        this.gravity = settings.gravity || 0;
        this.mass = settings.mass || 1;
        this.radius = settings.radius || 1;
        this.friction = settings.friction || 1;
        this.springs = [];
        this.gravitations = [];
    }

    /*
     *  Updates the state of the particle
     */
    update() {
        this.handleSprings();
        this.handleGravitations();
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
    }

    /*
     *  Gets the length of the velocity vector, which equals to the hypotenuse
     */
    getSpeed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    }

    /*
     *  Using the actual Velocity vector's angle, sets a new length for it
     */
    setSpeed(speed) {
        let heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    /*
     *  Gets the angle direction of the velocity vector
     */
    getHeading() {
        return Math.atan2(this.vy, this.vx);
    }

    /*
     *  Changes the Velocity vector's angle and recalculate coordinates
     */
    setHeading(heading) {
        let speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }

    /*
     *  Sums to the Velocity vector x and y values
     */
    accelerate(x, y) {
        this.vx += x;
        this.vy += y;
    }

    /*
     *  Calculates the angle between this particle and 'p2'
     */
    angleTo(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    }

    /*
     *  Calculates the distance to a given particle
     */
    distanceTo(p) {
        let dx = p.x - this.x;
        let dy = p.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /*
     *  Calculates and applies a gravitation vector to a given particle
     */
    gravitateTo(p) {
        let dx = p.x - this.x;
        let dy = p.y - this.y;
        let distSQ = (dx * dx) + (dy * dy);
        let dist = Math.sqrt(distSQ);
        let force = (p.mass) / distSQ; // Force = mass / square of the distance
        /*
        cos * hypotenuse = opposite side || cos = opposite side / hypotenuse
        sin * hypotenuse = adjacent side || sin = adjacent side / hypotenuse

        That being said, we can optimize this:
        let angle = this.angleTo(p);
        let ax = Math.cos(angle) * force;
        let ay = Math.sin(angle) * force;

        And save three trigo functions
        */
        let ax = (dx / dist) * force;
        let ay = (dy / dist) * force;

        this.vx += ax;
        this.vy += ay;
    }

    /*
     *  Registers a particle to gravitate to
     */
    addGravitation(p) {
        this.removeGravitation(p);
        this.gravitations.push(p);
    }

    /*
     *  Unregisters a gravitation particle
     */
    removeGravitation(p) {
        let length = this.gravitations.length;
        for (let i=0; i<length; i++){
            if (this.gravitations[i] === p) {
                this.gravitations.slice(i, 1);
                return true;
            }
        }
    }

    /*
     *  Gravitates to each registered gravitation particle
     */
    handleGravitations() {
        let length = this.gravitations.length;
        for (let i=0; i<length; i++){
            this.gravitateTo(this.gravitations[i]);
        }
    }

    /*
     *  Calculates and applies a spring vector to a given point
     */
    springTo(point, k, length) {
        let dx = point.x - this.x;
        let dy = point.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let force = (distance - length || 0) * k;
        // Instead of getting cos / sin of angle, divide sides by hypotenuse
        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;
    }

    /*
     *  Registers a new spring point
     */
    addSpring(point, k, length) {
        this.removeSpring(point);
        this.springs.push({
            point: point,
            k: k,
            length: length || 0
        });
    }

    /*
     *  Unregisters a spring point
     */
    removeSpring(point) {
        let length = this.springs.length;
        for (let i=0; i<length; i++){
            if (this.springs[i].point === point) {
                this.springs.splice(i, 1);
                return;
            }
        }
    }


    /*
     *  Springs to each registered spring point
     */
    handleSprings() {
        let length = this.springs.length;
        for (let i=0; i<length; i++){
            let spring = this.springs[i];
            this.springTo(spring.point, spring.k, spring.length);
        }
    }
}
