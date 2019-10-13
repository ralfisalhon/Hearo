/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

@class VIMessengerEvent;

/**
 * Helper to process incoming Voximplant messenger push notifications.
 */
@interface VIMessengerPushNotificationProcessing : NSObject

/**
 * Direct initialization of this object can produce undesirable consequences.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 * Get VIMessengerPushNotificationProcessing instance.
 *
 * @return VIMessengerPushNotificationProcessing instance.
 */
+ (instancetype)sharedMessengerPushNotificationProcessing;

/**
 * Process incoming Voximplant messenger push notification and return appropriate messenger event object inheriting [VIMessengerEvent].
 *
 * @param notification Incoming push notification that comes from [[UIApplicationDelegate application:didReceiveRemoteNotification:fetchCompletionHandler:]](https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application?language=objc).
 * @return             Event object or nil if the notification is not Voximplant messenger push notification.
 */
- (VIMessengerEvent *)processPushNotification:(NSDictionary *)notification;

@end
