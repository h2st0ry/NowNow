#import <HealthKit/HealthKit.h>
#import <React/RCTBridgeModule.h>

#import <cmath>
#import <memory>

#import "../build/generated/ios/ReactCodegen/NativeHealthKitBridgeSpec/NativeHealthKitBridgeSpec.h"

@interface RCTNativeHealthKitBridge : NSObject <NativeHealthKitBridgeSpec>
@end

@implementation RCTNativeHealthKitBridge

RCT_EXPORT_MODULE(NativeHealthKitBridge)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeHealthKitBridgeSpecJSI>(params);
}

- (HKHealthStore *)healthStore
{
  static HKHealthStore *store = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    store = [[HKHealthStore alloc] init];
  });
  return store;
}

- (NSArray<HKObjectType *> *)readTypes
{
  NSMutableArray<HKObjectType *> *types = [NSMutableArray array];

  HKQuantityType *heartRate = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierHeartRate];
  HKQuantityType *restingHeartRate = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierRestingHeartRate];
  HKQuantityType *oxygenSaturation = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierOxygenSaturation];
  HKCategoryType *sleepAnalysis = [HKObjectType categoryTypeForIdentifier:HKCategoryTypeIdentifierSleepAnalysis];

  if (heartRate) {
    [types addObject:heartRate];
  }
  if (restingHeartRate) {
    [types addObject:restingHeartRate];
  }
  if (oxygenSaturation) {
    [types addObject:oxygenSaturation];
  }
  if (sleepAnalysis) {
    [types addObject:sleepAnalysis];
  }

  return types;
}

- (NSString *)authorizationStateForTypes
{
  BOOL hasDenied = NO;
  BOOL hasNotDetermined = NO;
  BOOL hasAuthorized = NO;

  for (HKObjectType *type in [self readTypes]) {
    HKAuthorizationStatus status = [[self healthStore] authorizationStatusForType:type];

    switch (status) {
      case HKAuthorizationStatusSharingAuthorized:
        hasAuthorized = YES;
        break;
      case HKAuthorizationStatusSharingDenied:
        hasDenied = YES;
        break;
      case HKAuthorizationStatusNotDetermined:
      default:
        hasNotDetermined = YES;
        break;
    }
  }

  if (hasDenied) {
    return @"denied";
  }

  if (hasAuthorized && !hasNotDetermined) {
    return @"authorized";
  }

  return @"notDetermined";
}

- (NSString *)isoStringFromDate:(NSDate *)date
{
  static NSISO8601DateFormatter *formatter = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    formatter = [[NSISO8601DateFormatter alloc] init];
    formatter.formatOptions = NSISO8601DateFormatWithInternetDateTime;
  });

  return [formatter stringFromDate:date];
}

- (void)fetchLatestQuantityForType:(HKQuantityType *)type
                              unit:(HKUnit *)unit
                            result:(void (^)(NSDictionary *payload))result
{
  NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierEndDate ascending:NO];
  HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType:type
                                                         predicate:nil
                                                             limit:1
                                                   sortDescriptors:@[sortDescriptor]
                                                    resultsHandler:^(HKSampleQuery * _Nonnull query, NSArray<HKSample *> * _Nullable samples, NSError * _Nullable error) {
    if (error || samples.count == 0) {
      result(@{ @"value": [NSNull null], @"recordedAt": [NSNull null] });
      return;
    }

    HKQuantitySample *sample = (HKQuantitySample *)samples.firstObject;
    double value = [sample.quantity doubleValueForUnit:unit];
    result(@{
      @"value": @(value),
      @"recordedAt": [self isoStringFromDate:sample.endDate],
    });
  }];

  [[self healthStore] executeQuery:query];
}

- (void)fetchLatestSleepSummaryWithResult:(void (^)(NSDictionary *payload))result
{
  HKCategoryType *sleepType = [HKObjectType categoryTypeForIdentifier:HKCategoryTypeIdentifierSleepAnalysis];
  if (!sleepType) {
    result(@{
      @"sleepMinutes": @(0),
      @"inBedMinutes": @(0),
      @"sampleCount": @(0),
      @"recordedAt": [NSNull null],
    });
    return;
  }

  NSDate *now = [NSDate date];
  NSCalendar *calendar = [NSCalendar currentCalendar];
  NSDate *startOfToday = [calendar startOfDayForDate:now];
  NSDateComponents *offset = [[NSDateComponents alloc] init];
  offset.day = -1;
  NSDate *startDate = [calendar dateByAddingComponents:offset toDate:startOfToday options:0] ?: startOfToday;

  NSPredicate *predicate = [HKQuery predicateForSamplesWithStartDate:startDate endDate:now options:HKQueryOptionStrictStartDate];
  NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:HKSampleSortIdentifierStartDate ascending:NO];

  HKSampleQuery *query = [[HKSampleQuery alloc] initWithSampleType:sleepType
                                                         predicate:predicate
                                                             limit:200
                                                   sortDescriptors:@[sortDescriptor]
                                                    resultsHandler:^(HKSampleQuery * _Nonnull query, NSArray<HKSample *> * _Nullable samples, NSError * _Nullable error) {
    if (error || samples.count == 0) {
      result(@{
        @"sleepMinutes": @(0),
        @"inBedMinutes": @(0),
        @"sampleCount": @(0),
        @"recordedAt": [NSNull null],
      });
      return;
    }

    double sleepSeconds = 0;
    double inBedSeconds = 0;
    NSDate *latestDate = nil;

    for (HKCategorySample *sample in samples) {
      NSTimeInterval duration = [sample.endDate timeIntervalSinceDate:sample.startDate];

      if (sample.value == HKCategoryValueSleepAnalysisInBed) {
        inBedSeconds += duration;
      } else if (
        sample.value == HKCategoryValueSleepAnalysisAsleepUnspecified ||
        sample.value == HKCategoryValueSleepAnalysisAsleepCore ||
        sample.value == HKCategoryValueSleepAnalysisAsleepDeep ||
        sample.value == HKCategoryValueSleepAnalysisAsleepREM
      ) {
        sleepSeconds += duration;
      }

      if (!latestDate || [sample.endDate compare:latestDate] == NSOrderedDescending) {
        latestDate = sample.endDate;
      }
    }

    result(@{
      @"sleepMinutes": @((NSInteger)llround(sleepSeconds / 60.0)),
      @"inBedMinutes": @((NSInteger)llround(inBedSeconds / 60.0)),
      @"sampleCount": @(samples.count),
      @"recordedAt": latestDate ? [self isoStringFromDate:latestDate] : [NSNull null],
    });
  }];

  [[self healthStore] executeQuery:query];
}

