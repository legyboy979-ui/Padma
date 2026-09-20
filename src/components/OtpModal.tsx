import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const OtpModal: React.FC = () => {
  const { isOtpModalOpen, closeOtpVerification, verifyOtp, user } = useAuth();
  const { language } = useLanguage();

  const [otpCode, setOtpCode] = useState('');
  const [timer, setTimer] = useState(58);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpModalOpen) {
      setOtpCode('');
      setErrorMessage('');
      setTimer(58);
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpModalOpen]);

  if (!isOtpModalOpen) return null;

  const handleVerify = () => {
    if (otpCode.length !== 6) {
      setErrorMessage(
        language === 'hi' ? 'कृपया 6-अंकीय OTP कोड दर्ज करें' : 'Please enter the 6-digit OTP'
      );
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const success = verifyOtp(otpCode);
      if (!success) {
        setErrorMessage(
          language === 'hi'
            ? 'अमान्य OTP कोड! पुनः प्रयास करें'
            : 'Invalid OTP Code. Please re-check or auto-fill.'
        );
      }
    }, 800);
  };

  const handleQuickFill = () => {
    setOtpCode('542910');
    setErrorMessage('');
  };

  return (
    <Modal visible={isOtpModalOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Close */}
          <TouchableOpacity style={styles.closeIcon} onPress={closeOtpVerification}>
            <Ionicons name="close" size={20} color="#94A3B8" />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.shieldIcon}>
            <Ionicons name="mail-unread" size={26} color="#8B5CF6" />
          </View>
          <Text style={styles.title}>
            {language === 'hi' ? 'द्वि-चरणीय OTP सत्यापन' : 'Two-Factor OTP Verification'}
          </Text>
          <Text style={styles.sub}>
            {language === 'hi'
              ? `6-अंकीय कोड आपके पंजीकृत मोबाइल/ईमेल पर भेजा गया है:`
              : `A secure 6-digit verification code was sent to:`}
          </Text>
          <Text style={styles.phoneBadge}>{user.phone || '+91 98765 43210'}</Text>

          {/* OTP Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.otpInput}
              value={otpCode}
              onChangeText={(txt) => {
                setOtpCode(txt.replace(/[^0-9]/g, '').slice(0, 6));
                setErrorMessage('');
              }}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="••••••"
              placeholderTextColor="#475569"
              autoFocus
            />
          </View>

          {/* Error Message */}
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {/* Demo fill button */}
          <TouchableOpacity style={styles.autoFillBtn} onPress={handleQuickFill} activeOpacity={0.7}>
            <Ionicons name="sparkles-outline" size={14} color="#8B5CF6" />
            <Text style={styles.autoFillText}>
              {language === 'hi' ? 'डेमो कोड ऑटो-फिल करें (542910)' : 'Auto-Fill Demo Code (542910)'}
            </Text>
          </TouchableOpacity>

          {/* Timer & Resend */}
          <View style={styles.timerRow}>
            <Text style={styles.timerText}>
              {timer > 0
                ? `${language === 'hi' ? 'कोड पुनः भेजें' : 'Resend code in'} 00:${timer < 10 ? '0' : ''}${timer}`
                : language === 'hi'
                ? 'कोड नहीं मिला?'
                : "Didn't receive code?"}
            </Text>
            {timer === 0 && (
              <TouchableOpacity onPress={() => setTimer(60)}>
                <Text style={styles.resendBtn}>{language === 'hi' ? 'पुनः भेजें' : 'Resend'}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Verify Action */}
          <TouchableOpacity
            style={[styles.verifyButton, otpCode.length !== 6 && styles.buttonDisabled]}
            onPress={handleVerify}
            disabled={isVerifying || otpCode.length !== 6}
            activeOpacity={0.8}
          >
            {isVerifying ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.verifyButtonText}>
                  {language === 'hi' ? 'सत्यापित करें और आगे बढ़ें' : 'Verify & Continue'}
                </Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
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
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    position: 'relative',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6,
  },
  shieldIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  sub: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
  },
  phoneBadge: {
    fontSize: 13,
    fontWeight: '700',
    color: '#38BDF8',
    marginTop: 4,
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  otpInput: {
    width: 220,
    height: 54,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 10,
    textAlign: 'center',
    color: '#F8FAFC',
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginBottom: 8,
  },
  autoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 14,
  },
  autoFillText: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '600',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  timerText: {
    color: '#64748B',
    fontSize: 12,
  },
  resendBtn: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
