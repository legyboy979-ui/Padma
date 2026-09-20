import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const { processWithdrawal } = useApp();
  const { language } = useLanguage();

  const [method, setMethod] = useState<'UPI' | 'IMPS'>('UPI');
  const [upiId, setUpiId] = useState('creator@okhdfcbank');
  const [bankAccount, setBankAccount] = useState('918273645019');
  const [bankIfsc, setBankIfsc] = useState('HDFC0001842');
  const [amountStr, setAmountStr] = useState('10000');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTxId, setSuccessTxId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!visible) return null;

  const numericAmount = parseFloat(amountStr) || 0;
  const tdsDeduction = Math.round(numericAmount * 0.01); // 1% TDS
  const netPayable = Math.max(0, numericAmount - tdsDeduction);

  const handleQuickAmount = (val: number) => {
    setAmountStr(val.toString());
    setErrorMessage('');
  };

  const handleWithdraw = async () => {
    if (numericAmount < 500) {
      setErrorMessage(
        language === 'hi'
          ? 'न्यूनतम निकासी राशि ₹500 है'
          : 'Minimum withdrawal amount is ₹500'
      );
      return;
    }
    if (numericAmount > user.walletBalanceINR) {
      setErrorMessage(
        language === 'hi'
          ? 'निकासी राशि उपलब्ध शेष राशि से अधिक है'
          : 'Insufficient wallet balance'
      );
      return;
    }

    const destination = method === 'UPI' ? upiId : `${bankAccount} (${bankIfsc})`;
    setIsProcessing(true);

    try {
      const ok = await processWithdrawal(numericAmount, method, destination);
      if (ok) {
        const generatedTx = `${method}_OMS_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
        setSuccessTxId(generatedTx);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSuccessTxId(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="wallet-outline" size={20} color="#10B981" />
              </View>
              <View>
                <Text style={styles.title}>
                  {language === 'hi' ? 'कमाई की तत्काल निकासी' : 'Instant Earnings Payout'}
                </Text>
                <Text style={styles.sub}>
                  {language === 'hi'
                    ? '24x7 तत्काल UPI VPA एवं IMPS बैंक ट्रांसफर'
                    : '24x7 Instant UPI VPA & IMPS Bank Settlements'}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {successTxId ? (
              <View style={styles.successContainer}>
                <View style={styles.successIconCircle}>
                  <Ionicons name="checkmark-done" size={38} color="#10B981" />
                </View>
                <Text style={styles.successTitle}>
                  {language === 'hi' ? 'निकासी ट्रांसफर सफल!' : 'Withdrawal Dispatched!'}
                </Text>
                <Text style={styles.successAmount}>₹{numericAmount.toLocaleString('en-IN')}</Text>
                <Text style={styles.successSub}>
                  {language === 'hi'
                    ? `राशि आपके ${method === 'UPI' ? 'UPI खाते' : 'बैंक खाते'} में 60 सेकंड के भीतर क्रेडिट हो जाएगी।`
                    : `Dispatched to ${method === 'UPI' ? upiId : bankAccount}. Settlement credited via NPCI IMPS rails.`}
                </Text>
                <View style={styles.txHashBox}>
                  <Text style={styles.txHashLabel}>UTR Reference Hash:</Text>
                  <Text style={styles.txHashValue}>{successTxId}</Text>
                </View>
                <TouchableOpacity style={styles.doneBtn} onPress={handleClose} activeOpacity={0.8}>
                  <Text style={styles.doneBtnText}>{language === 'hi' ? 'संपन्न' : 'Done'}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Available Balance Box */}
                <View style={styles.balanceCard}>
                  <View>
                    <Text style={styles.balanceLabel}>
                      {language === 'hi' ? 'उपलब्ध निकासी योग्य शेष' : 'Available for Withdrawal'}
                    </Text>
                    <Text style={styles.balanceValue}>
                      ₹{user.walletBalanceINR.toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="shield-checkmark" size={14} color="#10B981" />
                    <Text style={styles.verifiedText}>KYC Verified</Text>
                  </View>
                </View>

                {/* Method Selector */}
                <Text style={styles.sectionLabel}>
                  {language === 'hi' ? 'निकासी विधि चुनें' : 'Choose Payout Method'}
                </Text>
                <View style={styles.methodToggleRow}>
                  <TouchableOpacity
                    style={[styles.methodBtn, method === 'UPI' && styles.methodBtnActive]}
                    onPress={() => setMethod('UPI')}
                  >
                    <Ionicons
                      name="flash"
                      size={16}
                      color={method === 'UPI' ? '#10B981' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.methodBtnText,
                        method === 'UPI' && styles.methodBtnTextActive,
                      ]}
                    >
                      Instant UPI (Zero Fee)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.methodBtn, method === 'IMPS' && styles.methodBtnActive]}
                    onPress={() => setMethod('IMPS')}
                  >
                    <Ionicons
                      name="business"
                      size={16}
                      color={method === 'IMPS' ? '#10B981' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.methodBtnText,
                        method === 'IMPS' && styles.methodBtnTextActive,
                      ]}
                    >
                      Bank IMPS/NEFT
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Destination Input */}
                {method === 'UPI' ? (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>
                      {language === 'hi' ? 'UPI ID (VPA)' : 'Enter UPI VPA (ID)'}
                    </Text>
                    <View style={styles.inputWrap}>
                      <Ionicons name="at" size={18} color="#64748B" />
                      <TextInput
                        style={styles.textInput}
                        value={upiId}
                        onChangeText={setUpiId}
                        placeholder="username@okhdfcbank"
                        placeholderTextColor="#475569"
                        autoCapitalize="none"
                      />
                    </View>
                  </View>
                ) : (
                  <>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        {language === 'hi' ? 'बैंक खाता संख्या' : 'Bank Account Number'}
                      </Text>
                      <View style={styles.inputWrap}>
                        <Ionicons name="card-outline" size={18} color="#64748B" />
                        <TextInput
                          style={styles.textInput}
                          value={bankAccount}
                          onChangeText={setBankAccount}
                          keyboardType="number-pad"
                        />
                      </View>
                    </View>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>IFSC Code</Text>
                      <View style={styles.inputWrap}>
                        <Ionicons name="barcode-outline" size={18} color="#64748B" />
                        <TextInput
                          style={styles.textInput}
                          value={bankIfsc}
                          onChangeText={setBankIfsc}
                          autoCapitalize="characters"
                        />
                      </View>
                    </View>
                  </>
                )}

                {/* Amount Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>
                    {language === 'hi' ? 'निकासी राशि (INR ₹)' : 'Withdrawal Amount (INR ₹)'}
                  </Text>
                  <View style={styles.inputWrap}>
                    <Text style={styles.currencyPrefix}>₹</Text>
                    <TextInput
                      style={styles.textInput}
                      value={amountStr}
                      onChangeText={(val) => {
                        setAmountStr(val.replace(/[^0-9]/g, ''));
                        setErrorMessage('');
                      }}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>

                {/* Quick Presets */}
                <View style={styles.presetsRow}>
                  {[2000, 5000, 10000, user.walletBalanceINR].map((pVal) => (
                    <TouchableOpacity
                      key={pVal}
                      style={styles.presetPill}
                      onPress={() => handleQuickAmount(pVal)}
                    >
                      <Text style={styles.presetText}>
                        {pVal === user.walletBalanceINR
                          ? language === 'hi'
                            ? 'पूर्ण राशि'
                            : 'Max'
                          : `₹${pVal.toLocaleString('en-IN')}`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Tax & Deduction Breakdown */}
                <View style={styles.taxBox}>
                  <View style={styles.taxRow}>
                    <Text style={styles.taxLabel}>Requested Gross Amount:</Text>
                    <Text style={styles.taxVal}>₹{numericAmount.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.taxRow}>
                    <Text style={styles.taxLabel}>1% TDS (IT Sec 194C):</Text>
                    <Text style={styles.taxValDeduct}>-₹{tdsDeduction.toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={[styles.taxRow, styles.netRow]}>
                    <Text style={styles.netLabel}>Net Dispatched to Account:</Text>
                    <Text style={styles.netVal}>₹{netPayable.toLocaleString('en-IN')}</Text>
                  </View>
                </View>

                {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

                {/* Confirm Button */}
                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    (numericAmount <= 0 || numericAmount > user.walletBalanceINR) &&
                      styles.btnDisabled,
                  ]}
                  onPress={handleWithdraw}
                  disabled={isProcessing || numericAmount <= 0}
                  activeOpacity={0.8}
                >
                  {isProcessing ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <>
                      <Text style={styles.confirmBtnText}>
                        {language === 'hi'
                          ? `₹${netPayable.toLocaleString('en-IN')} ट्रांसफर करें`
                          : `Confirm & Transfer ₹${netPayable.toLocaleString('en-IN')}`}
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </>
                  )}
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 7, 12, 0.88)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#1E293B',
    maxHeight: '92%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  sub: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  balanceLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  balanceValue: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: '800',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionLabel: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  methodToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  methodBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10B981',
  },
  methodBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  methodBtnTextActive: {
    color: '#10B981',
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    paddingHorizontal: 12,
  },
  currencyPrefix: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    paddingVertical: 10,
    paddingLeft: 6,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  presetPill: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  presetText: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '600',
  },
  taxBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  taxLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  taxVal: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  taxValDeduct: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '600',
  },
  netRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  netLabel: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
  netVal: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '800',
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#10B981',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 14,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successTitle: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  successAmount: {
    color: '#10B981',
    fontSize: 26,
    fontWeight: '800',
    marginVertical: 4,
  },
  successSub: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 18,
    marginBottom: 16,
  },
  txHashBox: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    marginBottom: 20,
  },
  txHashLabel: {
    color: '#64748B',
    fontSize: 11,
  },
  txHashValue: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  doneBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
});
