webpackHotUpdate(5, {
  /***/ /***/ 408: function(module, exports, __webpack_require__) {
    'use strict';
    /* WEBPACK VAR INJECTION */ (function(__resourceQuery) {
      Object.defineProperty(exports, '__esModule', {
        value: true,
      });

      var _getPrototypeOf = __webpack_require__(44);

      var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

      var _classCallCheck2 = __webpack_require__(15);

      var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

      var _createClass2 = __webpack_require__(16);

      var _createClass3 = _interopRequireDefault(_createClass2);

      var _possibleConstructorReturn2 = __webpack_require__(45);

      var _possibleConstructorReturn3 = _interopRequireDefault(
        _possibleConstructorReturn2,
      );

      var _inherits2 = __webpack_require__(49);

      var _inherits3 = _interopRequireDefault(_inherits2);

      var _regenerator = __webpack_require__(87);

      var _regenerator2 = _interopRequireDefault(_regenerator);

      var _asyncToGenerator2 = __webpack_require__(88);

      var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

      var _react = __webpack_require__(17);

      var _react2 = _interopRequireDefault(_react);

      var _layout = __webpack_require__(409);

      var _layout2 = _interopRequireDefault(_layout);

      var _axios = __webpack_require__(428);

      var _axios2 = _interopRequireDefault(_axios);

      function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : { default: obj };
      }

      var _this = undefined,
        _jsxFileName = 'D:\\web\\next\\pages\\home.js?entry';

      var getBotSettings = (function() {
        var _ref = (0, _asyncToGenerator3.default)(
          /*#__PURE__*/ _regenerator2.default.mark(function _callee() {
            var result;
            return _regenerator2.default.wrap(
              function _callee$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      _context.next = 2;
                      return _axios2.default.get(
                        window.location.origin + '/api/getBotSettings',
                      );

                    case 2:
                      result = _context.sent;
                      return _context.abrupt('return', result.data);

                    case 4:
                    case 'end':
                      return _context.stop();
                  }
                }
              },
              _callee,
              _this,
            );
          }),
        );

        return function getBotSettings() {
          return _ref.apply(this, arguments);
        };
      })();

      var Home = (function(_Component) {
        (0, _inherits3.default)(Home, _Component);

        function Home(props) {
          (0, _classCallCheck3.default)(this, Home);

          var _this2 = (0, _possibleConstructorReturn3.default)(
            this,
            (Home.__proto__ || (0, _getPrototypeOf2.default)(Home)).call(
              this,
              props,
            ),
          );

          _this2.state = {
            config: {},
          };
          return _this2;
        }

        (0, _createClass3.default)(Home, [
          {
            key: 'componentWillMount',
            value: (function() {
              var _ref2 = (0, _asyncToGenerator3.default)(
                /*#__PURE__*/ _regenerator2.default.mark(function _callee2() {
                  var _ref3, data;

                  return _regenerator2.default.wrap(
                    function _callee2$(_context2) {
                      while (1) {
                        switch ((_context2.prev = _context2.next)) {
                          case 0:
                            _context2.next = 2;
                            return getBotSettings();

                          case 2:
                            _ref3 = _context2.sent;
                            data = _ref3.data;

                            this.setState({ config: data });

                          case 5:
                          case 'end':
                            return _context2.stop();
                        }
                      }
                    },
                    _callee2,
                    this,
                  );
                }),
              );

              function componentWillMount() {
                return _ref2.apply(this, arguments);
              }

              return componentWillMount;
            })(),
          },
          {
            key: 'render',
            value: function render() {
              var config = this.state.config;
              console.log(config);
              return _react2.default.createElement(
                _layout2.default,
                {
                  __source: {
                    fileName: _jsxFileName,
                    lineNumber: 27,
                  },
                },
                _react2.default.createElement(
                  'p',
                  {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 28,
                    },
                  },
                  '\u0417\u0430\u0434\u0430\u0439\u0442\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u043A\u0438 \u0434\u043B\u044F \u0432\u0430\u0448\u0435\u0433\u043E \u0431\u043E\u0442\u0430',
                ),
                _react2.default.createElement(
                  'div',
                  {
                    className: 'settings',
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 29,
                    },
                  },
                  _react2.default.createElement(
                    'div',
                    {
                      className: 'settings__item',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 30,
                      },
                    },
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 31,
                        },
                      },
                      _react2.default.createElement(
                        'label',
                        {
                          htmlFor: 'bot_name',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 32,
                          },
                        },
                        '\u0418\u043C\u044F \u0431\u043E\u0442\u0430',
                      ),
                    ),
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 34,
                        },
                      },
                      _react2.default.createElement('input', {
                        disabled: 'disabled',
                        type: 'text',
                        name: 'bot_name',
                        id: 'bot_name',
                        value: config.name,
                        className: 'input settings__input',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 35,
                        },
                      }),
                    ),
                  ),
                  _react2.default.createElement(
                    'div',
                    {
                      className: 'settings__item',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 44,
                      },
                    },
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 45,
                        },
                      },
                      _react2.default.createElement(
                        'label',
                        {
                          htmlFor: 'bot_name',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 46,
                          },
                        },
                        '\u041A\u0430\u043D\u0430\u043B',
                      ),
                    ),
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 48,
                        },
                      },
                      _react2.default.createElement('input', {
                        disabled: 'disabled',
                        type: 'text',
                        name: 'bot_name',
                        id: 'bot_name',
                        value: config.channel_name,
                        className: 'input settings__input',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 49,
                        },
                      }),
                    ),
                  ),
                  _react2.default.createElement(
                    'div',
                    {
                      className: 'settings__item',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 56,
                      },
                    },
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 57,
                        },
                      },
                      _react2.default.createElement(
                        'label',
                        {
                          htmlFor: 'bot_name',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 58,
                          },
                        },
                        '\u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435',
                      ),
                    ),
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 60,
                        },
                      },
                      _react2.default.createElement('input', {
                        disabled: 'disabled',
                        type: 'text',
                        name: 'bot_name',
                        id: 'bot_name',
                        value: 'value',
                        className: 'input settings__input',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 61,
                        },
                      }),
                    ),
                  ),
                  _react2.default.createElement(
                    'div',
                    {
                      className: 'settings__item',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 64,
                      },
                    },
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 65,
                        },
                      },
                      _react2.default.createElement(
                        'label',
                        {
                          htmlFor: 'join_active',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 66,
                          },
                        },
                        '\u041F\u0440\u0438\u0432\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435',
                      ),
                      _react2.default.createElement('input', {
                        id: 'join_active',
                        type: 'checkbox',
                        checked: 'checked',
                        className: 'input settings__checkbox',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 67,
                        },
                      }),
                    ),
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 69,
                        },
                      },
                      _react2.default.createElement('textarea', {
                        name: 'user_join',
                        id: 'user_join',
                        className: 'textarea settings__textarea',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 70,
                        },
                      }),
                    ),
                  ),
                  _react2.default.createElement(
                    'div',
                    {
                      className: 'settings__item',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 73,
                      },
                    },
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 74,
                        },
                      },
                      _react2.default.createElement(
                        'label',
                        {
                          htmlFor: 'leave_active',
                          __source: {
                            fileName: _jsxFileName,
                            lineNumber: 75,
                          },
                        },
                        '\u041F\u0440\u043E\u0449\u0430\u043B\u044C\u043D\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435',
                      ),
                      _react2.default.createElement('input', {
                        id: 'leave_active',
                        type: 'checkbox',
                        checked: 'checked',
                        className: 'input settings__checkbox',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 76,
                        },
                      }),
                    ),
                    _react2.default.createElement(
                      'div',
                      {
                        className: 'settings__item-col',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 78,
                        },
                      },
                      _react2.default.createElement('textarea', {
                        name: 'user_leave',
                        id: 'user_leave',
                        className: 'textarea settings__textarea',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 79,
                        },
                      }),
                    ),
                  ),
                  _react2.default.createElement(
                    'div',
                    {
                      className: 'settings__save',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 82,
                      },
                    },
                    _react2.default.createElement('div', {
                      className: 'settings__message',
                      __source: {
                        fileName: _jsxFileName,
                        lineNumber: 83,
                      },
                    }),
                    _react2.default.createElement(
                      'button',
                      {
                        'data-bot-id': 'data-bot-id',
                        className: 'button button_primary',
                        __source: {
                          fileName: _jsxFileName,
                          lineNumber: 84,
                        },
                      },
                      '\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C',
                    ),
                  ),
                ),
              );
            },
          },
        ]);

        return Home;
      })(_react.Component);

      exports.default = Home;
      //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzXFxob21lLmpzIl0sIm5hbWVzIjpbIlJlYWN0IiwiQ29tcG9uZW50IiwiTGF5b3V0IiwiYXhpb3MiLCJnZXRCb3RTZXR0aW5ncyIsImdldCIsIndpbmRvdyIsImxvY2F0aW9uIiwib3JpZ2luIiwicmVzdWx0IiwiZGF0YSIsIkhvbWUiLCJwcm9wcyIsInN0YXRlIiwiY29uZmlnIiwic2V0U3RhdGUiLCJjb25zb2xlIiwibG9nIiwibmFtZSIsImNoYW5uZWxfbmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQU8sQUFBUzs7OztBQUNoQixBQUFPLEFBQVk7Ozs7QUFDbkIsQUFBTzs7Ozs7Ozs7O0FBRVAsSUFBTSw2QkFBQTtzRkFBaUIsbUJBQUE7UUFBQTtrRUFBQTtnQkFBQTt5Q0FBQTtlQUFBOzRCQUFBO21CQUNBLGdCQUFBLEFBQU0sSUFBTyxPQUFBLEFBQU8sU0FBcEIsQUFBNkIsU0FEN0I7O2VBQ2Y7QUFEZSw4QkFBQTs2Q0FFZCxPQUZjLEFBRVA7O2VBRk87ZUFBQTs0QkFBQTs7QUFBQTtnQkFBQTtBQUFqQjs7bUNBQUE7NEJBQUE7QUFBQTtBQUFOOztJQU1xQixBO2dDQUNuQjs7Z0JBQUEsQUFBWSxPQUFPO3dDQUFBOzttSUFBQSxBQUNYLEFBRU47O1dBQUEsQUFBSztjQUhZLEFBR2pCLEFBQWEsQUFDSDtBQURHLEFBQ1g7V0FFSDs7Ozs7Ozs7Ozs7Ozs7dUIsQUFFc0I7OztrQ0FBZDtBLDZCLEFBQUEsQUFDUDs7cUJBQUEsQUFBSyxTQUFTLEVBQUMsUUFBZixBQUFjLEFBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs2QkFFaEIsQUFDUDtVQUFNLFNBQVMsS0FBQSxBQUFLLE1BQXBCLEFBQTBCLEFBQzFCO2NBQUEsQUFBUSxJQUFSLEFBQVksQUFDWjs2QkFDRSxBQUFDOztvQkFBRDtzQkFBQSxBQUNFO0FBREY7QUFBQSxPQUFBLGtCQUNFLGNBQUE7O29CQUFBO3NCQUFBO0FBQUE7QUFBQSxTQURGLEFBQ0UsQUFDQSxpTUFBQSxjQUFBLFNBQUssV0FBTCxBQUFlO29CQUFmO3NCQUFBLEFBQ0U7QUFERjt5QkFDRSxjQUFBLFNBQUssV0FBTCxBQUFlO29CQUFmO3NCQUFBLEFBQ0U7QUFERjt5QkFDRSxjQUFBLFNBQUssV0FBTCxBQUFlO29CQUFmO3NCQUFBLEFBQ0U7QUFERjt5QkFDRSxjQUFBLFdBQU8sU0FBUCxBQUFlO29CQUFmO3NCQUFBO0FBQUE7U0FGSixBQUNFLEFBQ0UsQUFFRixpRUFBQSxjQUFBLFNBQUssV0FBTCxBQUFlO29CQUFmO3NCQUFBLEFBQ0U7QUFERjs7a0JBQ0UsQUFDVyxBQUNUO2NBRkYsQUFFTyxBQUNMO2NBSEYsQUFHTyxBQUNMO1lBSkYsQUFJSyxBQUNIO2VBQU8sT0FMVCxBQUtnQixBQUNkO21CQU5GLEFBTVk7b0JBTlo7c0JBTk4sQUFDRSxBQUlFLEFBQ0UsQUFTSjtBQVRJO0FBQ0UsNEJBUU4sY0FBQSxTQUFLLFdBQUwsQUFBZTtvQkFBZjtzQkFBQSxBQUNFO0FBREY7eUJBQ0UsY0FBQSxTQUFLLFdBQUwsQUFBZTtvQkFBZjtzQkFBQSxBQUNFO0FBREY7eUJBQ0UsY0FBQSxXQUFPLFNBQVAsQUFBZTtvQkFBZjtzQkFBQTtBQUFBO1NBRkosQUFDRSxBQUNFLEFBRUYsb0RBQUEsY0FBQSxTQUFLLFdBQUwsQUFBZTtvQkFBZjtzQkFBQSxBQUNFO0FBREY7a0RBQ1MsVUFBUCxBQUFnQixBQUNoQjtjQURBLEFBQ0ssQUFDTDtjQUZBLEFBRUssQUFDTDtZQUhBLEFBR0csQUFDSDtlQUFPLE9BSlAsQUFJYyxjQUFjLFdBSjVCLEFBSXNDO29CQUp0QztzQkFwQk4sQUFlRSxBQUlFLEFBQ0UsQUFPSjtBQVBJOzRCQU9KLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO3lCQUNFLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO3lCQUNFLGNBQUEsV0FBTyxTQUFQLEFBQWU7b0JBQWY7c0JBQUE7QUFBQTtTQUZKLEFBQ0UsQUFDRSxBQUVGLHdGQUFBLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO2tEQUNTLFVBQVAsQUFBZ0IsWUFBVyxNQUEzQixBQUFnQyxRQUFPLE1BQXZDLEFBQTRDLFlBQVcsSUFBdkQsQUFBMEQsWUFBVyxPQUFyRSxBQUEyRSxTQUFRLFdBQW5GLEFBQTZGO29CQUE3RjtzQkFoQ04sQUEyQkUsQUFJRSxBQUNFLEFBR0o7QUFISTs0QkFHSixjQUFBLFNBQUssV0FBTCxBQUFlO29CQUFmO3NCQUFBLEFBQ0U7QUFERjt5QkFDRSxjQUFBLFNBQUssV0FBTCxBQUFlO29CQUFmO3NCQUFBLEFBQ0U7QUFERjt5QkFDRSxjQUFBLFdBQU8sU0FBUCxBQUFlO29CQUFmO3NCQUFBO0FBQUE7U0FERixBQUNFLEFBQ0EsbUxBQU8sSUFBUCxBQUFVLGVBQWMsTUFBeEIsQUFBNkIsWUFBVyxTQUF4QyxBQUFnRCxXQUFVLFdBQTFELEFBQW9FO29CQUFwRTtzQkFISixBQUNFLEFBRUUsQUFFRjtBQUZFOzJCQUVGLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO3FEQUNZLE1BQVYsQUFBZSxhQUFZLElBQTNCLEFBQThCLGFBQVksV0FBMUMsQUFBb0Q7b0JBQXBEO3NCQXpDTixBQW1DRSxBQUtFLEFBQ0UsQUFHSjtBQUhJOzRCQUdKLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO3lCQUNFLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO3lCQUNFLGNBQUEsV0FBTyxTQUFQLEFBQWU7b0JBQWY7c0JBQUE7QUFBQTtTQURGLEFBQ0UsQUFDQSxpS0FBTyxJQUFQLEFBQVUsZ0JBQWUsTUFBekIsQUFBOEIsWUFBVyxTQUF6QyxBQUFpRCxXQUFVLFdBQTNELEFBQXFFO29CQUFyRTtzQkFISixBQUNFLEFBRUUsQUFFRjtBQUZFOzJCQUVGLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO3FEQUNZLE1BQVYsQUFBZSxjQUFhLElBQTVCLEFBQStCLGNBQWEsV0FBNUMsQUFBc0Q7b0JBQXREO3NCQWxETixBQTRDRSxBQUtFLEFBQ0UsQUFHSjtBQUhJOzRCQUdKLGNBQUEsU0FBSyxXQUFMLEFBQWU7b0JBQWY7c0JBQUEsQUFDRTtBQURGO2dEQUNPLFdBQUwsQUFBZTtvQkFBZjtzQkFERixBQUNFLEFBQ0E7QUFEQTswQkFDQSxjQUFBLFlBQVEsZUFBUixBQUFvQixlQUFjLFdBQWxDLEFBQTRDO29CQUE1QztzQkFBQTtBQUFBO1NBMURSLEFBQ0UsQUFFRSxBQXFERSxBQUVFLEFBTVQ7Ozs7O0FBL0UrQixBOztrQkFBYixBIiwiZmlsZSI6ImhvbWUuanM/ZW50cnkiLCJzb3VyY2VSb290IjoiRDovd2ViL25leHQifQ==

      (function register() {
        /* react-hot-loader/webpack */ if (true) {
          if (typeof __REACT_HOT_LOADER__ === 'undefined') {
            return;
          }
          /* eslint-disable camelcase, no-undef */ var webpackExports =
            typeof __webpack_exports__ !== 'undefined'
              ? __webpack_exports__
              : module.exports;
          /* eslint-enable camelcase, no-undef */ if (
            typeof webpackExports === 'function'
          ) {
            __REACT_HOT_LOADER__.register(
              webpackExports,
              'module.exports',
              'D:\\web\\next\\pages\\home.js',
            );
            return;
          }
          /* eslint-disable no-restricted-syntax */ for (var key in webpackExports) {
            /* eslint-enable no-restricted-syntax */ if (
              !Object.prototype.hasOwnProperty.call(webpackExports, key)
            ) {
              continue;
            }
            var namedExport = void 0;
            try {
              namedExport = webpackExports[key];
            } catch (err) {
              continue;
            }
            __REACT_HOT_LOADER__.register(
              namedExport,
              key,
              'D:\\web\\next\\pages\\home.js',
            );
          }
        }
      })();
      (function(Component, route) {
        if (false) return;
        if (false) return;

        var qs = __webpack_require__(84);
        var params = qs.parse(__resourceQuery.slice(1));
        if (params.entry == null) return;

        module.hot.accept();
        Component.__route = route;

        if (module.hot.status() === 'idle') return;

        var components = next.router.components;
        for (var r in components) {
          if (!components.hasOwnProperty(r)) continue;

          if (components[r].Component.__route === route) {
            next.router.update(r, Component);
          }
        }
      })(
        typeof __webpack_exports__ !== 'undefined'
          ? __webpack_exports__.default
          : module.exports.default || module.exports,
        '/home',
      );

      /* WEBPACK VAR INJECTION */
    }.call(exports, '?entry'));

    /***/
  },
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNS44YThhNTczYTlhNjExZjNlMzE3Zi5ob3QtdXBkYXRlLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vcGFnZXMvaG9tZS5qcz80Njc0NWJjIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcbmltcG9ydCBMYXlvdXQgZnJvbSAnLi4vY29tcG9uZW50cy9sYXlvdXQnXG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnXG5cbmNvbnN0IGdldEJvdFNldHRpbmdzID0gYXN5bmMgKCkgPT4ge1xuICBjb25zdCByZXN1bHQgPSBhd2FpdCBheGlvcy5nZXQoYCR7d2luZG93LmxvY2F0aW9uLm9yaWdpbn0vYXBpL2dldEJvdFNldHRpbmdzYClcbiAgcmV0dXJuIHJlc3VsdC5kYXRhXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSG9tZSBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpXG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY29uZmlnOiB7fVxuICAgIH1cbiAgfVxuICBhc3luYyBjb21wb25lbnRXaWxsTW91bnQoKSB7XG4gICAgY29uc3Qge2RhdGF9ID0gYXdhaXQgZ2V0Qm90U2V0dGluZ3MoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtjb25maWc6IGRhdGF9KTtcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgY29uZmlnID0gdGhpcy5zdGF0ZS5jb25maWc7XG4gICAgY29uc29sZS5sb2coY29uZmlnKTtcbiAgICByZXR1cm4gKFxuICAgICAgPExheW91dD5cbiAgICAgICAgPHA+0JfQsNC00LDQudGC0LUg0L3QsNGB0YLRgNC+0LrQuCDQtNC70Y8g0LLQsNGI0LXQs9C+INCx0L7RgtCwPC9wPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNldHRpbmdzXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc19faXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc19faXRlbS1jb2xcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJib3RfbmFtZVwiPtCY0LzRjyDQsdC+0YLQsDwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NfX2l0ZW0tY29sXCI+XG4gICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgIGRpc2FibGVkPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgICAgICBuYW1lPVwiYm90X25hbWVcIlxuICAgICAgICAgICAgICAgIGlkPVwiYm90X25hbWVcIlxuICAgICAgICAgICAgICAgIHZhbHVlPXtjb25maWcubmFtZX1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJpbnB1dCBzZXR0aW5nc19faW5wdXRcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNldHRpbmdzX19pdGVtXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNldHRpbmdzX19pdGVtLWNvbFwiPlxuICAgICAgICAgICAgICA8bGFiZWwgaHRtbEZvcj1cImJvdF9uYW1lXCI+0JrQsNC90LDQuzwvbGFiZWw+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NfX2l0ZW0tY29sXCI+XG4gICAgICAgICAgICAgIDxpbnB1dCBkaXNhYmxlZD1cImRpc2FibGVkXCJcbiAgICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgICBuYW1lPVwiYm90X25hbWVcIlxuICAgICAgICAgICAgICBpZD1cImJvdF9uYW1lXCJcbiAgICAgICAgICAgICAgdmFsdWU9e2NvbmZpZy5jaGFubmVsX25hbWV9IGNsYXNzTmFtZT1cImlucHV0IHNldHRpbmdzX19pbnB1dFwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NfX2l0ZW1cIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NfX2l0ZW0tY29sXCI+XG4gICAgICAgICAgICAgIDxsYWJlbCBodG1sRm9yPVwiYm90X25hbWVcIj7QmNC30L7QsdGA0LDQttC10L3QuNC1PC9sYWJlbD5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc19faXRlbS1jb2xcIj5cbiAgICAgICAgICAgICAgPGlucHV0IGRpc2FibGVkPVwiZGlzYWJsZWRcIiB0eXBlPVwidGV4dFwiIG5hbWU9XCJib3RfbmFtZVwiIGlkPVwiYm90X25hbWVcIiB2YWx1ZT1cInZhbHVlXCIgY2xhc3NOYW1lPVwiaW5wdXQgc2V0dGluZ3NfX2lucHV0XCIvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc19faXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc19faXRlbS1jb2xcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJqb2luX2FjdGl2ZVwiPtCf0YDQuNCy0LXRgdGC0LLQtdC90L3QvtC1INGB0L7QvtCx0YnQtdC90LjQtTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBpZD1cImpvaW5fYWN0aXZlXCIgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD1cImNoZWNrZWRcIiBjbGFzc05hbWU9XCJpbnB1dCBzZXR0aW5nc19fY2hlY2tib3hcIi8+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NfX2l0ZW0tY29sXCI+XG4gICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwidXNlcl9qb2luXCIgaWQ9XCJ1c2VyX2pvaW5cIiBjbGFzc05hbWU9XCJ0ZXh0YXJlYSBzZXR0aW5nc19fdGV4dGFyZWFcIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc19faXRlbVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc19faXRlbS1jb2xcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIGh0bWxGb3I9XCJsZWF2ZV9hY3RpdmVcIj7Qn9GA0L7RidCw0LvRjNC90L7QtSDRgdC+0L7QsdGJ0LXQvdC40LU8L2xhYmVsPlxuICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJsZWF2ZV9hY3RpdmVcIiB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPVwiY2hlY2tlZFwiIGNsYXNzTmFtZT1cImlucHV0IHNldHRpbmdzX19jaGVja2JveFwiLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzZXR0aW5nc19faXRlbS1jb2xcIj5cbiAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJ1c2VyX2xlYXZlXCIgaWQ9XCJ1c2VyX2xlYXZlXCIgY2xhc3NOYW1lPVwidGV4dGFyZWEgc2V0dGluZ3NfX3RleHRhcmVhXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NfX3NhdmVcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2V0dGluZ3NfX21lc3NhZ2VcIj48L2Rpdj5cbiAgICAgICAgICAgIDxidXR0b24gZGF0YS1ib3QtaWQ9XCJkYXRhLWJvdC1pZFwiIGNsYXNzTmFtZT1cImJ1dHRvbiBidXR0b25fcHJpbWFyeVwiPtCh0L7RhdGA0LDQvdC40YLRjDwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgPC9MYXlvdXQ+XG4gICAgKVxuICB9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYWdlcy9ob21lLmpzP2VudHJ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7O0FBQUE7QUFDQTs7Ozs7Ozs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFFQTtBQUNBO0FBSEE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFDQTs7QUFNQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQUVBO0FBQUE7QUFDQTtBQUVBOztBQUFBO0FBQ0E7QUFEQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUNBO0FBREE7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBTkE7QUFTQTtBQVRBO0FBQ0E7QUFRQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUFBO0FBSkE7QUFPQTtBQVBBO0FBT0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBR0E7QUFIQTtBQUdBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFFQTtBQUZBO0FBRUE7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBR0E7QUFIQTtBQUdBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFFQTtBQUZBO0FBRUE7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBR0E7QUFIQTtBQUdBO0FBQUE7QUFDQTtBQURBO0FBQ0E7QUFBQTtBQUNBO0FBREE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQU1BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBIiwic291cmNlUm9vdCI6IiJ9
