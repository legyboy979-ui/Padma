import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const { upgradePlan } = useApp();
  const { language } = useLanguage();

  const [selectedPlan, setSelectedPlan] = useState<'monthly_500' | 'quarterly_1350'>('quarterly_1350');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  if (!visible) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradePlan(selectedPlan);
      setIsProcessing(false);
      setSuccessNotice(true);
      setTimeout(() => {
        setSuccessNotice(false);
        onClose();
      }, 1400);
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.titleRow}>
                <Ionicons name="sparkles" size={20} color="#8B5CF6" />
                <Text style={styles.title}>
                  {language === 'hi' ? 'ओमनीस्ट्रीम प्रो अपग्रेड' : 'OmniStream Pro Plans'}
                </Text>
              </View>
              <Text style={styles.sub}>
                {language === 'hi'
                  ? '7-दिन का निःशुल्क ट्रायल शामिल • किसी भी समय रद्द करें'
                  : 'Includes 7-Day Free Trial • Cancel Anytime'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Free Trial Banner */}
            <View style={styles.trialInfoBox}>
              <Ionicons name="shield-checkmark" size={20} color="#10B981" />
              <View style={{ flex: 1 }}>
                <Text style={styles.trialInfoTitle}>
                  {language === 'hi' ? '7-दिवसीय निःशुल्क ट्रायल सक्रिय' : '7-Day Free Trial Active'}
                </Text>
                <Text style={styles.trialInfoDesc}>
                  {user.trialDaysRemaining}{' '}
                  {language === 'hi'
                    ? 'दिन शेष हैं। पूर्ण 4+ दैनिक ऑटोमेशन और AI सुविधाएं सक्रिय हैं।'
                    : 'days remaining. Full 4+ daily video slots & AI generator enabled.'}
                </Text>
              </View>
            </View>

            {/* Plan 1: Monthly Pro (₹500 / month) */}
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'monthly_500' && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan('monthly_500')}
              activeOpacity={0.8}
            >
              <View style={styles.planCardHeader}>
                <View>
                  <Text style={styles.planName}>
                    {language === 'hi' ? 'मासिक प्रो प्लान (1 माह)' : 'Monthly Pro (1 Month)'}
                  </Text>
                  <Text style={styles.planPrice}>₹500</Text>
                  <Text style={styles.billingPeriod}>
                    {language === 'hi' ? 'प्रति माह बिल किया जाएगा' : 'billed monthly'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedPlan === 'monthly_500' && styles.radioCircleSelected,
                  ]}
                >
                  {selectedPlan === 'monthly_500' && <View style={styles.radioDot} />}
                </View>
              </View>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text style={styles.featureText}>
                    {language === 'hi'
                      ? 'यूट्यूब, फेसबुक और इंस्टाग्राम पर एक साथ अपलोड'
                      : 'Simultaneous YouTube, FB & IG syndication'}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text style={styles.featureText}>
                    {language === 'hi'
                      ? '4+ दैनिक वीडियो ऑटोमेशन इंजन'
                      : 'High-Volume 4+ daily scheduled video engine'}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text style={styles.featureText}>
                    {language === 'hi' ? 'जीमेल ऑटो-हार्वेस्टिंग इनगेस्ट' : 'Gmail auto-harvesting webhook'}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text style={styles.featureText}>
                    {language === 'hi' ? 'ओमनीप्रॉम्प्ट™ AI जनरेटर (असीमित)' : 'OmniPrompt™ AI Assistant (Unlimited)'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Plan 2: 3-Months Saver (₹1,350 / 3 Months) */}
            <TouchableOpacity
              style={[
                styles.planCard,
                selectedPlan === 'quarterly_1350' && styles.planCardSelected,
                styles.popularCard,
              ]}
              onPress={() => setSelectedPlan('quarterly_1350')}
              activeOpacity={0.8}
            >
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>
                  {language === 'hi' ? '10% छूट • सबसे लोकप्रिय' : '10% OFF • MOST POPULAR'}
                </Text>
              </View>

              <View style={styles.planCardHeader}>
                <View>
                  <Text style={styles.planName}>
                    {language === 'hi'
                      ? 'त्रैमासिक सेवर प्लान (3 माह)'
                      : 'Quarterly Saver Plan (3 Months)'}
                  </Text>
                  <View style={styles.priceRow}>
                    <Text style={styles.planPrice}>₹1,350</Text>
                    <Text style={styles.strikePrice}>₹1,500</Text>
                  </View>
                  <Text style={styles.billingPeriod}>
                    {language === 'hi'
                      ? '₹450/माह • 3 महीने के लिए कुल ₹1,350'
                      : '₹450/mo • covers full 3-month structured period'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radioCircle,
                    selectedPlan === 'quarterly_1350' && styles.radioCircleSelected,
                  ]}
                >
                  {selectedPlan === 'quarterly_1350' && <View style={styles.radioDot} />}
                </View>
              </View>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text style={styles.featureText}>
                    {language === 'hi'
                      ? 'सभी प्रो सुविधाएं + प्राथमिकता API कतार'
                      : 'Everything in Pro + Priority Queue Dispatch'}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text style={styles.featureText}>
                    {language === 'hi'
                      ? '5 टीम सीट्स एवं ग्रैनुलर RBAC अनुमतियां'
                      : '5 Team Seats with Granular RBAC Permissions'}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={15} color="#10B981" />
                  <Text style={styles.featureText}>
                    {language === 'hi'
                      ? 'फास्ट-ट्रैक वॉलेट निकासी और समर्पित सपोर्ट'
                      : 'Instant Wallet Payouts & Dedicated Support'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Payment Method Selector */}
            <Text style={styles.paymentMethodTitle}>
              {language === 'hi' ? 'भुगतान विधि चुनें' : 'Select Payment Method'}
            </Text>
            <View style={styles.paymentMethodRow}>
              {[
                { id: 'upi', label: 'UPI / QR', icon: 'flash' },
                { id: 'card', label: 'Credit/Debit Card', icon: 'card' },
                { id: 'netbanking', label: 'NetBanking', icon: 'business' },
              ].map((pm) => (
                <TouchableOpacity
                  key={pm.id}
                  style={[
                    styles.pmChip,
                    paymentMethod === pm.id && styles.pmChipActive,
                  ]}
                  onPress={() => setPaymentMethod(pm.id as any)}
                >
                  <Ionicons
                    name={pm.icon as any}
                    size={15}
                    color={paymentMethod === pm.id ? '#8B5CF6' : '#94A3B8'}
                  />
                  <Text
                    style={[
                      styles.pmChipText,
                      paymentMethod === pm.id && styles.pmChipTextActive,
                    ]}
                  >
                    {pm.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* UPI Quick Apps */}
            {paymentMethod === 'upi' && (
              <View style={styles.upiAppsContainer}>
                <Text style={styles.upiAppsLabel}>
                  {language === 'hi' ? 'समर्थित UPI ऍप्स:' : 'Supported UPI Gateway Apps:'}
                </Text>
                <View style={styles.upiAppsRow}>
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                    <View key={app} style={styles.upiBadge}>
                      <Text style={styles.upiBadgeText}>{app}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Success message */}
            {successNotice && (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-done-circle" size={20} color="#10B981" />
                <Text style={styles.successText}>
                  {language === 'hi'
                    ? 'योजना सफलतापूर्वक सक्रिय कर दी गई है!'
                    : 'Plan Activated Successfully! Full Access Granted.'}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Bottom Action */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.subscribeBtn}
              onPress={handleSubscribe}
              disabled={isProcessing}
              activeOpacity={0.8}
            >
              {isProcessing ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.subscribeBtnText}>
                    {language === 'hi'
                      ? `${selectedPlan === 'monthly_500' ? '₹500 / माह' : '₹1,350 / 3 माह'} - सदस्यता लें`
                      : `Subscribe for ${selectedPlan === 'monthly_500' ? '₹500 / Mo' : '₹1,350 / 3 Months'}`}
                  </Text>
                  <Ionicons name="lock-closed" size={15} color="#FFFFFF" />
                </>
              )}
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
    backgroundColor: 'rgba(5, 7, 12, 0.85)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: '#1E293B',
    maxHeight: '90%',
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
    gap: 8,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '700',
  },
  sub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  trialInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  trialInfoTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  trialInfoDesc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  planCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: '#334155',
    marginBottom: 16,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
  },
  popularCard: {
    borderColor: 'rgba(139, 92, 246, 0.4)',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 18,
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planName: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  planPrice: {
    color: '#38BDF8',
    fontSize: 22,
    fontWeight: '800',
  },
  strikePrice: {
    color: '#64748B',
    fontSize: 14,
    textDecorationLine: 'line-through',
  },
  billingPeriod: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#8B5CF6',
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  featuresList: {
    gap: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    color: '#CBD5E1',
    fontSize: 12,
  },
  paymentMethodTitle: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
    marginBottom: 10,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  pmChip: {
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
  pmChipActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#8B5CF6',
  },
  pmChipText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  pmChipTextActive: {
    color: '#FFFFFF',
  },
  upiAppsContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  upiAppsLabel: {
    color: '#64748B',
    fontSize: 11,
    marginBottom: 8,
  },
  upiAppsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  upiBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  upiBadgeText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '600',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  successText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  subscribeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    borderRadius: 16,
    shadowColor: '#8B5CF6',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  subscribeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
