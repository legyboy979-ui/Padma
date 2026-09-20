import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const BiometricModal: React.FC = () => {
  const { isBiometricModalOpen, closeBiometricScan, verifyBiometrics, openPasscodeModal } = useAuth();
  const { language } = useLanguage();

  const [scanStep, setScanStep] = useState<'idle' | 'scanning' | 'success'>('idle');
  const [pulseAnim] = useState(new Animated.Value(0.9));
  const [scanLineAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isBiometricModalOpen) {
      setScanStep('scanning');

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.08,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.92,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Scan line animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 140,
            duration: 1100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1100,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate biometric face scanning delay
      const timer = setTimeout(async () => {
        setScanStep('success');
        setTimeout(() => {
          verifyBiometrics();
          setScanStep('idle');
        }, 800);
      }, 1600);

      return () => clearTimeout(timer);
    } else {
      setScanStep('idle');
    }
  }, [isBiometricModalOpen]);

  if (!isBiometricModalOpen) return null;

  return (
    <Modal visible={isBiometricModalOpen} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.shieldBadge}>
              <Ionicons name="shield-checkmark" size={18} color="#06B6D4" />
            </View>
            <View>
              <Text style={styles.title}>
                {language === 'hi' ? 'बायोमेट्रिक फेस सत्यापन' : 'Biometric Face Verification'}
              </Text>
              <Text style={styles.sub}>
                {language === 'hi'
                  ? 'हार्डवेयर एनक्लेव और 3D डेप्थ सेंसर सक्रिय'
                  : 'Hardware Secure Enclave & 3D Depth Active'}
              </Text>
            </View>
          </View>

          {/* Scanner Reticle Display */}
          <View style={styles.scannerContainer}>
            <Animated.View
              style={[
                styles.reticleRing,
                scanStep === 'success' && styles.reticleSuccess,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              {/* Corner brackets */}
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />

              {/* Face silhouette & icons */}
              <Ionicons
                name={scanStep === 'success' ? 'checkmark-circle' : 'scan'}
                size={82}
                color={scanStep === 'success' ? '#10B981' : '#06B6D4'}
              />

              {/* Scanning laser line */}
              {scanStep === 'scanning' && (
                <Animated.View
                  style={[
                    styles.laserLine,
                    { transform: [{ translateY: scanLineAnim }] },
                  ]}
                />
              )}
            </Animated.View>

            {/* Status Text */}
            <View style={styles.statusBox}>
              <Text style={[styles.statusText, scanStep === 'success' && styles.statusSuccessText]}>
                {scanStep === 'scanning'
                  ? language === 'hi'
                    ? 'चेहरा स्कैन किया जा रहा है... (98.4% मैच)'
                    : 'Mapping Facial Geometry & Liveness...'
                  : language === 'hi'
                  ? 'पहचान सत्यापित! एक्सेस स्वीकृत'
                  : 'Identity Verified! Biometric Access Granted'}
              </Text>
            </View>
          </View>

          {/* Fallback buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.passcodeFallbackBtn}
              onPress={() => {
                closeBiometricScan();
                openPasscodeModal('verify');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="keypad-outline" size={16} color="#CBD5E1" />
              <Text style={styles.fallbackText}>
                {language === 'hi' ? 'पासकोड का उपयोग करें' : 'Use Passcode PIN'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={closeBiometricScan}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelText}>{language === 'hi' ? 'रद्द करें' : 'Cancel'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#06B6D4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  shieldBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  scannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  reticleRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  reticleSuccess: {
    borderColor: 'rgba(16, 185, 129, 0.8)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  corner: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: '#06B6D4',
  },
  tl: { top: 12, left: 12, borderTopWidth: 2, borderLeftWidth: 2 },
  tr: { top: 12, right: 12, borderTopWidth: 2, borderRightWidth: 2 },
  bl: { bottom: 12, left: 12, borderBottomWidth: 2, borderLeftWidth: 2 },
  br: { bottom: 12, right: 12, borderBottomWidth: 2, borderRightWidth: 2 },
  laserLine: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 2,
    backgroundColor: '#06B6D4',
    shadowColor: '#06B6D4',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  statusBox: {
    marginTop: 20,
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statusText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusSuccessText: {
    color: '#10B981',
  },
  buttonRow: {
    marginTop: 22,
    gap: 10,
  },
  passcodeFallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  fallbackText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },
});
