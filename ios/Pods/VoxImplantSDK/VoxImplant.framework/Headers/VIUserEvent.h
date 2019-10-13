/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import "VIMessengerEvent.h"

@class VIUser;

/**
 * Interface that represents messenger events related to user, such as get or edit user.
 */
@interface VIUserEvent : VIMessengerEvent

/**
 * User instance with updated information.
 */
@property(nonatomic, strong, readonly) VIUser *user;

@end

