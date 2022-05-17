import * as $protobuf from "protobufjs";
/** Properties of a ResolveMeetingSpace. */
export interface IResolveMeetingSpace {

    /** ResolveMeetingSpace meetId */
    meetId?: (string|null);
}

/** Represents a ResolveMeetingSpace. */
export class ResolveMeetingSpace implements IResolveMeetingSpace {

    /**
     * Constructs a new ResolveMeetingSpace.
     * @param [properties] Properties to set
     */
    constructor(properties?: IResolveMeetingSpace);

    /** ResolveMeetingSpace meetId. */
    public meetId: string;

    /**
     * Creates a new ResolveMeetingSpace instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ResolveMeetingSpace instance
     */
    public static create(properties?: IResolveMeetingSpace): ResolveMeetingSpace;

    /**
     * Encodes the specified ResolveMeetingSpace message. Does not implicitly {@link ResolveMeetingSpace.verify|verify} messages.
     * @param message ResolveMeetingSpace message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IResolveMeetingSpace, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified ResolveMeetingSpace message, length delimited. Does not implicitly {@link ResolveMeetingSpace.verify|verify} messages.
     * @param message ResolveMeetingSpace message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IResolveMeetingSpace, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a ResolveMeetingSpace message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ResolveMeetingSpace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): ResolveMeetingSpace;

    /**
     * Decodes a ResolveMeetingSpace message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ResolveMeetingSpace
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): ResolveMeetingSpace;

    /**
     * Verifies a ResolveMeetingSpace message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a ResolveMeetingSpace message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ResolveMeetingSpace
     */
    public static fromObject(object: { [k: string]: any }): ResolveMeetingSpace;

    /**
     * Creates a plain object from a ResolveMeetingSpace message. Also converts values to other types if specified.
     * @param message ResolveMeetingSpace
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: ResolveMeetingSpace, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this ResolveMeetingSpace to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a CreateMeetingDevice. */
export interface ICreateMeetingDevice {

    /** CreateMeetingDevice participantId */
    participantId?: (string|null);

    /** CreateMeetingDevice nickname */
    nickname?: (string|null);

    /** CreateMeetingDevice imageUrl */
    imageUrl?: (string|null);
}

/** Represents a CreateMeetingDevice. */
export class CreateMeetingDevice implements ICreateMeetingDevice {

    /**
     * Constructs a new CreateMeetingDevice.
     * @param [properties] Properties to set
     */
    constructor(properties?: ICreateMeetingDevice);

    /** CreateMeetingDevice participantId. */
    public participantId: string;

    /** CreateMeetingDevice nickname. */
    public nickname: string;

    /** CreateMeetingDevice imageUrl. */
    public imageUrl: string;

    /**
     * Creates a new CreateMeetingDevice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns CreateMeetingDevice instance
     */
    public static create(properties?: ICreateMeetingDevice): CreateMeetingDevice;

    /**
     * Encodes the specified CreateMeetingDevice message. Does not implicitly {@link CreateMeetingDevice.verify|verify} messages.
     * @param message CreateMeetingDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ICreateMeetingDevice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified CreateMeetingDevice message, length delimited. Does not implicitly {@link CreateMeetingDevice.verify|verify} messages.
     * @param message CreateMeetingDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ICreateMeetingDevice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a CreateMeetingDevice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns CreateMeetingDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): CreateMeetingDevice;

    /**
     * Decodes a CreateMeetingDevice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns CreateMeetingDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): CreateMeetingDevice;

    /**
     * Verifies a CreateMeetingDevice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a CreateMeetingDevice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns CreateMeetingDevice
     */
    public static fromObject(object: { [k: string]: any }): CreateMeetingDevice;

    /**
     * Creates a plain object from a CreateMeetingDevice message. Also converts values to other types if specified.
     * @param message CreateMeetingDevice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: CreateMeetingDevice, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this CreateMeetingDevice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of an UpdateMeetingDevice. */
export interface IUpdateMeetingDevice {

    /** UpdateMeetingDevice participantId */
    participantId?: (string|null);

    /** UpdateMeetingDevice nickname */
    nickname?: (string|null);

    /** UpdateMeetingDevice imageUrl */
    imageUrl?: (string|null);
}

/** Represents an UpdateMeetingDevice. */
export class UpdateMeetingDevice implements IUpdateMeetingDevice {

    /**
     * Constructs a new UpdateMeetingDevice.
     * @param [properties] Properties to set
     */
    constructor(properties?: IUpdateMeetingDevice);

    /** UpdateMeetingDevice participantId. */
    public participantId: string;

    /** UpdateMeetingDevice nickname. */
    public nickname: string;

    /** UpdateMeetingDevice imageUrl. */
    public imageUrl: string;

    /**
     * Creates a new UpdateMeetingDevice instance using the specified properties.
     * @param [properties] Properties to set
     * @returns UpdateMeetingDevice instance
     */
    public static create(properties?: IUpdateMeetingDevice): UpdateMeetingDevice;

    /**
     * Encodes the specified UpdateMeetingDevice message. Does not implicitly {@link UpdateMeetingDevice.verify|verify} messages.
     * @param message UpdateMeetingDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IUpdateMeetingDevice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified UpdateMeetingDevice message, length delimited. Does not implicitly {@link UpdateMeetingDevice.verify|verify} messages.
     * @param message UpdateMeetingDevice message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IUpdateMeetingDevice, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes an UpdateMeetingDevice message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns UpdateMeetingDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): UpdateMeetingDevice;

    /**
     * Decodes an UpdateMeetingDevice message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns UpdateMeetingDevice
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): UpdateMeetingDevice;

    /**
     * Verifies an UpdateMeetingDevice message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates an UpdateMeetingDevice message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns UpdateMeetingDevice
     */
    public static fromObject(object: { [k: string]: any }): UpdateMeetingDevice;

    /**
     * Creates a plain object from an UpdateMeetingDevice message. Also converts values to other types if specified.
     * @param message UpdateMeetingDevice
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: UpdateMeetingDevice, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this UpdateMeetingDevice to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
