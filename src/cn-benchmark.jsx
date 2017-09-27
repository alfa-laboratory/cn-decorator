import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';
import bemCn from 'bem-cn-fast';

import cn from './cn';

import { render, cleanUp } from '../tools/test-utils';

class NoCnTest extends React.Component {
    render() {
        return <div className='cn-benchmark-test' />;
    }
}

const cnTest = bemCn('cn-benchmark-test');

class ClosureCnTest extends React.Component {
    render() {
        return <div className={ cnTest() } />;
    }
}

@cn('cn-benchmark-test')
class CnTest extends React.Component {
    render(cn) {
        return <div className={ cn() } />;
    }
}

@cn('cn-benchmark-test')
class CnTestWithMods extends React.Component {
    render(cn) {
        return <div className={ cn({ mod1: true, mod2: 'visible' }) } />;
    }
}

suite('cn', () => {
    benchmark('render without `cn`', {
        fn() {
            render(<NoCnTest />);
        },
        teardown: cleanUp
    });

    benchmark('render with `cn` in closure', {
        fn() {
            render(<ClosureCnTest />);
        },
        teardown: cleanUp
    });

    benchmark('render with `cn` call', {
        fn() {
            render(<CnTest />);
        },
        teardown: cleanUp
    });

    benchmark('render with `cn` call with mods', {
        fn() {
            render(<CnTestWithMods />);
        },
        teardown: cleanUp
    });
});
