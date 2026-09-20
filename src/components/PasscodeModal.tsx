import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const PasscodeModal: React.FC = () => {
  const {
    isPasscodeModalOpen,
    closePasscodeModal,
    verifyPasscode,
    setNewPasscode,
    openBiometricScan,
  } = useAuth();
  const { language } = useLanguage();

  const [enteredCode, setEnteredCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSettingMode, setIsSettingMode] = useState(false);

  useEffect(() => {
    if (isPasscodeModalOpen) {
      setEnteredCode('');
      setErrorMessage('');
    }
  }, [isPasscodeModalOpen]);

  if (!isPasscodeModalOpen) return null;

  const handleKeyPress = (digit: string) => {
    if (enteredCode.length < 6) {
      const next = enteredCode + digit;
      setEnteredCode(next);
      setErrorMessage('');

      if (next.length === 6) {
        setTimeout(() => {
          if (isSettingMode) {
            setNewPasscode(next);
          } else {
            const ok = verifyPasscode(next);
            if (!ok) {
              setErrorMessage(
                language === 'hi'
                  ? 'गलत पासकोड! पुनः प्रयास करें (डिफ़ॉल्ट 123456)'
                  : 'Incorrect Passcode! Try 123456'
              );
              setEnteredCode('');
            }
          }
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    if (enteredCode.length > 0) {
      setEnteredCode(enteredCode.slice(0, -1));
    }
  };

  return (
    <Modal visible={isPasscodeModalOpen} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.lockBadge}>
              <Ionicons name="keypad" size={20} color="#8B5CF6" />
            </View>
            <Text style={styles.title}>
              {isSettingMode
                ? language === 'hi'
                  ? 'नया 6-अंकीय पासकोड सेट करें'
                  : 'Set New 6-Digit Passcode'
                : language === 'hi'
                ? 'सुरक्षा पासकोड दर्ज करें'
                : 'Enter Security Passcode'}
            </Text>
            <Text style={styles.sub}>
              {isSettingMode
                ? language === 'hi'
                  ? 'अनाधिकृत पब्लिशिंग और निकासी रोकने हेतु'
                  : 'Protects automated publishing & wallet access'
                : language === 'hi'
                ? 'सिस्टम अनलॉक करने के लिए अपना पिन डालें'
                : 'Enter your 6-digit PIN to authenticate'}
            </Text>
          </View>

          {/* Dots Indicator */}
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const filled = index < enteredCode.length;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    filled && styles.dotFilled,
                    errorMessage ? styles.dotError : null,
                  ]}
                />
              );
            })}
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : (
            <Text style={styles.hintText}>
              {language === 'hi' ? 'डिफ़ॉल्ट परीक्षण पिन: 123456' : 'Default test PIN: 123456'}
            </Text>
          )}

          {/* Numeric Keypad */}
          <View style={styles.keypad}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['face', '0', 'back'],
            ].map((row, rowIdx) => (
              <View key={rowIdx} style={styles.keyRow}>
                {row.map((item) => {
                  if (item === 'face') {
                    return (
                      <TouchableOpacity
                        key={item}
                        style={styles.actionKey}
                        onPress={() => {
                          closePasscodeModal();
                          openBiometricScan();
                        }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="scan-outline" size={24} color="#06B6D4" />
                      </TouchableOpacity>
                    );
                  }
                  if (item === 'back') {
                    return (
                      <TouchableOpacity
                        key={item}
                        style={styles.actionKey}
                        onPress={handleBackspace}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="backspace-outline" size={22} color="#94A3B8" />
                      </TouchableOpacity>
                    );
                  }
                  return (
                    <TouchableOpacity
                      key={item}
                      style={styles.numKey}
                      onPress={() => handleKeyPress(item)}
                      activeOpacity={0.6}
                    >
                      <Text style={styles.numKeyText}>{item}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Bottom Actions */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              onPress={() => setIsSettingMode(!isSettingMode)}
              style={styles.modeToggle}
            >
              <Text style={styles.modeToggleText}>
                {isSettingMode
                  ? language === 'hi'
                    ? 'वापस जाएं (Verify PIN)'
                    : 'Switch to Verify Mode'
                  : language === 'hi'
                  ? 'पिन बदलें / नया सेट करें'
                  : 'Change / Set New Passcode'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closePasscodeModal} style={styles.closeBtn}>
              <Text style={styles.closeText}>{language === 'hi' ? 'बंद करें' : 'Cancel'}</Text>
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
    backgroundColor: 'rgba(5, 7, 12, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0F172A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  lockBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  sub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 14,
    marginVertical: 18,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#1E293B',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  dotFilled: {
    backgroundColor: '#8B5CF6',
    borderColor: '#A78BFA',
    shadowColor: '#8B5CF6',
    shadowRadius: 6,
    shadowOpacity: 0.8,
  },
  dotError: {
    backgroundColor: '#EF4444',
    borderColor: '#F87171',
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  hintText: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 12,
  },
  keypad: {
    width: '100%',
    paddingHorizontal: 10,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  numKey: {
    width: 68,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  numKeyText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  actionKey: {
    width: 68,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRow: {
    marginTop: 14,
    alignItems: 'center',
    gap: 8,
  },
  modeToggle: {
    paddingVertical: 6,
  },
  modeToggleText: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '600',
  },
  closeBtn: {
    paddingVertical: 4,
  },
  closeText: {
    color: '#64748B',
    fontSize: 12,
  },
});
