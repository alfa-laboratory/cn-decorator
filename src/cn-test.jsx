import 'core-js/es6/map';
import 'core-js/es6/set';

import React from 'react';

import cn from './cn';

import { render, cleanUp } from '../tools/test-utils';

describe('cn', () => {
    afterEach(cleanUp);

    it('should render decorated class with base css-class `cn-test`', () => {
        @cn('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        let cnTest = render(<CnTestComponent />);

        expect(cnTest.node).to.have.class('cn-test');
    });

    it('should render decorated class with base css-class dash-cased component name', () => {
        @cn
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        let cnTest = render(<CnTestComponent />);

        expect(cnTest.node).to.have.class('cn-test-component');
    });

    it('should override css-class on extended class', () => {
        @cn('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        @cn('cn-test-extended')
        class CnTestExtendedComponent extends CnTestComponent {}

        let cnTest = render(<CnTestExtendedComponent />);

        expect(cnTest.node).to.have.class('cn-test-extended');
    });

    it('should keep css-class on extended class without `cn` reuse', () => {
        @cn('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        class CnTestExtendedComponent extends CnTestComponent {}

        let cnTest = render(<CnTestExtendedComponent />);

        expect(cnTest.node).to.have.class('cn-test');
    });

    it('should render decorated class with element `test-element` with css-class `cn-test__test-element`', () => {
        @cn('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return (
                    <div className={ cn() }>
                        <div className={ cn('test-element') } />
                    </div>
                );
            }
        }

        let cnTest = render(<CnTestComponent />);
        let cnTestElementNode = cnTest.node.querySelector('.cn-test__test-element');

        expect(cnTestElementNode).to.exist;
    });

    it('should render decorated class with modificator `mod` with css-class `cn-test_mod`', () => {
        @cn('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn({ mod: this.props.mod }) } />;
            }
        }

        let cnTest = render(<CnTestComponent mod={ true } />);

        expect(cnTest.node).to.have.class('cn-test_mod');
    });

    it('should render decorated class with modificator mod=`some` with css-class `cn-test_mod_some`', () => {
        @cn('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn({ mod: this.props.mod }) } />;
            }
        }

        let cnTest = render(<CnTestComponent mod='some' />);

        expect(cnTest.node).to.have.class('cn-test_mod_some');
    });

    it(
        'should render decorated class with element `test-element` with element mod ' +
        'with css-class `cn-test__test-element_mod`',
        () => {
            @cn('cn-test')
            class CnTestComponent extends React.Component {
                render(cn) {
                    return (
                        <div className={ cn() }>
                            <div className={ cn('test-element', { mod: true }) } />
                        </div>
                    );
                }
            }

            let cnTest = render(<CnTestComponent />);
            let cnTestElementNode = cnTest.node.querySelector('.cn-test__test-element_mod');

            expect(cnTestElementNode).to.exist;
        }
    );

    it('should render decorated class with additional css-class passed through `className` prop', () => {
        @cn('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        let cnTest = render(<CnTestComponent className='additional-class' />);

        expect(cnTest.node).to.have.class('additional-class');
    });

    it('should render decorated class with default theme', () => {
        const cnWithThemes = cn.create(['on-color', 'on-white']);

        @cnWithThemes('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        let cnTest = render(<CnTestComponent />);

        expect(cnTest.node).to.have.class('cn-test_theme_on-color');
    });

    it('should render decorated class with theme=`on-white` passed through `theme` prop', () => {
        const cnWithThemes = cn.create(['on-color', 'on-white']);

        @cnWithThemes('cn-test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        let cnTest = render(<CnTestComponent theme='on-white' />);

        expect(cnTest.node).to.have.class('cn-test_theme_on-white');
    });

    it('should inject component', () => {
        @cn('cn-injected-test')
        class InjectedComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        @cn('cn-test', InjectedComponent)
        class CnTestComponent extends React.Component {
            render(cn, InjectedComponent) {
                return <InjectedComponent className={ cn() } />;
            }
        }

        let cnTest = render(<CnTestComponent />);

        expect(cnTest.node).to.have.class('cn-test');
        expect(cnTest.node).to.have.class('cn-injected-test');
    });

    it('should override injected component on extended class', () => {
        @cn('cn-injected-test')
        class InjectedComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        @cn('cn-injected-override-test')
        class InjectedOverrideComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        @cn('cn-test', InjectedComponent)
        class CnTestComponent extends React.Component {
            render(cn, InjectedComponent) {
                return <InjectedComponent className={ cn() } />;
            }
        }

        @cn('cn-test-extended', InjectedOverrideComponent)
        class CnTestExtendedComponent extends CnTestComponent {}

        let cnTest = render(<CnTestExtendedComponent />);

        expect(cnTest.node).to.have.class('cn-test-extended');
        expect(cnTest.node).to.have.class('cn-injected-override-test');
    });

    it('should override bem-cn-fast', () => {
        const bem = () => () => 'from-custom-bem-cn';
        const cnWithCustomBem = cn.create([], { bem });

        @cnWithCustomBem('test')
        class CnTestComponent extends React.Component {
            render(cn) {
                return <div className={ cn() } />;
            }
        }

        let cnTest = render(<CnTestComponent />);

        expect(cnTest.node).to.have.class('from-custom-bem-cn');
    });
});