- (void)checkAvailability:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject
{
  BOOL available = [HKHealthStore isHealthDataAvailable];
  resolve(@{
    @"available": @(available),
    @"reason": available ? [NSNull null] : @"HealthKit is unavailable on this device."
  });
}

- (void)getAuthorizationState:(RCTPromiseResolveBlock)resolve
                       reject:(RCTPromiseRejectBlock)reject
{
  if (![HKHealthStore isHealthDataAvailable]) {
    resolve(@{
      @"state": @"unavailable",
    });
    return;
  }

  resolve(@{
    @"state": [self authorizationStateForTypes],
  });
}

- (void)requestAuthorization:(RCTPromiseResolveBlock)resolve
                      reject:(RCTPromiseRejectBlock)reject
{
  if (![HKHealthStore isHealthDataAvailable]) {
    reject(@"healthkit_unavailable", @"HealthKit is unavailable on this device.", nil);
    return;
  }

  NSSet<HKObjectType *> *readTypes = [NSSet setWithArray:[self readTypes]];
  [[self healthStore] requestAuthorizationToShareTypes:nil
                                             readTypes:readTypes
                                            completion:^(BOOL success, NSError * _Nullable error) {
    if (error) {
      reject(@"healthkit_auth_failed", error.localizedDescription, error);
      return;
    }

    resolve(@{ @"authorized": @(success) });
  }];
}

- (void)fetchLatestSnapshot:(RCTPromiseResolveBlock)resolve
                     reject:(RCTPromiseRejectBlock)reject
{
  if (![HKHealthStore isHealthDataAvailable]) {
    reject(@"healthkit_unavailable", @"HealthKit is unavailable on this device.", nil);
    return;
  }

  HKQuantityType *heartRateType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierHeartRate];
  HKQuantityType *restingHeartRateType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierRestingHeartRate];
  HKQuantityType *oxygenSaturationType = [HKObjectType quantityTypeForIdentifier:HKQuantityTypeIdentifierOxygenSaturation];

  dispatch_group_t group = dispatch_group_create();
  __block NSDictionary *heartRate = @{ @"value": [NSNull null], @"recordedAt": [NSNull null] };
  __block NSDictionary *restingHeartRate = @{ @"value": [NSNull null], @"recordedAt": [NSNull null] };
  __block NSDictionary *oxygenSaturation = @{ @"value": [NSNull null], @"recordedAt": [NSNull null] };
  __block NSDictionary *sleep = @{
    @"sleepMinutes": @(0),
    @"inBedMinutes": @(0),
    @"sampleCount": @(0),
    @"recordedAt": [NSNull null],
  };

  if (heartRateType) {
    dispatch_group_enter(group);
    [self fetchLatestQuantityForType:heartRateType
                                unit:[HKUnit unitFromString:@"count/min"]
                              result:^(NSDictionary *payload) {
      heartRate = payload;
      dispatch_group_leave(group);
    }];
  }

  if (restingHeartRateType) {
    dispatch_group_enter(group);
    [self fetchLatestQuantityForType:restingHeartRateType
                                unit:[HKUnit unitFromString:@"count/min"]
                              result:^(NSDictionary *payload) {
      restingHeartRate = payload;
      dispatch_group_leave(group);
    }];
  }

  if (oxygenSaturationType) {
    dispatch_group_enter(group);
    [self fetchLatestQuantityForType:oxygenSaturationType
                                unit:[HKUnit percentUnit]
                              result:^(NSDictionary *payload) {
      oxygenSaturation = payload;
      dispatch_group_leave(group);
    }];
  }

  dispatch_group_enter(group);
  [self fetchLatestSleepSummaryWithResult:^(NSDictionary *payload) {
    sleep = payload;
    dispatch_group_leave(group);
  }];

  dispatch_group_notify(group, dispatch_get_main_queue(), ^{
    resolve(@{
      @"fetchedAt": [self isoStringFromDate:[NSDate date]],
      @"heartRate": heartRate,
      @"restingHeartRate": restingHeartRate,
      @"oxygenSaturation": oxygenSaturation,
      @"sleep": sleep,
    });
  });
}

@end
