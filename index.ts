// Entry point.
// Unistyles must be configured (and RTL applied) BEFORE any StyleSheet.create()
// runs or the router renders, so bootstrap comes first.
import '@/theme/bootstrap';

import 'expo-router/entry';
