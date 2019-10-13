/*
 *  Copyright (c) 2011-2018, Zingaya, Inc. All rights reserved.
 */

#import <Foundation/Foundation.h>
#import <CoreGraphics/CoreGraphics.h>

@class VIClient;
@class VICall;
@class VIMessenger;

NS_ASSUME_NONNULL_BEGIN

/** Log level. */
typedef NS_ENUM(NSUInteger, VILogLevel) {
    /** Log verbosity level to disable logs. */
            VILogLevelDisabled,
    /** Log verbosity level to include only error messages. */
            VILogLevelError,
    /** Log verbosity level to include warnings messages. */
            VILogLevelWarning,
    /** Log verbosity level to include info messages. */
            VILogLevelInfo,
    /** Log verbosity level to include debug messages. */
            VILogLevelDebug,
    /** Log verbosity level to include verbose messages. */
            VILogLevelVerbose,
    /** Log verbosity level to include all types of messages. */
            VILogLevelMax
};

/**
 * VIClient states.
 */
typedef NS_ENUM(NSUInteger, VIClientState) {
    /** The client is currently disconnected. */
            VIClientStateDisconnected,
    /** The client is currently connecting. */
            VIClientStateConnecting,
    /** The client is currently connected. */
            VIClientStateConnected,
    /** The client is currently logging in. */
            VIClientStateLoggingIn,
    /** The client is currently logged in. */
            VIClientStateLoggedIn
};

/** Interface that may be used to connect and login to Voximplant Cloud, make and receive audio/video calls. */
@interface VIClient : NSObject

/**
 * Get client version.
 *
 * @return Voximplant Client version.
 */
+ (NSString *)clientVersion;

/**
 * Get underlying WebRTC version.
 *
 * @return WebRTC version.
 */
+ (NSString *)webrtcVersion;

/**
 * Set a verbosity level for log messages. This method must be called before creating SDK object instance.
 *
 * @param logLevel Log verbosity level.
 */
+ (void)setLogLevel:(VILogLevel)logLevel;

/**
 * Enable saving of the logs to file. Log files located at: Library/Caches/Logs.
 *
 * This method must be called before creating SDK object instance.
 */
+ (void)saveLogToFileEnable;

/**
 * Direct initialization of this object can produce undesirable consequences.
 */
- (instancetype)init NS_UNAVAILABLE;

/**
 * Initialize client instance.
 *
 * @param queue All delegates methods will be called in this queue. Queue should be serial, but not concurrent (main queue is applicable).
 * @return Client instance.
 */
- (instancetype)initWithDelegateQueue:(dispatch_queue_t)queue;

/**
 * Get instance of messaging subsystem.
 */
@property(nonatomic, strong, readonly) VIMessenger *messenger;

/**
 * Current client state.
 */
@property(nonatomic, readonly) VIClientState clientState;

@end

/**
 * Delegate that may be used to handle events for connection with Voximplant Cloud.
 */
@protocol VIClientSessionDelegate <NSObject>

/**
 * Triggered after connection to Voximplant Cloud was established successfully.
 *
 * @param client Client instance.
 */
- (void)clientSessionDidConnect:(VIClient *)client;

/**
 * Triggered if connection to Voximplant Cloud was closed.
 *
 * @param client Client instance.
 */
- (void)clientSessionDidDisconnect:(VIClient *)client;

/**
 * Triggered if connection to Voximplant Cloud couldn't be established.
 *
 * @param client Client instance.
 * @param error  Error description.
 */
- (void)client:(VIClient *)client sessionDidFailConnectWithError:(NSError *)error;

@end

@interface VIClient (Session)

/**
 * Session delegate that handles events for connection with Voximplant Cloud.
 */
@property(nonatomic, weak) id <VIClientSessionDelegate> sessionDelegate;

/**
 * Connect to Voximplant Cloud.
 *
 * @return YES if the attempt to connect can be performed, NO otherwise. Return value "NO" means that the connection to Voximplant Cloud is currently establishing or already established. In this case please check the current client state via <[VIClient clientState]> property and proceed according to the current state.
 */
- (BOOL)connect;

/**
 * Connect to Voximplant Cloud.
 *
 * @param connectivityCheck Checks whether UDP traffic will flow correctly between device and Voximplant Cloud. This check reduces connection speed.
 * @param gateways          Array of server names of particular media gateways for connection.
 * @return                  YES if the attempt to connect can be performed, NO otherwise.
 *                          Return value NO means that the connection to Voximplant Cloud is currently establishing or already established. In this case please check the current client state via <[VIClient clientState]> property and proceed according to the current state.
 */
