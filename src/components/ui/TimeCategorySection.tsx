import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { TimeCard } from '@/components/ui/TimeCard';
import { TimeOption } from '@/features/timeselection/service/time.service';
import { getTimeOptionId } from '@/features/timeselection/utils/timeCategories';

interface TimeCategorySectionProps {
  label: string;
  description: string;
  times: TimeOption[];
  expanded: boolean;
  selectedTimeId: string | null;
  onToggle: () => void;
  onSelect: (id: string) => void;
}

export function TimeCategorySection({
  label,
  description,
  times,
  expanded,
  selectedTimeId,
  onToggle,
  onSelect,
}: TimeCategorySectionProps) {
  const visibleTimes = expanded ? times : times.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.grid}>
        {visibleTimes.map((time) => {
          const id = getTimeOptionId(time);
          return (
            <View key={id} style={styles.gridItem}>
              <TimeCard
                time={time}
                isSelected={selectedTimeId === id}
                onPress={() => onSelect(id)}
              />
            </View>
          );
        })}
      </View>

      {times.length > 3 && (
        <Pressable
          onPress={onToggle}
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          style={({ pressed }) => [styles.toggle, pressed && styles.togglePressed]}
        >
          <Text style={styles.toggleText}>{expanded ? 'Ver menos' : `Ver mais (${times.length - 3})`}</Text>
          {expanded
            ? <ChevronUp size={16} color="#45b9e8" />
            : <ChevronDown size={16} color="#45b9e8" />}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(15, 29, 46, 0.72)',
    borderColor: '#29405c',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: '#f8fafc',
    fontSize: 18,
    fontWeight: '800',
  },
  description: {
    color: '#708198',
    fontSize: 11,
    textAlign: 'right',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    flexGrow: 1,
    flexBasis: '30%',
    minWidth: 88,
  },
  toggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
  },
  togglePressed: {
    backgroundColor: 'rgba(69, 185, 232, 0.1)',
  },
  toggleText: {
    color: '#45b9e8',
    fontSize: 13,
    fontWeight: '700',
  },
});
