/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const ResolveMeetingSpace = $root.ResolveMeetingSpace = (() => {

    /**
     * Properties of a ResolveMeetingSpace.
     * @exports IResolveMeetingSpace
     * @interface IResolveMeetingSpace
     * @property {string|null} [meetId] ResolveMeetingSpace meetId
     */

    /**
     * Constructs a new ResolveMeetingSpace.
     * @exports ResolveMeetingSpace
     * @classdesc Represents a ResolveMeetingSpace.
     * @implements IResolveMeetingSpace
     * @constructor
     * @param {IResolveMeetingSpace=} [properties] Properties to set
     */
    function ResolveMeetingSpace(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * ResolveMeetingSpace meetId.
     * @member {string} meetId
     * @memberof ResolveMeetingSpace
     * @instance
     */
    ResolveMeetingSpace.prototype.meetId = "";

    /**
     * Creates a new ResolveMeetingSpace instance using the specified properties.
     * @function create
     * @memberof ResolveMeetingSpace
     * @static
     * @param {IResolveMeetingSpace=} [properties] Properties to set
     * @returns {ResolveMeetingSpace} ResolveMeetingSpace instance
     */
    ResolveMeetingSpace.create = function create(properties) {
        return new ResolveMeetingSpace(properties);
    };

    /**
     * Encodes the specified ResolveMeetingSpace message. Does not implicitly {@link ResolveMeetingSpace.verify|verify} messages.
     * @function encode
     * @memberof ResolveMeetingSpace
     * @static
     * @param {IResolveMeetingSpace} message ResolveMeetingSpace message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ResolveMeetingSpace.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.meetId != null && Object.hasOwnProperty.call(message, "meetId"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.meetId);
        return writer;
    };

    /**
     * Encodes the specified ResolveMeetingSpace message, length delimited. Does not implicitly {@link ResolveMeetingSpace.verify|verify} messages.
     * @function encodeDelimited
     * @memberof ResolveMeetingSpace
     * @static
     * @param {IResolveMeetingSpace} message ResolveMeetingSpace message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ResolveMeetingSpace.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ResolveMeetingSpace message from the specified reader or buffer.
     * @function decode
     * @memberof ResolveMeetingSpace
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {ResolveMeetingSpace} ResolveMeetingSpace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ResolveMeetingSpace.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.ResolveMeetingSpace();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 2:
                message.meetId = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a ResolveMeetingSpace message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof ResolveMeetingSpace
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {ResolveMeetingSpace} ResolveMeetingSpace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ResolveMeetingSpace.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ResolveMeetingSpace message.
     * @function verify
     * @memberof ResolveMeetingSpace
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ResolveMeetingSpace.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.meetId != null && message.hasOwnProperty("meetId"))
            if (!$util.isString(message.meetId))
                return "meetId: string expected";
        return null;
    };

    /**
     * Creates a ResolveMeetingSpace message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof ResolveMeetingSpace
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {ResolveMeetingSpace} ResolveMeetingSpace
     */
    ResolveMeetingSpace.fromObject = function fromObject(object) {
        if (object instanceof $root.ResolveMeetingSpace)
            return object;
        let message = new $root.ResolveMeetingSpace();
        if (object.meetId != null)
            message.meetId = String(object.meetId);
        return message;
    };

    /**
     * Creates a plain object from a ResolveMeetingSpace message. Also converts values to other types if specified.
     * @function toObject
     * @memberof ResolveMeetingSpace
     * @static
     * @param {ResolveMeetingSpace} message ResolveMeetingSpace
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ResolveMeetingSpace.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.meetId = "";
        if (message.meetId != null && message.hasOwnProperty("meetId"))
            object.meetId = message.meetId;
        return object;
    };

    /**
     * Converts this ResolveMeetingSpace to JSON.
     * @function toJSON
     * @memberof ResolveMeetingSpace
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ResolveMeetingSpace.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return ResolveMeetingSpace;
})();

export const CreateMeetingDevice = $root.CreateMeetingDevice = (() => {

    /**
     * Properties of a CreateMeetingDevice.
     * @exports ICreateMeetingDevice
     * @interface ICreateMeetingDevice
     * @property {string|null} [participantId] CreateMeetingDevice participantId
     * @property {string|null} [nickname] CreateMeetingDevice nickname
     * @property {string|null} [imageUrl] CreateMeetingDevice imageUrl
     */

    /**
     * Constructs a new CreateMeetingDevice.
     * @exports CreateMeetingDevice
     * @classdesc Represents a CreateMeetingDevice.
     * @implements ICreateMeetingDevice
     * @constructor
     * @param {ICreateMeetingDevice=} [properties] Properties to set
     */
    function CreateMeetingDevice(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CreateMeetingDevice participantId.
     * @member {string} participantId
     * @memberof CreateMeetingDevice
     * @instance
     */
    CreateMeetingDevice.prototype.participantId = "";

    /**
     * CreateMeetingDevice nickname.
     * @member {string} nickname
     * @memberof CreateMeetingDevice
     * @instance
     */
    CreateMeetingDevice.prototype.nickname = "";

    /**
     * CreateMeetingDevice imageUrl.
     * @member {string} imageUrl
     * @memberof CreateMeetingDevice
     * @instance
     */
    CreateMeetingDevice.prototype.imageUrl = "";

    /**
     * Creates a new CreateMeetingDevice instance using the specified properties.
     * @function create
     * @memberof CreateMeetingDevice
     * @static
     * @param {ICreateMeetingDevice=} [properties] Properties to set
     * @returns {CreateMeetingDevice} CreateMeetingDevice instance
     */
    CreateMeetingDevice.create = function create(properties) {
        return new CreateMeetingDevice(properties);
    };

    /**
     * Encodes the specified CreateMeetingDevice message. Does not implicitly {@link CreateMeetingDevice.verify|verify} messages.
     * @function encode
     * @memberof CreateMeetingDevice
     * @static
     * @param {ICreateMeetingDevice} message CreateMeetingDevice message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CreateMeetingDevice.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.participantId != null && Object.hasOwnProperty.call(message, "participantId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.participantId);
        if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.nickname);
        if (message.imageUrl != null && Object.hasOwnProperty.call(message, "imageUrl"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.imageUrl);
        return writer;
    };

    /**
     * Encodes the specified CreateMeetingDevice message, length delimited. Does not implicitly {@link CreateMeetingDevice.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CreateMeetingDevice
     * @static
     * @param {ICreateMeetingDevice} message CreateMeetingDevice message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CreateMeetingDevice.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CreateMeetingDevice message from the specified reader or buffer.
     * @function decode
     * @memberof CreateMeetingDevice
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CreateMeetingDevice} CreateMeetingDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CreateMeetingDevice.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CreateMeetingDevice();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.participantId = reader.string();
                break;
            case 2:
                message.nickname = reader.string();
                break;
            case 3:
                message.imageUrl = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a CreateMeetingDevice message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CreateMeetingDevice
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CreateMeetingDevice} CreateMeetingDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CreateMeetingDevice.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CreateMeetingDevice message.
     * @function verify
     * @memberof CreateMeetingDevice
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CreateMeetingDevice.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.participantId != null && message.hasOwnProperty("participantId"))
            if (!$util.isString(message.participantId))
                return "participantId: string expected";
        if (message.nickname != null && message.hasOwnProperty("nickname"))
            if (!$util.isString(message.nickname))
                return "nickname: string expected";
        if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
            if (!$util.isString(message.imageUrl))
                return "imageUrl: string expected";
        return null;
    };

    /**
     * Creates a CreateMeetingDevice message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CreateMeetingDevice
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CreateMeetingDevice} CreateMeetingDevice
     */
    CreateMeetingDevice.fromObject = function fromObject(object) {
        if (object instanceof $root.CreateMeetingDevice)
            return object;
        let message = new $root.CreateMeetingDevice();
        if (object.participantId != null)
            message.participantId = String(object.participantId);
        if (object.nickname != null)
            message.nickname = String(object.nickname);
        if (object.imageUrl != null)
            message.imageUrl = String(object.imageUrl);
        return message;
    };

    /**
     * Creates a plain object from a CreateMeetingDevice message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CreateMeetingDevice
     * @static
     * @param {CreateMeetingDevice} message CreateMeetingDevice
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CreateMeetingDevice.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.participantId = "";
            object.nickname = "";
            object.imageUrl = "";
        }
        if (message.participantId != null && message.hasOwnProperty("participantId"))
            object.participantId = message.participantId;
        if (message.nickname != null && message.hasOwnProperty("nickname"))
            object.nickname = message.nickname;
        if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
            object.imageUrl = message.imageUrl;
        return object;
    };

    /**
     * Converts this CreateMeetingDevice to JSON.
     * @function toJSON
     * @memberof CreateMeetingDevice
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CreateMeetingDevice.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return CreateMeetingDevice;
})();

export const UpdateMeetingDevice = $root.UpdateMeetingDevice = (() => {

    /**
     * Properties of an UpdateMeetingDevice.
     * @exports IUpdateMeetingDevice
     * @interface IUpdateMeetingDevice
     * @property {string|null} [participantId] UpdateMeetingDevice participantId
     * @property {string|null} [nickname] UpdateMeetingDevice nickname
     * @property {string|null} [imageUrl] UpdateMeetingDevice imageUrl
     */

    /**
     * Constructs a new UpdateMeetingDevice.
     * @exports UpdateMeetingDevice
     * @classdesc Represents an UpdateMeetingDevice.
     * @implements IUpdateMeetingDevice
     * @constructor
     * @param {IUpdateMeetingDevice=} [properties] Properties to set
     */
    function UpdateMeetingDevice(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UpdateMeetingDevice participantId.
     * @member {string} participantId
     * @memberof UpdateMeetingDevice
     * @instance
     */
    UpdateMeetingDevice.prototype.participantId = "";

    /**
     * UpdateMeetingDevice nickname.
     * @member {string} nickname
     * @memberof UpdateMeetingDevice
     * @instance
     */
    UpdateMeetingDevice.prototype.nickname = "";

    /**
     * UpdateMeetingDevice imageUrl.
     * @member {string} imageUrl
     * @memberof UpdateMeetingDevice
     * @instance
     */
    UpdateMeetingDevice.prototype.imageUrl = "";

    /**
     * Creates a new UpdateMeetingDevice instance using the specified properties.
     * @function create
     * @memberof UpdateMeetingDevice
     * @static
     * @param {IUpdateMeetingDevice=} [properties] Properties to set
     * @returns {UpdateMeetingDevice} UpdateMeetingDevice instance
     */
    UpdateMeetingDevice.create = function create(properties) {
        return new UpdateMeetingDevice(properties);
    };

    /**
     * Encodes the specified UpdateMeetingDevice message. Does not implicitly {@link UpdateMeetingDevice.verify|verify} messages.
     * @function encode
     * @memberof UpdateMeetingDevice
     * @static
     * @param {IUpdateMeetingDevice} message UpdateMeetingDevice message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UpdateMeetingDevice.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.participantId != null && Object.hasOwnProperty.call(message, "participantId"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.participantId);
        if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.nickname);
        if (message.imageUrl != null && Object.hasOwnProperty.call(message, "imageUrl"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.imageUrl);
        return writer;
    };

    /**
     * Encodes the specified UpdateMeetingDevice message, length delimited. Does not implicitly {@link UpdateMeetingDevice.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UpdateMeetingDevice
     * @static
     * @param {IUpdateMeetingDevice} message UpdateMeetingDevice message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UpdateMeetingDevice.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an UpdateMeetingDevice message from the specified reader or buffer.
     * @function decode
     * @memberof UpdateMeetingDevice
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UpdateMeetingDevice} UpdateMeetingDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UpdateMeetingDevice.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.UpdateMeetingDevice();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.participantId = reader.string();
                break;
            case 2:
                message.nickname = reader.string();
                break;
            case 3:
                message.imageUrl = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes an UpdateMeetingDevice message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UpdateMeetingDevice
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UpdateMeetingDevice} UpdateMeetingDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UpdateMeetingDevice.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an UpdateMeetingDevice message.
     * @function verify
     * @memberof UpdateMeetingDevice
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UpdateMeetingDevice.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.participantId != null && message.hasOwnProperty("participantId"))
            if (!$util.isString(message.participantId))
                return "participantId: string expected";
        if (message.nickname != null && message.hasOwnProperty("nickname"))
            if (!$util.isString(message.nickname))
                return "nickname: string expected";
        if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
            if (!$util.isString(message.imageUrl))
                return "imageUrl: string expected";
        return null;
    };

    /**
     * Creates an UpdateMeetingDevice message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UpdateMeetingDevice
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UpdateMeetingDevice} UpdateMeetingDevice
     */
    UpdateMeetingDevice.fromObject = function fromObject(object) {
        if (object instanceof $root.UpdateMeetingDevice)
            return object;
        let message = new $root.UpdateMeetingDevice();
        if (object.participantId != null)
            message.participantId = String(object.participantId);
        if (object.nickname != null)
            message.nickname = String(object.nickname);
        if (object.imageUrl != null)
            message.imageUrl = String(object.imageUrl);
        return message;
    };

    /**
     * Creates a plain object from an UpdateMeetingDevice message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UpdateMeetingDevice
     * @static
     * @param {UpdateMeetingDevice} message UpdateMeetingDevice
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UpdateMeetingDevice.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object.participantId = "";
            object.nickname = "";
            object.imageUrl = "";
        }
        if (message.participantId != null && message.hasOwnProperty("participantId"))
            object.participantId = message.participantId;
        if (message.nickname != null && message.hasOwnProperty("nickname"))
            object.nickname = message.nickname;
        if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
            object.imageUrl = message.imageUrl;
        return object;
    };

    /**
     * Converts this UpdateMeetingDevice to JSON.
     * @function toJSON
     * @memberof UpdateMeetingDevice
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UpdateMeetingDevice.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return UpdateMeetingDevice;
})();

export { $root as default };
