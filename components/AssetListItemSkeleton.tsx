// components/AssetListItemSkeleton.tsx
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Spacer = ({ width = 16 }) => <View style={{ width }} />;

export const AssetListItemSkeleton = () => {
  return (
    <MotiView style={styles.container}>
      <Skeleton colorMode="dark" radius="round" height={42} width={42} />
      <Spacer />
      <View style={{ flex: 1 }}>
        <Skeleton colorMode="dark" height={20} width={'60%'} />
        <Spacer width={8} />
        <Skeleton colorMode="dark" height={16} width={'40%'} />
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Skeleton colorMode="dark" height={20} width={80} />
        <Spacer width={8} />
        <Skeleton colorMode="dark" height={16} width={60} />
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
});
