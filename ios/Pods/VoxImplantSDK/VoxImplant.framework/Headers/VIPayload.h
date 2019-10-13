/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>

/**
 * Interface that represent message payload format.
 */
@interface VIPayload : NSObject

/**
 * Payload data
 */
@property(nonatomic, strong) NSObject *data;

/**
 * Payload fragment unique title. Used to identifier fragment in the list of fragments associated with the message.
 */
@property(nonatomic, strong) NSString *title;

/**
 * Arbitrary payload type.
 */
@property(nonatomic, strong) NSString *type;

/**
 * Direct initialization of this object can produce undesirable consequences.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 * Initialize VIPayload with NSString.
 *
 * @param title      Payload fragment unique title.
 * @param type       Arbitrary payload type.
 * @param dataString Payload data string.
 * @return           Payload instance.
 */
- (instancetype)initWithTitle:(NSString *)title type:(NSString *)type dataString:(NSString *)dataString;

/**
 * Initialize VIPayload with NSDictionary.
 *
 * @param title          Payload fragment unique title.
 * @param type           Arbitrary payload type.
 * @param dataDictionary Payload data dictionary.
 * @return               Payload instance
 */
- (instancetype)initWithTitle:(NSString *)title type:(NSString *)type dataDictionary:(NSDictionary *)dataDictionary;

/**
 * Initialize Payload with NSArray.
 *
 * @param title     Payload fragment unique title.
 * @param type      Arbitrary payload type.
 * @param dataArray Payload data array.
 * @return          Payload instance
 */
- (instancetype)initWithTitle:(NSString *)title type:(NSString *)type dataArray:(NSArray *)dataArray;

@end
