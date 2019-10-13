/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

/**
 * Interface that represents user description.
 */
@interface VIUser : NSObject

/**
 * Direct initialization of this object can produce undesirable consequences.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 * Array of UUIDs for the conversations the user has joined.
 */
@property(nonatomic, strong, readonly) NSArray<NSString *> *conversationList;

/**
 * Array of UUIDs for *uber* conversations that user was joined, but currently is not participating in.
 */
@property(nonatomic, strong, readonly) NSArray<NSString *> *leaveConversationList;

/**
 * Public custom data available to all users.
 */
@property(nonatomic, strong, readonly) NSDictionary *customData;

/**
 * Private custom data available only to the user himself.
 */
@property(nonatomic, strong, readonly) NSDictionary *privateCustomData;

/**
 *  Voximplant user identifier, ex username@appname.accname.
 */
@property(nonatomic, strong, readonly) NSString *userId;

/**
 * Array of messenger notifications that current user is subscribed to.
 *
 * See <VIMessengerNotification> for available variants.
 */
@property(nonatomic, strong, readonly) NSArray<NSNumber *> *notifications;

@end
