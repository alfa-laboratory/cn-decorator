# cn decorator

[![Build Status](https://travis-ci.org/alfa-laboratory/cn-decorator.svg?branch=master)](https://travis-ci.org/alfa-laboratory/cn-decorator)

Best way to use BEM with React

## Features

* [BEM methodology for React](#bem-methodology-for-react-)
* [Themes management](#themes-management-)
* [`className` proxy](#classname-proxy-)
* [BEM overrides](#bem-overrides-)
* [DI Components](#di-components-)

## BEM methodology for React <a href="#bem-methodology-for-react"></a>

`cn decorator` provides simplest ability to generate BEM methodology classes inside React Component.

### Basic example

```javascript
import cn from 'cn-decorator';
import React from 'react';
import './my-component.css';

@cn('block-name')
class MyComponent extends React.Component {
    render(cn) {
        return <div className={ cn() } />;
    }
}

// Render result:
// <div class="block-name"></div>
```

### Use for elements

```javascript
import cn from 'cn-decorator';
import React from 'react';
import './my-component.css';

@cn('block-name')
class MyComponent extends React.Component {
    render(cn) {
        return (
            <div className={ cn() }>
                <span className={ cn('some-element') } />
            </div>
        );
    }
}

// Render result:
// <div class="block-name">
//     <span class="block-name__some-element"></span>
// </div>
```

### Add mods

```javascript
import cn from 'cn-decorator';
import React from 'react';
import './my-component.css';

@cn('block-name')
class MyComponent extends React.Component {
    render(cn) {
        return <div className={ cn({ mod1: true, mod2: 'value' }) } />;
    }
}

// Render result:
// <div class="block-name block-name_mod1 block-name_mod2_value"></div>
```

### Mods for elements

```javascript
import cn from 'cn-decorator';
import React from 'react';
import './my-component.css';

@cn('block-name')
class MyComponent extends React.Component {
    render(cn) {
        return (
            <div className={ cn() }>
                <span className={ cn('some-element', { mod1: true }) } />
            </div>
        );
    }
}

// Render result:
// <div class="block-name">
//     <span class="block-name__some-element block-name__some-element_mod1"></span>
// </div>
```

## Themes management <a href="#themes-management"></a>

`cn decorator` provides system for themes managements.
You can setup your themes using `cn.create` factory.
`cn decorator` uses first theme as default.

### Basic example

```javascript
// my-component.js
import cnDecorator from 'cn-decorator';
import React from 'react';
import './my-component.css';

const cn = cnDecorator.create(['on-color', 'on-white']);

@cn('block-name')
class MyComponent extends React.Component {
    render(cn) {
        return <div className={ cn() } />;
    }
}

// app.js
import React from 'react';
import MyComponent from './my-component';

class App extends React.Component {
    render() {
        return <MyComponent />;
    }
}

// Render result:
// <div class="block-name block-name_theme_on-color"></div>
```

### Switch theme with public prop

```javascript
// my-component.js
import cnDecorator from 'cn-decorator';
import React from 'react';
import './my-component.css';

const cn = cnDecorator.create(['on-color', 'on-white']);

@cn('block-name')
class MyComponent extends React.Component {
    render(cn) {
        return <div className={ cn() } />;
    }
}

// app.js
import React from 'react';
import MyComponent from './my-component';

class App extends React.Component {
    render() {
        return <MyComponent theme="on-white" />;
    }
}

// Render result:
// <div class="block-name block-name_theme_on-white"></div>
```

## `className` proxy <a href="#className-proxy"></a>

`cn decorator` adds ability to React Component to proxy `className` prop.

### Example

```javascript
// my-component.js
import cn from 'cn-decorator';
import React from 'react';
import './my-component.css';

@cn('block-name')
class MyComponent extends React.Component {
    render(cn) {
        return <div className={ cn() } />;
    }
}

// app.js
import React from 'react';
import MyComponent from './my-component';

class App extends React.Component {
    render() {
        return <MyComponent className="custom-class" />;
    }
}

// Render result:
// <div class="block-name custom-class"></div>
```

## BEM overrides <a href="#bem-overrides"></a>

Using `cn decorator` you can easy seperate your logic from styles.
Just use `extends` pattern to override base BEM block name.
Use this feature to override component's styles.

```javascript
// my-component.js
import cn from 'cn-decorator';
import React from 'react';
import './my-component.css';

@cn('block-name')
class MyComponent extends React.Component {
    render(cn) {
        return (
            <div className={ cn() }>
                <span className={ cn('some-element') } />
            </div>
        );
    }
}

// my-extended-component.js
import cn from 'cn-decorator';
import MyComponent from './my-component';
import './my-extended-component.css';

@cn('extended-block')
class MyExtendedComponent extends MyComponent {}

// Render result:
// <div class="extended-block">
//     <span class="extended-block__some-element"></span>
// </div>
```

## DI Components <a href="#di-components"></a>

`cn decorator` includes dependency injection ability.
It can help you to override default component's composition.

```javascript
// my-component.js
import cn from 'cn-decorator';
import React from 'react';
import MyDepComponent from './my-dep-component';

@cn('block-name', MyDepComponent)
class MyComponent extends React.Component {
    render(cn, MyDepComponent) {
        return (
            <div className={ cn() }>
                <MyDepComponent />
            </div>
        );
    }
}

// Render result:
// <div class="block-name">
//     <div class="my-dep"></div>
// </div>

// my-overrided-component.js
import cn from 'cn-decorator';
import MyComponent from './my-component';
import MyOverDepComponent from './my-over-dep-component';

@cn('block-name', MyOverDepComponent)
class MyOverridedComponent extends MyComponent {}

// Render result:
// <div class="block-name">
//     <div class="my-over-dep"></div>
// </div>
```

## Utils

Check with linters

`npm run lint`

Check with unit tests

`npm run test`

Benchmarks

`npm run test-benchmark`

## License

```
The MIT License (MIT)

Copyright (c) 2017 Alfa Laboratory

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
