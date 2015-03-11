# ember-cli-scala

*import* [Scala](http://www.scala-lang.org/) files compiled down to JavaScript with [Scala.js](http://www.scala-js.org/) into your [Ember.js](http://emberjs.com/) app.

# Install

```
ember install:addon ember-cli-scala
```

# Usage

`app/scala/Robot.scala`:

```
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

```
import Robot from 'ember-cli-scala-demo/scala/Robot.js';

var robot = Robot.Robot();

console.log(robot.destroyHumans(100)); // "Destroying 100 humans."
```

# Dependencies

[sbt](http://www.scala-sbt.org/) is required, but if you've been doing Scala development then you should already have it installed.

```
brew install sbt
```

# License

MIT
