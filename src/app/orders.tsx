import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { AppHeader, Badge, Caption, Card, Divider, Image, PBold, Screen } from '@/components/ui';
import type { BadgeTone } from '@/components/ui';
import { ORDERS, orderProducts, type Order, type OrderStatus } from '@/data/orders';
import { formatPrice } from '@/data/products';

const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  delivered: 'success',
  shipped: 'primary',
  processing: 'accent',
};

export default function OrdersScreen() {
  return (
    <Screen scroll header={<AppHeader titleTx="orders.title" />}>
      <View style={styles.list}>
        {ORDERS.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </View>
    </Screen>
  );
}

function OrderCard({ order }: { order: Order }) {
  const products = orderProducts(order);

  return (
    <Card>
      <View style={styles.headRow}>
        <PBold tx="orders.order" txOptions={{ id: order.id }} />
        <Badge tone={STATUS_TONE[order.status]} tx={`orders.status.${order.status}`} />
      </View>
      <Caption color="textMuted">{order.date}</Caption>

      <Divider />

      <View style={styles.itemsRow}>
        {products.map(p => (
          <View key={p.id} style={styles.thumb}>
            <Image uri={p.image} aspectRatio={0.8} radius="sm" accessibilityLabel={p.name} />
          </View>
        ))}
        <Caption
          color="textMuted"
          tx="orders.items"
          txOptions={{ count: order.items.length }}
          style={styles.itemsCount}
        />
      </View>

      <View style={styles.totalRow}>
        <Caption color="textMuted" tx="orders.total" />
        <PBold>{formatPrice(order.total)}</PBold>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create(theme => ({
  headRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemsCount: {
    marginStart: theme.spacing.xs,
  },
  itemsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  list: {
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  thumb: {
    width: theme.gap(12),
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
}));
