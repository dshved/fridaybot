/* eslint-disable */
'use strict';

const _ = require('lodash');
const request = require('request');
const extend = require('extend');
const WebSocket = require('ws');
const { EventEmitter } = require('events');

class Bot extends EventEmitter {
  /**
     * @param {object} params
     * @constructor
     */

  constructor(params) {
    super(params);
    this.token = params.token;
    this.name = params.name;

    console.assert(params.token, 'token must be defined');
    this.login();
  }

  /**
     * Starts a Real Time Messaging API session
     */
  async login() {
    try {
      const response = await this._api('rtm.start');
      this.wsUrl = response.url;
      this.self = response.self;
      this.team = response.team;
      this.channels = response.channels;
      this.users = response.users;
      this.ims = response.ims;
      this.groups = response.groups;

      this.emit('start');

      this.connect();
    } catch (data) {
      this.emit('error', new Error(data.error ? data.error : data));
    }
  }

  /**
     * Establish a WebSocket connection
     */
  connect() {
    this.ws = new WebSocket(this.wsUrl);

    this.ws
      .on('open', data => {
        this.emit('open', data);
      })
      .on('close', data => {
        this.emit('close', data);
      })
      .on('message', data => {
        try {
          this.emit('message', JSON.parse(data));
        } catch (e) {
          console.log(e);
        }
      });
  }

  /**
     * Get channels
     * @returns {Promise<object>}
     */
  async getChannels() {
    if (this.channels) {
      return Promise.resolve(this.channels);
    }
    const { channels } = await this._api('channels.list');
    return channels;
  }

  /**
     * Get users
     * @returns {Promise<object>}
     */
  async getUsers() {
    const { members } = await this._api('users.list');
    return members;
  }

  /**
     * Get groups
     * @returns {Promise<object>}
     */
  async getGroups() {
    if (this.groups) {
      return Promise.resolve(this.groups);
    }

    const { groups } = await this._api('groups.list');
    return groups;
  }

