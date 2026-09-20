import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface WalletScreenProps {
  onOpenWithdrawModal: () => void;
}

export const WalletScreen: React.FC<WalletScreenProps> = ({ onOpenWithdrawModal }) => {
  const { transactions } = useApp();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [currencyMode, setCurrencyMode] = useState<'INR' | 'USD'>('INR');

  // Conversion rate 1 USD = 83.4 INR
  const displayBalance =
    currencyMode === 'INR'
      ? `₹${user.walletBalanceINR.toLocaleString('en-IN')}`
      : `$${Math.round(user.walletBalanceINR / 83.4).toLocaleString('en-US')}`;

  const displayTotal =
    currencyMode === 'INR'
      ? `₹${user.totalEarningsINR.toLocaleString('en-IN')}`
      : `$${Math.round(user.totalEarningsINR / 83.4).toLocaleString('en-US')}`;

  const displayPending =
    currencyMode === 'INR'
      ? `₹${user.pendingClearanceINR.toLocaleString('en-IN')}`
      : `$${Math.round(user.pendingClearanceINR / 83.4).toLocaleString('en-US')}`;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerBadge}>
          <Ionicons name="wallet" size={18} color="#10B981" />
        </View>
        <View>
          <Text style={styles.title}>{t('walletTitle')}</Text>
          <Text style={styles.sub}>{t('walletSubtitle')}</Text>
        </View>
      </View>

      {/* Main Balance Card */}
      <View style={styles.balanceCard}>
        <View style={styles.balanceTopRow}>
          <View>
            <Text style={styles.balanceLabel}>{t('availableBalance')}</Text>
            <Text style={styles.balanceAmount}>{displayBalance}</Text>
          </View>

          {/* Currency Toggle */}
          <TouchableOpacity
            style={styles.currencyToggle}
            onPress={() => setCurrencyMode(currencyMode === 'INR' ? 'USD' : 'INR')}
            activeOpacity={0.8}
          >
            <Text style={styles.currActiveText}>{currencyMode}</Text>
            <Ionicons name="swap-horizontal" size={12} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Secondary metrics */}
        <View style={styles.secondaryRow}>
          <View style={styles.secMetric}>
            <Text style={styles.secLabel}>{t('lifetimeEarnings')}</Text>
            <Text style={styles.secVal}>{displayTotal}</Text>
          </View>

          <View style={styles.secDivider} />

          <View style={styles.secMetric}>
            <Text style={styles.secLabel}>{t('pendingClearing')}</Text>
            <Text style={[styles.secVal, { color: '#F59E0B' }]}>{displayPending}</Text>
          </View>
        </View>

        {/* Withdraw Action Button */}
        <TouchableOpacity
          style={styles.withdrawBtn}
          onPress={onOpenWithdrawModal}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={16} color="#FFFFFF" />
          <Text style={styles.withdrawBtnText}>
            {language === 'hi'
              ? 'तत्काल UPI / बैंक निकासी'
              : 'Instant Payout to UPI / Bank'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Revenue Sources Breakdown */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('revenueDistribution')}</Text>

        {/* YouTube */}
        <View style={styles.revItem}>
          <View style={styles.revTop}>
            <View style={styles.revLeft}>
              <Ionicons name="logo-youtube" size={16} color="#EF4444" />
              <Text style={styles.revName}>{t('youtubeShare')}</Text>
            </View>
            <Text style={styles.revAmount}>₹18,400 (52.8%)</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '52.8%', backgroundColor: '#EF4444' }]} />
          </View>
        </View>

        {/* Instagram */}
        <View style={styles.revItem}>
          <View style={styles.revTop}>
            <View style={styles.revLeft}>
              <Ionicons name="logo-instagram" size={16} color="#E1306C" />
              <Text style={styles.revName}>{t('instagramShare')}</Text>
            </View>
            <Text style={styles.revAmount}>₹11,250 (32.3%)</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '32.3%', backgroundColor: '#E1306C' }]} />
          </View>
        </View>

        {/* Facebook */}
        <View style={[styles.revItem, { marginBottom: 4 }]}>
          <View style={styles.revTop}>
            <View style={styles.revLeft}>
              <Ionicons name="logo-facebook" size={16} color="#1877F2" />
              <Text style={styles.revName}>{t('facebookShare')}</Text>
            </View>
            <Text style={styles.revAmount}>₹5,200 (14.9%)</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '14.9%', backgroundColor: '#1877F2' }]} />
          </View>
        </View>
      </View>

      {/* Recent Payout Transactions */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>{t('recentTransactions')}</Text>

        {transactions.map((tx, idx) => {
          const isWithdrawal = tx.type === 'withdrawal';
          return (
            <View
              key={tx.id}
              style={[
                styles.txRow,
                idx < transactions.length - 1 && styles.txRowBorder,
              ]}
            >
              <View
                style={[
                  styles.txIconCircle,
                  isWithdrawal ? styles.txIconWithdraw : styles.txIconEarning,
                ]}
              >
                <Ionicons
                  name={isWithdrawal ? 'arrow-up' : 'arrow-down'}
                  size={14}
                  color={isWithdrawal ? '#F59E0B' : '#10B981'}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txMeta}>
                  {tx.timestamp} • Ref: {tx.referenceId}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={[
                    styles.txAmount,
                    isWithdrawal ? styles.txAmountWithdraw : styles.txAmountEarning,
                  ]}
                >
                  {isWithdrawal ? '-' : '+'}₹{tx.amountINR.toLocaleString('en-IN')}
                </Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusPillText}>
                    {tx.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0D14',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
  },
  sub: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  balanceTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  balanceLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  balanceAmount: {
    color: '#10B981',
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 2,
  },
  currencyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  currActiveText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  secMetric: {
    flex: 1,
    alignItems: 'center',
  },
  secDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#334155',
  },
  secLabel: {
    color: '#64748B',
    fontSize: 10,
  },
  secVal: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  withdrawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  withdrawBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
  },
  cardLabel: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  revItem: {
    marginBottom: 12,
  },
  revTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  revLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  revName: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },
  revAmount: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  txRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  txIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconWithdraw: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  txIconEarning: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  txTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  txMeta: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 13,
    fontWeight: '700',
  },
  txAmountWithdraw: {
    color: '#F59E0B',
  },
  txAmountEarning: {
    color: '#10B981',
  },
  statusPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
    marginTop: 3,
  },
  statusPillText: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '700',
  },
});
