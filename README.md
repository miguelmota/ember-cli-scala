# ember-cli-scala

*import* [Scala](http://www.scala-lang.org/) files compiled down to JavaScript with [Scala.js](http://www.scala-js.org/) into your [Ember.js](http://emberjs.com/) app.

# Install

```bash
ember install:addon ember-cli-scala
```

# Usage

`app/scala/Robot.scala`:

```scala
package robot

import scala.scalajs.js
import js.annotation.JSExport

@JSExport
object Robot {
  @JSExport
  def destroyHumans(num: Int = 10): String = {
    "Destroying " + num + " humans."
  }
}
```

Somewhere else in your code:

```javascript
import Robot from 'ember-cli-scala-demo/scala/Robot.js';

var robot = Robot.Robot();

console.log(robot.destroyHumans(100)); // "Destroying 100 humans."
```

# Dependencies

[Scala Build Tool (sbt)](http://www.scala-sbt.org/)

```
brew install sbt
```

# Todo

- Tests

# License

MIT
