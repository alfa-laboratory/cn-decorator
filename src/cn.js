import PropTypes from 'prop-types';
import bem from 'bem-cn-fast';

/**
 * BEM class name factory.
 *
 * @typedef {Function} BemCn
 * @param {String|Object} [elementOrMods] Element name or hash object with mods.
 * @param {Object} [mods] Hash object with mods.
 * @returns {String}
 */

/**
 * Extends `BemCn` factory with additional class proxy and theme.
 *
 * @param {BemCn} cn BemCn instance.
 * @param {String} className Additional class name.
 * @param {String} theme Theme name.
 * @returns {BemCn}
 */
function getFunctionCn(cn, className, theme) {
    let resultCn = function (...args) {
        let blockSelector = false;

        if (typeof args[0] === 'undefined' || typeof args[0] === 'object') {
            if (args.length === 0) {
                if (process.env.NODE_ENV !== 'production') {
                    // eslint-disable-next-line no-console
                    console.warn('Performance: cn() without arguments should be called without parentheses');
                }

                args.push({});
            }

            args[0].theme = theme;
            blockSelector = true;
        }

        return cn.apply(cn, args) + ((blockSelector && className) ? ` ${className}` : '');
    };

    resultCn.toString = function () {
        return cn({ theme }).toString() + (className ? ` ${className}` : '');
    };

    return resultCn;
}

/**
 * 1. Decorates `React.Component`. Extends `render` method for
 * apply as first argument `BemCn` instance that uses to
 * generate BEM class names.
 *
 * 2. Adds prop `theme`.
 *
 * 3. Adds prop `className` for provide additional `className`.
 *
 * @example
 * ```
 *     import cnDecorator from 'cn-decorator';
 *     const cn = cnDecorator.create(['on-color', 'on-white']);
 *
 *     \@cn('my-block')
 *     class MyBlock extends React.Component {
 *          render(cn) {
 *              return (
 *                  <div className={ cn } />
 *              );
 *          }
 *     }
 * ```
 *
 * Render result:
 *
 * ```
 *     <MyBlock />
 *     // <div class="my-block my-block_theme_on-color"></div>
 *
 *     <MyBlock theme="on-white" />
 *     // <div class="my-block my-block_theme_on-white"></div>
 *
 *     <MyBlock className="additional-class" />
 *     // <div class="my-block my-block_theme_on-color additional-class"></div>
 * ```
 *
 * You can `CnDecorator` as dependency injector to flexibale change component\'s composition.
 *
 * ```
 * // phone-input.jsx
 *
 * import cn from 'cn-decorator';
 * import Input from 'input';
 * import './input.css';
 *
 * // Source component with base BEM class name `phone-input` and composed `Input` component.
 * \@cn('phone-input', Input)
 * class PhoneInput extends React.Component {
 *     render(cn, Input) {
 *          return <Input className={ cn } />;
 *     }
 * }
 *
 * // my-phone-input.jsx
 *
 * import cn from 'cn-decorator'
 * import PhoneInput from 'phone-input';
 * import MyInput from 'my-input';
 * import './my-phone-input.css';
 *
 * // Extended component with base class name `my-phone-input`.
 * // Uses custom `MyInput` component inside.
 * \@cn('my-phone-input', MyInput)
 * class MyPhoneInput extends PhoneInput {}
 * ```
 *
 * @typedef {Function} CnDecorator
 * @param {String} componentName Base CSS class name.
 * @param {...Function} [components] DI components.
 * @returns {Function}
 */

/**
 * Factory `CnDecorator`.
 *
 * @param {Array.<String>} [themes] Optional themes list. Uses first theme as default.
 * @param {Object} [options] Optional params
 * @param {Function} [options.bem] Function bem-cn
 * @returns {CnDecorator}
 */
function create(themes, options = {}) {
    let _bem = options.bem || bem;

    function cn(componentName, ...components) {
        return function (target) {
            target._cn = _bem(componentName);
            target._cnComponents = components;

            if (!target.prototype.hasOwnProperty('render')) {
                return;
            }

            if (target.prototype.render.length === 0 && process.env.NODE_ENV !== 'production') {
                throw new Error(
                    `Couldn't decorate ${componentName} because render method should contain at least one argument`
                );
            }

            if (target.prototype.render.length >= 1) {
                target.contextTypes = {
                    ...target.contextTypes,
                    theme: PropTypes.string
                };

                target.childContextTypes = {
                    ...target.childContextTypes,
                    theme: PropTypes.string
                };

                const originalRender = target.prototype.render;
                target.prototype.render = function () {
                    const currentClassName = this.props.className;
                    const currentTheme = this.props.theme || this.context.theme || (themes && themes[0]);

                    if (!this._cnArgs
                        || this._oldClassName !== currentClassName
                        || this._oldTheme !== currentTheme
                    ) {
                        this._cnArgs = [
                            getFunctionCn(this.constructor._cn, currentClassName, currentTheme),
                            ...this.constructor._cnComponents
                        ];

                        this._oldClassName = currentClassName;
                        this._oldTheme = currentTheme;
                    }
                    return originalRender.apply(this, this._cnArgs);
                };
            }
        };
    }

    cn.create = create;

    return cn;
}

export default create();
