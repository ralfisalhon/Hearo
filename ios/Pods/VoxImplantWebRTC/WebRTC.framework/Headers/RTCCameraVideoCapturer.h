/*
 *  Copyright 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree. An additional intellectual property rights grant can be found
 *  in the file PATENTS.  All contributing project authors may
 *  be found in the AUTHORS file in the root of the source tree.
 */

#import <Foundation/Foundation.h>
#import <AVFoundation/AVFoundation.h>

#import <WebRTC/RTCMacros.h>
#import <WebRTC/RTCVideoCapturer.h>

NS_ASSUME_NONNULL_BEGIN

typedef void (^VideoPreProcessBlock)(CVPixelBufferRef pixel_buffer, RTCVideoRotation rotation);
typedef NS_OPTIONS(NSInteger, SupportedDeviceOrientation) {
    SupportedDeviceOrientationPortrait = 1 << 0,
    SupportedDeviceOrientationPortraitUpsideDown = 1 << 1,
    SupportedDeviceOrientationLandscapeLeft = 1 << 2,
    SupportedDeviceOrientationLandscapeRight = 1 << 3,
    SupportedDeviceOrientationAll = SupportedDeviceOrientationPortrait | SupportedDeviceOrientationPortraitUpsideDown | SupportedDeviceOrientationLandscapeLeft | SupportedDeviceOrientationLandscapeRight,
};

RTC_EXPORT
// Camera capture that implements RTCVideoCapturer. Delivers frames to a RTCVideoCapturerDelegate
// (usually RTCVideoSource).
@interface RTCCameraVideoCapturer : RTCVideoCapturer

// Capture session that is used for capturing. Valid from initialization to dealloc.
@property(readonly, nonatomic) AVCaptureSession *captureSession;

@property(nonatomic, strong) VideoPreProcessBlock videoPreProcessBlock;

@property (nonatomic, assign) SupportedDeviceOrientation iPhoneOrientationMask;
@property (nonatomic, assign) SupportedDeviceOrientation iPadOrientationMask;
- (void)setSupportedDeviceOrientationForIPhone:(SupportedDeviceOrientation)iPhoneOrientationMask iPad:(SupportedDeviceOrientation)iPadOrientationMask;

// Returns list of available capture devices that support video capture.
+ (NSArray<AVCaptureDevice *> *)captureDevices;
// Returns list of formats that are supported by this class for this device.
+ (NSArray<AVCaptureDeviceFormat *> *)supportedFormatsForDevice:(AVCaptureDevice *)device;

// Starts and stops the capture session asynchronously.
- (void)startCaptureWithDevice:(AVCaptureDevice *)device
                        format:(AVCaptureDeviceFormat *)format
                           fps:(NSInteger)fps;
// Stops the capture session asynchronously.
- (void)stopCapture;

@end

NS_ASSUME_NONNULL_END