- (BOOL)connectWithConnectivityCheck:(BOOL)connectivityCheck gateways:(nullable NSArray *)gateways;

/**
 * Disconnect from Voximplant Cloud.
 */
- (void)disconnect;

@end

/**
 * Completion handler, triggered when login operation is completed successfully.
 *
 * @param displayName Display name of logged in user.
 * @param authParams  Auth parameters that can be used to login using access token.
 */
typedef void (^VILoginSuccess)(NSString *displayName, NSDictionary *authParams);

/**
 * Login error codes.
 */
typedef NS_ENUM(NSInteger, VILoginErrorCode) {
    /** Invalid login or password. */
            VILoginErrorCodeInvalidPassword = 401,
    /** Account frozen. */
            VILoginErrorCodeAccountFrozen = 403,
    /** Invalid username. */
            VILoginErrorCodeInvalidUsername = 404,
    /** Timeout. */
            VILoginErrorCodeTimeout = 408,
    /** Invalid state. */
            VILoginErrorCodeInvalidState = 491,
    /** Internal error. */
            VILoginErrorCodeInternalError = 500,
    /** Network issues. */
            VILoginErrorCodeNetworkIssues = 503,
    /** Token expired. */
            VILoginErrorCodeTokenExpired = 701,
};

/**
 * Completion handler, triggered when login process failed. See <VILoginErrorCode> for possible variants.
 *
 * @param error Error description.
 */
typedef void (^VILoginFailure)(NSError *error);

/**
 * Completion handler, triggered when one time key generated by the login server.
 *
 * @param oneTimeKey One time key.
 */
typedef void (^VIOneTimeKeyResult)(NSString *oneTimeKey);

/**
 * Completion handler, triggered when refresh of login tokens completed.
 *
 * @param error      Error if operation failed, nil otherwise.
 * @param authParams Auth parameters that can be used to login using access token.
 */
typedef void (^VIRefreshTokenResult)(NSError *__nullable error, NSDictionary *__nullable authParams);

@interface VIClient (Login)

/**
 * Login to Voximplant Cloud using password.
 *
 * @param user     Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param password User password.
 * @param success  Completion handler triggered if operation is completed successfully.
 *                 ```objectivec
 *                 typedef void (^VILoginSuccess)(NSString *displayName, NSDictionary *authParams);
 *                 ```
 *                 * displayName: Display name of logged in user.
 *                 * authParams:  Auth parameters that can be used to login using access token.
 * @param failure  Completion handler failure triggered if operation is failed.
 *                 ```objectivec
 *                 typedef void (^VILoginFailure)(NSError *error);
 *                 ```
 *                 * error: Error description.
 */
- (void)loginWithUser:(NSString *)user
             password:(NSString *)password
              success:(nullable VILoginSuccess)success
              failure:(nullable VILoginFailure)failure;

/**
 * Login to Voximplant Cloud using access token.
 *
 * @param user    Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param token   Access token obtained from authParams.
 * @param success Completion handler triggered if operation is completed successfully.
 *                ```objectivec
 *                typedef void (^VILoginSuccess)(NSString *displayName, NSDictionary *authParams);
 *                ```
 *                * displayName: Display name of logged in user.
 *                * authParams:  Auth parameters that can be used to login using access token.
 * @param failure Completion handler failure triggered if operation is failed.
 *                ```objectivec
 *                typedef void (^VILoginFailure)(NSError *error);
 *                ```
 *                * error: Error description.
 */
- (void)loginWithUser:(NSString *)user
                token:(NSString *)token
              success:(nullable VILoginSuccess)success
              failure:(nullable VILoginFailure)failure;

/**
 * Login to Voximplant Cloud using one time key.
 *
 * @param user       Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param oneTimeKey Hash that was generated using following formula:
 *                   ```objectivec
 *                   MD5(oneTimeKey+"|"+MD5(user+":voximplant.com:"+password))
 *                   ```
 *
 * Please note that here user is just a user name, without app name, account name or anything else after "@".
 *
 * So if you pass myuser@myapp.myacc.voximplant.com as a username, you should only use myuser while computing this hash.
 *
 * @param success    Completion handler triggered if operation is completed successfully.
 *                   ```objectivec
 *                   typedef void (^VILoginSuccess)(NSString *displayName, NSDictionary *authParams);
 *                   ```
 *                   * displayName: Display name of logged in user.
 *                   * authParams:  Auth parameters that can be used to login using access token.
 * @param failure    Completion handler failure triggered if operation is failed.
 *                   ```objectivec
 *                   typedef void (^VILoginFailure)(NSError *error);
 *                   ```
 *                   * error: Error description.
 */
