/**
 * Feature Flags Configuration
 * 
 * This file contains feature flags that can be used to enable or disable
 * specific features in the application. This is useful for:
 * 
 * - Hiding features that are still in development
 * - A/B testing different features
 * - Gradually rolling out features to users
 * - Quickly disabling problematic features without code changes
 */

interface FeatureFlags {
    visualSearch: boolean;  // Enable/disable visual search and image recognition
    barcodeScan: boolean;   // Enable/disable barcode scanning
    voiceEntry: boolean;    // Enable/disable voice entry
    predictiveUsage: boolean; // Enable/disable predictive usage suggestions
}

const featureFlags: FeatureFlags = {
    visualSearch: false,  // Set to false to hide visual search features
    barcodeScan: false,   // Set to false to hide barcode scanning
    voiceEntry: true,    // Set to false to hide voice entry
    predictiveUsage: false, // Set to false to hide predictive usage suggestions
};

/**
 * Check if a feature is enabled
 * @param feature The feature flag to check
 * @returns boolean indicating if the feature is enabled
 */
export const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
    return featureFlags[feature] || false;
};

/**
 * Enable a feature
 * @param feature The feature flag to enable
 */
export const enableFeature = (feature: keyof FeatureFlags): void => {
    featureFlags[feature] = true;
};

/**
 * Disable a feature
 * @param feature The feature flag to disable
 */
export const disableFeature = (feature: keyof FeatureFlags): void => {
    featureFlags[feature] = false;
};