  /**
     * Get user by name
     * @param {string} name
     * @returns {Promise<object>}
     */
  async getUser(name) {
    try {
      const members = await this.getUsers();
      const res = _.find(members, { name });

      console.assert(res, 'user not found');
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Get channel by name
     * @param {string} name
     * @returns {Promise<object>}
     */
  async getChannel(name) {
    try {
      const channels = await this.getChannels();
      const res = _.find(channels, { name });

      console.assert(res, 'channel not found');
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Get group by name
     * @param {string} name
     * @returns {Promise<object>}
     */
  async getGroup(name) {
    try {
      const groups = await this.getGroups();
      const res = _.find(groups, { name });

      console.assert(res, 'group not found');
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Get user by id
     * @param {string} id
     * @returns {Promise<object>}
     */
  async getUserById(id) {
    try {
      const members = await this.getUsers();
      const res = _.find(members, { id });

      console.assert(res, 'user not found');
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  /**
      * Get channel by id
      * @param {string} id
      * @returns {Promise<object>}
      */
  async getChannelById(id) {
    try {
      const channels = await this.getChannels();
      const res = _.find(channels, { id });

      console.assert(res, 'channel not found');
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  /**
      * Get group by id
      * @param {string} id
      * @returns {Promise<object>}
     */
  async getGroupById(id) {
    try {
      const groups = await this.getGroups();
      const res = _.find(groups, { id });

      console.assert(res, 'group not found');
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Get channel ID
     * @param {string} name
     * @returns {Promise<string>}
     */
  async getChannelId(name) {
    try {
      const { id } = await this.getChannel(name);
      return id;
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Get group ID
     * @param {string} name
     * @returns {Promise<string>}
     */
  async getGroupId(name) {
    try {
      const { id } = await this.getGroup(name);
      return id;
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Get user ID
     * @param {string} name
     * @returns {Promise<string>}
     */
  async getUserId(name) {
    try {
      const { id } = await this.getUser(name);
      return id;
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Get user by email
     * @param {string} email
     * @returns {Promise<object>}
     */
  async getUserByEmail(email) {
    try {
      const members = await this.getUsers();
      const res = _.find(members, { profile: { email } });

      console.assert(res, 'email not found');
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Get "direct message" channel ID
     * @param {string} name
     * @returns {Promise<string>}
     */
  async getChatId(name) {
    try {
      const { id, channel } = await this.getUser(name);
      const chatId = _.find(this.ims, { user: id });
      //need to investigate wtf this construction is
      const something = (chatId && chatId.id) || this.openIm(id);
      if (typeof something === 'string') {
        return something;
      } else {
        return something.channel.id;
      }
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Opens a "direct message" channel with another member of your Slack team
     * @param {string} userId
     * @returns {Promise<object>}
     */
  openIm(userId) {
    return this._api('im.open', { user: userId });
  }

  /**
     * Posts a message to a channel by ID
     * @param {string} id - channel ID
     * @param {string} text
     * @param {object} params
     * @returns {Promise<object>}
     */
  postMessage(id, text, params) {
    //since this doesn't use deep option set to true i am not sure do we need this
    
    // FOR ORNAIA SREDA
    if (new Date().getDay() == 3){
      text = text.toUpperCase();
    }
    
    params = extend(
      {
        text,
        channel: id,
        username: this.name,
      },
      params || {},
    );

    return this._api('chat.postMessage', params);
  }

  /**
      * Updates a message by timestamp
      * @param {string} id - channel ID
      * @param {string} ts - timestamp
      * @param {string} text
      * @param {object} params
      * @returns {Promise<object>}
      */
  updateMessage(id, ts, text, params) {
    params = extend(
      {
        ts,
        channel: id,
        username: this.name,
        text,
      },
      params || {},
    );

    return this._api('chat.update', params);
  }

  /**
     * Posts a message to user by name
     * @param {string} name
     * @param {string} text
     * @param {object} params
     * @param {function} cb
     * @returns {Promise<object>}
     */
  postMessageToUser(name, text, params, cb) {
    return this._post(
      (params || {}).slackbot ? 'slackbot' : 'user',
      name,
      text,
      params,
      cb,
    );
  }

  /**
     * Posts a message to channel by name
     * @param {string} name
     * @param {string} text
     * @param {object} params
     * @param {function} cb
     * @returns {Promise<object>}
     */
  postMessageToChannel(name, text, params, cb) {
    return this._post('channel', name, text, params, cb);
  }

  /**
     * Posts a message to group by name
     * @param {string} name
     * @param {string} text
     * @param {object} params
     * @param {function} cb
     * @returns {Promise<object>}
     */
  postMessageToGroup(name, text, params, cb) {
    return this._post('group', name, text, params, cb);
  }

  /**
     * Common method for posting messages
     * @param {string} type
     * @param {string} name
     * @param {string} text
     * @param {object} params
     * @param {function} cb
     * @returns {Promise}
     * @private
     */
  async _post(type, name, text, params, cb) {
    try {
      const method = {
        group: 'getGroupId',
        channel: 'getChannelId',
        user: 'getChatId',
        slackbot: 'getUserId',
      }[type];

      if (typeof params === 'function') {
        cb = params;
        params = null;
      }

      const itemId = await this[method](name);
      const { _value } = await this.postMessage(itemId, text, params);
      return cb ? cb(_value) : '';
    } catch (err) {
      console.error(err);
    }
  }

  /**
     * Posts a message to group | channel | user
     * @param {string} name
     * @param {string} text
     * @param {object} params
     * @param {function} cb
     * @returns {Promise}
     */
  async postTo(name, text, params, cb) {
    const all = await Promise.all([
      this.getChannels(),
      this.getUsers(),
      this.getGroups(),
    ]);
    const result = _.find(all, { name });

    console.assert(result, 'wrong name');

    if (result['is_channel']) {
      return this.postMessageToChannel(name, text, params, cb);
    } else if (result['is_group']) {
      return this.postMessageToGroup(name, text, params, cb);
    } else {
      return this.postMessageToUser(name, text, params, cb);
    }
  }

  /**
     * Preprocessing of params
     * @param params
     * @returns {object}
     * @private
     */
  _preprocessParams(params) {
    params = extend(params || {}, { token: this.token });

    Object.keys(params).forEach(name => {
      const param = params[name];

      if (param && typeof param === 'object') {
        params[name] = JSON.stringify(param);
      }
    });

    return params;
  }

  /**
     * Send request to API method
     * @param {string} methodName
     * @param {object} params
     * @returns {Promise}
     * @private
     */
  _api(methodName, params) {
    const data = {
      url: `https://slack.com/api/${methodName}`,
      form: this._preprocessParams(params),
    };

    return new Promise((resolve, reject) => {
      request.post(data, (err, request, body) => {
        if (err) {
          reject(err);

          return false;
        }

        try {
          body = JSON.parse(body);

          // Response always contain a top-level boolean property ok,
          // indicating success or failure
          if (body.ok) {
            resolve(body);
          } else {
            reject(body);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

module.exports = Bot;
/* eslint-enable */