- (void)loginWithUser:(NSString *)user
           oneTimeKey:(NSString *)oneTimeKey
              success:(nullable VILoginSuccess)success
              failure:(nullable VILoginFailure)failure;

/**
 * Perform refresh of login tokens required for login using access token.
 *
 * @param user   Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param token  Refresh token obtained from authParams.
 * @param result Completion handler that is triggered when the operation is completed.
 *               ```objectivec
 *               typedef void (^VIRefreshTokenResult)(NSError *error, NSDictionary *authParams);
 *               ```
 *               * error: Error if operation failed, nil otherwise.
 *               * authParams: Auth parameters that can be used to login using access token.
 */
- (void)refreshTokenWithUser:(NSString *)user token:(NSString *)token result:(nullable VIRefreshTokenResult)result;

/**
 * Generates one time login key to be used for automated login process.
 *
 * For additional information please see:
 * * <[VIClient loginWithUser:oneTimeKey:success:failure:]>.
 * * [Information about automated login on Voximplant website](http://voximplant.com/docs/quickstart/24/automated-login/).
 *
 * @param user   Full user name, including app and account name, like someuser@someapp.youraccount.voximplant.com.
 * @param result Completion handler that is triggered when the operation is completed.
 *               ```objectivec
 *               typedef void (^VIOneTimeKeyResult)(NSString *oneTimeKey);
 *               ```
 *               * oneTimeKey: Resulting One Time Key.
 */
- (void)requestOneTimeKeyWithUser:(NSString *)user result:(VIOneTimeKeyResult)result;

@end

/**
 * Delegate that may be used to handle incoming calls.
 */
@protocol VIClientCallManagerDelegate <NSObject>

/**
 * Triggered when there is a new incoming call to current user.
 *
 * @param client  Client instance.
 * @param call    Call instance.
 * @param video   YES if incoming call offers video, NO otherwise.
 * @param headers Optional headers passed with event.
 */
- (void)client:(VIClient *)client didReceiveIncomingCall:(VICall *)call withIncomingVideo:(BOOL)video headers:(nullable NSDictionary *)headers;

@end

@interface VIClient (CallManager)

/**
 * Call manager delegate that handles incoming calls.
 */
@property(nonatomic, weak, nullable) id <VIClientCallManagerDelegate> callManagerDelegate;

/**
 * Dictionary of actual calls with their ids.
 */
@property(nonatomic, strong, readonly) NSDictionary<NSString *, VICall *> *calls;

/**
 * Create new call instance. Call must be then started using <[VICall startWithHeaders:]>.
 *
 * @param user         SIP URI, username or phone number to make call to. Actual routing is then performed by VoxEngine scenario.
 * @param sendVideo    Specify if video send is enabled for a call.
 * @param receiveVideo Specify if video receive is enabled for a call.
 * @param customData   Custom data passed with call. Will be available in VoxEngine scenario.
 * @return             Call instance
 */
- (VICall *)callToUser:(NSString *)user withSendVideo:(BOOL)sendVideo receiveVideo:(BOOL)receiveVideo customData:(nullable NSString *)customData;

@end

@interface VIClient (Push)
/**
 * Register Apple Push Notifications token.
 *
 * After calling this function application will receive push notifications from Voximplant Server.
 *
 * @param voipToken The APNS token for VoIP push notifications which comes from [[PKPushRegistryDelegate pushRegistry:didUpdatePushCredentials:forType:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/1614470-pushregistry?language=objc).
 * @param imToken The APNS token for IM push notifications.
 */
- (void)registerPushNotificationsToken:(nullable NSData *)voipToken imToken:(nullable NSData *)imToken;

/**
 * Unregister Apple Push Notifications token.
 *
 * After calling this function application stops receive push notifications from Voximplant Server.
 *
 * @param voipToken The APNS token for VoIP push notifications which comes from [[PKPushRegistryDelegate pushRegistry:didUpdatePushCredentials:forType:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/1614470-pushregistry?language=objc).
 * @param imToken The APNS token for IM push notification.
 */
- (void)unregisterPushNotificationsToken:(nullable NSData *)voipToken imToken:(nullable NSData *)imToken;

/**
 * Handle incoming push notification.
 *
 * @param notification The incoming notification which comes from [[PKPushRegistryDelegate pushRegistry:didReceiveIncomingPushWithPayload:forType:withCompletionHandler:]](https://developer.apple.com/documentation/pushkit/pkpushregistrydelegate/2875784-pushregistry?language=objc).
 */
- (void)handlePushNotification:(NSDictionary *)notification;

@end

NS_ASSUME_NONNULL_END
