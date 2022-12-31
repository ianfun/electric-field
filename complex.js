function polar_complex(r = 0, theta = 0) {
    console.assert(this != window);
    this.r = r;
    this.theta = theta;
    this.reset = function() {
      this.r = 0;
      this.theta = 0;
    }
    this.add = function(other) {
      const tmp = this.toCartesian();
      tmp.add2(other);
      return tmp;
    }
    this.add2 = function(other) {
      const tmp = this.toCartesian();
      tmp.add2(other);
      this.x = tmp.x;
      this.y = tmp.y;
    }
    this.sub = function(other) {
      const tmp = this.toCartesian();
      tmp.sub2(other);
      return tmp;
    }
    this.sub2 = function(other) {
      const tmp = this.toCartesian();
      tmp.sub2(other);
      this.x = tmp.x;
      this.y = tmp.y;
    }
    this.mul = function(other) {
      other = other.toPolar();
      return new polar_complex(this.r * other.r, this.theta + other.theta);
    }
    this.mul2 = function (other) {
      other = other.toPolar();
      this.r *= other.r;
      this.theta += other.theta;
    }
    this.div = function(other) {
      other = other.toPolar();
      return new polar_complex(this.r / other.r, this.theta - other.theta);
    }
    this.div2 = function (other) {
      other = other.toPolar();
      this.r /= other.r;
      this.theta -= other.theta;
    }
    this.getReal = function () {
      return this.r * Math.cos(this.theta);
    }
    this.getImag = function () {
      return this.r * Math.sin(this.theta);
    }
    this.toCartesian = function () {
      Math.si
      return new cartesian_complex(this.getReal(), this.getImag());
    }
    this.toPolar = function () { return this; }
    this.toString = function() {
        return "Polar(theta=" + this.r.toString() + ", r=" + r.toString() + ')';
    }
  }
  function cartesian_complex(x = 0, y = 0) {
    console.assert(this != window);
    this.x = x; // real
    this.y = y; // imag
    this.reset = function() {
      this.x = 0;
      this.y = 0;
    }
    this.add = function(other) {
      other = other.toCartesian();
      return new cartesian_complex(this.x + other.x, this.y + other.y);
    }
    this.add2 = function(other) {
      other = other.toCartesian();
      this.x += other.x;
      this.y += other.y;
    }
    this.sub = function(other) {
      other = other.toCartesian();
      return new cartesian_complex(this.x + other.x, this.y + other.y);
    }
    this.sub2 = function(other) {
      other = other.toCartesian();
      this.x -= other.x;
      this.y -= other.y;
    }
    this.mul = function(other) {
      other = other.toCartesian();
      return new cartesian_complex(
        this.x * other.x - this.y - other.y, 
        this.x * other.y - this.y * other.x
      );
    }
    this.mul2 = function(other) {
      other = other.toCartesian();
      const tmp = this.x * other.x - this.y - other.y;
      this.y = this.x * other.y - this.y * other.x;
      this.x = tmp;
    }
    this.div = function(other) {
      other = other.toCartesian();
      const tmp = other.x ** 2 + other.y ** 2;
      return new cartesian_complex(
        (this.x * other.x + this.y * other.y)/tmp, 
        (this.y * other.x - this.x * other.y)/tmp
      );
    }
    this.div2 = function(other) {
      other = other.toCartesian();
      const tmp = other.x ** 2 + other.y ** 2;
      const tmp2 = this.x * other.x + this.y * other.y / tmp;
      this.y = (this.y * other.x - this.x * other.y) /tmp;
      this.x = tmp2;
    }
    this.getTheta = function() {
      return Math.atan(this.y / this.x);
    }
    this.getR = function() {
      return Math.hypot(this.x, this.y);
    }
    this.toPolar = function() {
      return new polar_complex(this.getR(), this.getTheta());
    }
    this.toCartesian = function() { return this; }
    this.toString = function() {
        if (this.y < 0) {
            return this.x.toString() + this.y.toString();
        }
        return this.x.toString() + '+' + this.y.toString();
    }
}
