/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

/**
 * Supported audio devices.
 */
typedef NS_ENUM(NSInteger, VIAudioDeviceType) {
    /** Unspecified audio device. */
            VIAudioDeviceTypeNone,
    /** Built-in receiver. */
            VIAudioDeviceTypeReceiver,
    /** Built-in speaker. */
            VIAudioDeviceTypeSpeaker,
    /** Wired headset. */
            VIAudioDeviceTypeWired,
    /** Bluetooth headset. */
            VIAudioDeviceTypeBluetooth
};

/**
 * Audio device descriptor.
 */
@interface VIAudioDevice : NSObject <NSCopying>

/**
 * Type of current device.
 */
@property(assign, nonatomic, readonly) VIAudioDeviceType type;

/**
 * Default initializer.
 *
 * @param type Device type.
 * @return Audio device descriptor.
 */
+ (instancetype)deviceWithType:(VIAudioDeviceType)type NS_SWIFT_UNAVAILABLE("");

/**
 * Initializer to use with Swift.
 *
 * @param type Device type.
 * @return Audio device descriptor.
 */
- (instancetype)initWithType:(VIAudioDeviceType)type;

@end
